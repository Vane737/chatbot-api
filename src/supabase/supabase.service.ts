import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabaseClient: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const url = this.configService.get<string>('supabase.url');
        const key = this.configService.get<string>('supabase.key');
        this.supabaseClient = createClient(url, key);
    }

    async insertVector(embedding: number[], title: string, body: string): Promise<any> {
        const { data, error } = await this.supabaseClient
          .from('vector_entity')
          .insert([{ title, body, embedding }]);
    
        if (error) throw error;
        return data;
    }

    async insertarPropiedad(embeddings: number[], id_propiedades: number, body: string): Promise<any> {
      console.log('hola');
      try {
      const { data, error } = await this.supabaseClient
        .from('propiedades')
        .insert([{ embeddings, id_propiedades, body }]);

        if (error) {
          console.error('Error inserting data:', error.message);
        } else {
          console.log('Data inserted successfully:', data);
        }
      } catch (error) {
        console.error('Error generating embedding or inserting data:', error.message);
      }
    }

    async getBodyByIdPropiedades(idPropiedades: number): Promise<string> {
      const { data, error } = await this.supabaseClient
        .from('propiedades')
        .select('body')
        .eq('id_propiedades', idPropiedades)
        .single();
      if (error) {
        console.error('Error fetching body:', error);
        throw new Error('Error fetching body');
      }
  
      return data ? data.body : "";
    }

    async matchDocuments(queryEmbedding: number[], matchThreshold: number, matchCount: number): Promise<any> {
        const { data, error } = await this.supabaseClient.rpc('match_propiedades', {
          query_embedding: queryEmbedding,
          match_threshold: matchThreshold,
          match_count: matchCount,
        });    
        if (error) {
          console.error('Error searching for matches:', error);
          throw new Error('Error searching for matches');
        }
    
        return data;
    }

    async getAllEmbeddings() {
      const { data, error } = await this.supabaseClient
        .from('propiedades')
        .select('id_propiedades, body, embeddings');  
      if (error) {
        throw error;
      }  
      return data.map(item => ({
        id_propiedades: item.id_propiedades,
        body: item.body,
        embeddings: JSON.parse(item.embeddings)  // Convertir string a array de números
      }));
    }

    private calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
      const dotProduct = embedding1.reduce((acc, val, i) => acc + val * embedding2[i], 0);
      const norm1 = Math.sqrt(embedding1.reduce((acc, val) => acc + val * val, 0));
      const norm2 = Math.sqrt(embedding2.reduce((acc, val) => acc + val * val, 0));
      return dotProduct / (norm1 * norm2);
    }


    async compareEmbeddings(queryEmbedding: number[]): Promise<any[]> {
      const threshold:number = 0.8
      const embedding = await this.getAllEmbeddings();
      const similarities = embedding.map(({ id_propiedades,body, embeddings }) => ({
        id_propiedades,
        body,
        similarity: this.calculateCosineSimilarity(queryEmbedding, embeddings),
      }));
    
      const filteredResults = similarities.filter(result => result.similarity >= threshold);
      filteredResults.sort((a, b) => b.similarity - a.similarity);

      return similarities;
    }


}
