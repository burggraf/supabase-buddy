import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';
import { Snippet } from '../models/Snippet';

// import { keys } from 'rxjs';
// import { keys } from './keys.service';

let supabase: SupabaseClient; // = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);

export class SupabaseDataService {

  constructor() {}
  
  public isConnected = () => {
    return (typeof supabase !== 'undefined');
  }

  public connect = async () => {
      const url = localStorage.getItem('url');
      const anonkey = localStorage.getItem('anonkey');
      console.log('url', url);
      console.log('anonkey', anonkey);
      if (url && anonkey) {
        supabase = await createClient(url, anonkey);
        return true;
      } else {
        return false;
      }
  }


  public async runSql(sql: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = 
    await supabase.rpc('execute_sql', {sqlcode: sql});
    return { data, error };
  }
  
  public async getSnippets(sortBy: any[] = ['created_at', false]) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.from('snippets')
    .select('*')
    .order(sortBy[0], {ascending: sortBy[1]});
    return { data, error };
  }
  
  public async createSnippet(snippet: Snippet) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.from('snippets')
    .insert(snippet);
    return { data, error };
  }

}
