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


  public async runSql(sql: string, statementDelimiter: string = ';') {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = 
    await supabase.rpc('execute_sql', {sqlcode: sql, statement_delimiter: statementDelimiter});
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

  public async getSnippet(id: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.from('snippets')
    .select('*')
    .eq('id', id)
    .single();
    return { data, error };
  }

  public async deleteSnippet(id: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.from('snippets')
    .delete()
    .eq('id', id);
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

  public async saveSnippet(snippet: Snippet) {
    if (!this.isConnected()) {
      await this.connect();
    }
    // snippet.updated_at = new Date().toISOString();
    snippet.updated_at = 'NOW()'; 
    const { data, error } = await supabase.from('snippets')
    .upsert(snippet);
    return { data, error };
  }

  public async getFunctions(exclude_schemas: string = '') {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_functions', {options: {exclude_schemas: exclude_schemas}});
    return { data, error };
  }

  public async getFunction(function_schema: string, function_name: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_function', {function_schema, function_name});
    return { data, error };
  }


  public async getTables(exclude_schemas: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_tables', {options: {exclude_schemas: exclude_schemas}});
    return { data, error };
  }

  public async getColumns(table_schema: string, table_name: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_columns', {table_schema, table_name});
    return { data, error };
  }

  public async getColumn(table_schema: string, table_name: string, column_name: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_column', {table_schema, table_name, column_name});
    return { data, error };
  }

  public async getUsers() {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_users', {});
    return { data, error };
  }
  public async getUser(id: string) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.rpc('get_user', {id});
    return { data, error };
  }



}
