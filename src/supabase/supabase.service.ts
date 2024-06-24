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

    async matchDocuments(queryEmbedding: number[], matchThreshold: number, matchCount: number): Promise<any> {
        const { data, error } = await this.supabaseClient.rpc('match_documents', {
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
}
