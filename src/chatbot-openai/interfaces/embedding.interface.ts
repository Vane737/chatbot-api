interface Embedding {
    object: string;
    index: number;
    embedding: number[];
  }
  
  interface Usage {
    prompt_tokens: number;
    total_tokens: number;
  }
  
  export interface OpenAIResponse {
    object: string;
    data: Embedding[];
    model: string;
    usage: Usage;
  }