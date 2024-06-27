import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import  { createStuffDocumentsChain }  from 'langchain/chains/combine_documents';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { RunnableBranch, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from '@langchain/core/output_parsers';

// Definición de la interfaz Inmueble
export interface Inmueble {
  id: number;
  descripcion: string;
  cantidadCuartos: number;
  enVenta: boolean;
  enAlquiler: boolean;
}


@Injectable()
export class LangchainService {
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private client: SupabaseClient;
  private vectorStore: SupabaseVectorStore;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('supabase.key');
    if (!key) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

    const url = this.configService.get<string>('supabase.url');
    if (!url) throw new Error(`Expected env var SUPABASE_URL`);

    this.client = createClient(url, key);

    const apiKey = this.configService.get<string>('openai.apiKey');

    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.9,
    });

    // Configuración de OpenAI para embeddings
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
    });
  }

  async initializeData() {
    const { data, error } = await this.client
      .from('inmuebles')
      .upsert([
        {
          id: 1,
          descripcion: 'Casa amplia con jardín',
          cantidadCuartos: 3,
          enVenta: true,
          enAlquiler: false,
        },
        {
          id: 2,
          descripcion: 'Apartamento céntrico',
          cantidadCuartos: 2,
          enVenta: false,
          enAlquiler: true,
        },
        {
          id: 3,
          descripcion: 'Chalet con piscina',
          cantidadCuartos: 4,
          enVenta: true,
          enAlquiler: true,
        },
      ])
      .select();

    if (error) {
      console.error('Error upserting inmuebles data:', error.message);
      return;
    }

    // Verificar los datos insertados/upsertados
    console.log('Inserted/Upserted inmuebles data:', data);

    // Cargar y vectorizar datos de inmuebles
    await this.loadInmueblesData();
  }

  async loadInmueblesData() {
    const { data: inmuebles, error } = await this.client.from('inmuebles').select('*');
    if (error) {
      console.error('Error fetching inmuebles data:', error.message);
      return;
    }

    const docs = inmuebles.map(inmueble => ({
      pageContent: `Descripción: ${inmueble.descripcion}, Cantidad de Cuartos: ${inmueble.cantidadCuartos}, En Venta: ${inmueble.enVenta ? 'Sí' : 'No'}, En Alquiler: ${inmueble.enAlquiler ? 'Sí' : 'No'}`,
      metadata: { id: inmueble.id }
    }));

    await SupabaseVectorStore.fromDocuments(docs, this.embeddings, {
      client: this.client,
      tableName: 'properties',
      queryName: 'match_properties',
    });
  }



  async searchAndAnswer(query: string, id_conversation: number) {
    try {
      // Generar el embedding de la consulta
      const queryEmbedding = await this.embeddings.embedQuery(query);
  
      // Realizar la búsqueda en la base de datos utilizando la función almacenada
      const { data: results, error } = await this.client.rpc('match_properties', {
        query_embedding: queryEmbedding,
        // match_threshold: 0.7, // Ajusta el umbral según sea necesario
        match_count: 5,
      });
  
      if (error) {
        console.error('Error fetching matching properties:', error.message);
        return;
      }
  
      // Verificar si results es undefined o null
      if (!results || !Array.isArray(results) || results.length === 0) {
        console.error('No results found.');
        return;
      }
  
      // Preparar los documentos con el contexto basado en los resultados de la búsqueda
      const documents = [];
      for (const result of results) {
        documents.push({
          pageContent: result.content,
          metadata: { id: result.id }
        });
      }
  
      // Verificar el contexto que se va a pasar al template
      console.log('Contexto preparado:', documents);
  
      // Definir el prompt de la conversación
      const vectorStore = new SupabaseVectorStore(this.embeddings, {
        client: this.client,
        tableName: 'properties',
        queryName: 'match_properties',
      });
      
      // const responses = await documentChain.invoke({ documents });
      const retriever = vectorStore.asRetriever(10)
      
      const docs = await retriever.invoke(query);
      
      console.log(docs);

      const SYSTEM_TEMPLATE = `Responde las preguntas del usuario basándote en el siguiente contexto.
      Si el contexto no contiene información relevante para la pregunta, no inventes nada y da una respuesta cordialmente:
      
      <contexto>
      {context}
      </contexto>
      `;
  
      const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
        ["system", SYSTEM_TEMPLATE],
        new MessagesPlaceholder("messages"),
      ]);
  
      // Crear la cadena de documentos con el contexto preparado
      const documentChain = await createStuffDocumentsChain({
        llm: this.llm,
        prompt: questionAnsweringPrompt,
      });
      
      
      const msj = [
        new HumanMessage("informacion de las casas con jardin y en venta"),
        new AIMessage("Las casas con jardín y en venta son la siguiente:\n\n1. Casa amplia con jardín\nCantidad de Cuartos: 3\nEn Venta: Sí"),
        // { content: "¿Puedes decirme sobre las propiedades en alquiler ahora?", role: "user" }
      ];
      
      // Define la función parseRetrieverInput que toma los mensajes y extrae el último mensaje
      const parseRetrieverInput = (params: { messages: BaseMessage[] }) => {
        console.log('Estos son los mensajes de params', params.messages);
        
        return params.messages[params.messages.length - 1].content;
      };
      

    const queryTransformPrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("messages"),
      [
        "user",
        "Dada la conversación anterior, genera una consulta de búsqueda para obtener información relevante para la conversación. Solo responde con la consulta, nada más.",
      ],
    ]);

    

    const queryTransformingRetrieverChain = RunnableBranch.from([
      [
        (params: { messages: BaseMessage[] }) => params.messages.length === 1,
        RunnableSequence.from([parseRetrieverInput, retriever]),
      ],
      queryTransformPrompt.pipe(this.llm).pipe(new StringOutputParser()).pipe(retriever),
    ]).withConfig({ runName: "chat_retriever_chain" });


    const conversationalRetrievalChain = RunnablePassthrough.assign({
      context: queryTransformingRetrieverChain,
    }).assign({
      answer: documentChain,
    });

    const response = await conversationalRetrievalChain.invoke({
      messages: [
        ...msj,
        new HumanMessage(query)
      ],
    });

    console.log(response);
      return response;

    } catch (err) {
      console.error('Error en la función searchAndAnswer:', err);
      throw err; // Puedes manejar el error según sea necesario
    }
  }

}
