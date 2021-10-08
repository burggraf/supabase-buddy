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

  public async runStatement(sql: string) {
    let { data, error } = await this.runSql(sql);
    try {
      if (data!) {
        data = JSON.parse(data![0]);
      }
    } catch(err) {
      console.log('error parsing data', err);
    }
    return { data, error };
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

  public async getFunctions(exclude_schemas: string = "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage', 'pgbouncer'") {
    return this.runStatement(
        `select n.nspname as function_schema,
       p.proname as function_name,
       l.lanname as function_language,
       pg_get_function_arguments(p.oid) as function_arguments,
       t.typname as return_type
        from pg_proc p
        left join pg_namespace n on p.pronamespace = n.oid
        left join pg_language l on p.prolang = l.oid
        left join pg_type t on t.oid = p.prorettype 
        where n.nspname not in (${exclude_schemas})
        order by function_schema,
         function_name;
        `);
  }

  public async getFunction(function_schema: string, function_name: string) {
    return this.runStatement(`select n.nspname as function_schema,
    p.proname as function_name,
    l.lanname as function_language,
    case when l.lanname = 'internal' then p.prosrc
         else pg_get_functiondef(p.oid)
         end as definition,
    pg_get_function_arguments(p.oid) as function_arguments,
    t.typname as return_type, p.prosecdef as security_definer
     from pg_proc p
     left join pg_namespace n on p.pronamespace = n.oid
     left join pg_language l on p.prolang = l.oid
     left join pg_type t on t.oid = p.prorettype 
     where n.nspname = '${function_schema}'
     and p.proname = '${function_name}'
     `);
  }


  public async getTables(exclude_schemas: string = "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage'") {
    console.log('******');
    console.log(`SELECT information_schema.tables.*,pg_description.description 
    FROM information_schema.tables 
    LEFT OUTER JOIN pg_description 
    ON pg_description.objoid = (information_schema.tables.table_schema || '.' || information_schema.tables.table_name)::regclass
    WHERE table_schema 
    NOT IN (${exclude_schemas})
    `);

    return this.runStatement(`SELECT information_schema.tables.*,pg_description.description 
    FROM information_schema.tables 
    LEFT OUTER JOIN pg_description 
    ON pg_description.objoid = (information_schema.tables.table_schema || '.' || information_schema.tables.table_name)::regclass
    WHERE table_schema 
    NOT IN (${exclude_schemas})
    `);
  }

  public async getColumns(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM information_schema.columns
    WHERE table_schema = '${table_schema}'
    AND table_name = '${table_name}'
    `);
  }
  public async getTableRows(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM ${table_schema}.${table_name}
    LIMIT 100 OFFSET 0
    `);
  }

  public async getColumn(table_schema: string, table_name: string, column_name: string) {
    return this.runStatement(`SELECT *
    FROM information_schema.columns
    WHERE table_schema = '${table_schema}'
    AND table_name = '${table_name}'
    AND column_name = '${column_name}'
    `);
  }

  public async getUsers() {
    return this.runStatement(`SELECT id, email, phone, last_sign_in_at FROM auth.users`);
  }
  public async getUser(id: string) {
    return this.runStatement(`SELECT *
    FROM auth.users
    WHERE id = '${id}'
    `);
  }
  public async getIndexes(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM pg_indexes
    WHERE schemaname = '${table_schema}'
    AND tablename = '${table_name}'
    `);
  }
  public async getGrants(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM information_schema.role_table_grants
    WHERE table_schema = '${table_schema}'
    AND table_name = '${table_name}'
    `);
  }
  public async getRLSPolicies(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM pg_policies
    WHERE schemaname = '${table_schema}'
    AND tablename = '${table_name}'
    `);
  }


}
