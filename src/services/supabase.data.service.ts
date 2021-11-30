import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';

import { Snippet } from '../models/Snippet';
import { ProjectsService } from '../services/projects.service';

const projectsService: ProjectsService = new ProjectsService();

// import { keys } from 'rxjs';
// import { keys } from './keys.service';

let supabase: SupabaseClient; // = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);

export class SupabaseDataService {

  constructor() {}
  
  public isConnected = () => {
    return (typeof supabase !== 'undefined');
  }

  public connect = async () => {
      const url = ProjectsService.project.url;
      const apikey = ProjectsService.project.apikey;
      if (url && apikey) {
        supabase = await createClient(url, apikey);
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
      console.error('error parsing data', err);
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

  public async getExtensions() {
    return this.runStatement(
    `select * from pg_available_extensions 
    order by case when installed_version is null then 2 else 1 end, name`);
  }
  public async installExtension(name: string) {
    return this.runStatement(
    `CREATE EXTENSION IF NOT EXISTS "${name}"`);
  }
  public async unInstallExtension(name: string) {
    return this.runStatement(
    `DROP EXTENSION IF EXISTS "${name}"`);
  }

  public async getTables(exclude_schemas: string = "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage'") {
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
  public async getSchemas() {
    return this.runStatement(`SELECT schema_name FROM information_schema.schemata order by schema_name`);
  }

  public async getUsers(orderBy: string = 'email', ascending: boolean = true, limit: number = 100, offset: number = 0) {
    return this.runStatement(`SELECT id, email, phone, last_sign_in_at FROM auth.users order by ${orderBy} ${ascending?'ASC':'DESC'} limit ${limit} offset ${offset}`);
  }
  public async getAuthorizedUsers(orderBy: string = 'email', ascending: boolean = true, limit: number = 100, offset: number = 0) {
    return this.runStatement(`SELECT id, email, phone, last_sign_in_at FROM auth.users where id in (select id from buddy.authorized_users) order by ${orderBy} ${ascending?'ASC':'DESC'} limit ${limit} offset ${offset}`);
  }
  public async getUserCount() {
    return  this.runStatement(`SELECT count(*)::INT4 as total FROM auth.users`);
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
  public async getView(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT *
    FROM information_schema.views
    WHERE table_schema = '${table_schema}'
    AND table_name = '${table_name}'
    `);
  }
  public async getViews(exclude_schemas: string = "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage'") {
    return this.runStatement(`SELECT table_schema, table_name
    FROM information_schema.views
    WHERE table_schema NOT IN (${exclude_schemas})
    `);
  }
  public async createSnippetsTable() {
    console.log('create table');
    this.runSql(`CREATE TABLE IF NOT EXISTS snippets (
      id UUID UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4(),
      userid UUID DEFAULT auth.uid() REFERENCES auth.users(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      statement_delimiter TEXT NOT NULL DEFAULT ';',
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP
    );;
    ALTER TABLE IF EXISTS public.snippets ENABLE ROW LEVEL SECURITY;;
    DROP POLICY IF EXISTS "user can manipulate their own snippets" ON public.snippets;
    CREATE POLICY "user can manipulate their own snippets" 
      ON public.snippets FOR ALL 
      USING (userid = auth.uid()) 
      WITH CHECK (userid = auth.uid());;`, ';;').catch((err) => {
        console.error('Error creating snippets table:', err);
      });
  }
  public async getPrimaryKeys(table_schema: string, table_name: string) {
    return this.runStatement(`SELECT               
    pg_attribute.attname, 
    format_type(pg_attribute.atttypid, pg_attribute.atttypmod) 
  FROM pg_index, pg_class, pg_attribute, pg_namespace 
  WHERE 
    pg_class.oid = '${table_name}'::regclass AND 
    indrelid = pg_class.oid AND 
    nspname = '${table_schema}' AND 
    pg_class.relnamespace = pg_namespace.oid AND 
    pg_attribute.attrelid = pg_class.oid AND 
    pg_attribute.attnum = any(pg_index.indkey)
   AND indisprimary
    `);
  }
  public async upsertRecord(table_schema: string, table_name: string, record: any) {
    if (!this.isConnected()) {
      await this.connect();
    }
    const { data, error } = await supabase.from(table_name)
    .upsert(record);
    return { data, error };
  }
  public async checkServerVersion() {
    return await this.runStatement(`SELECT version()`);
  }
  public async deleteAuthorizedUser(id: string) {
    return this.runStatement(`DELETE FROM buddy.authorized_users WHERE id = '${id}'`);
  }
  public async addAuthorizedUser(id: string) {
    return this.runStatement(`INSERT INTO buddy.authorized_users (id) VALUES ('${id}')`);
  }
}
