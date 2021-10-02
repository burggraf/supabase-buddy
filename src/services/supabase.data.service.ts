import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';

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

  // generic sample functions
  public async getRow(table: string, whereColumn: string, whereValue: any, columnList: string = '*') {
    const { data, error } = 
    await supabase.from(table)
    .select(columnList)
    .eq(whereColumn, whereValue)
    .limit(1)
    .single(); // return a single object (not an array)
    return { data, error };
  }

  public async getAllRows(table: string, offset: number = 0, limit: number = 100) {
    console.log('supabase', supabase);
    const { data, error } = 
    await supabase.from(table)
    .select('*')
    .range(offset, offset + limit)
    return { data, error };
  }

  public async getRows(table: string, whereColumn: string, whereValue: any, columnList: string = '*', offset: number = 0, limit: number = 100) {
    const { data, error } = 
    await supabase.from(table)
    .select(columnList)
    .eq(whereColumn, whereValue)
    .range(offset, offset + limit)
    return { data, error };
  }


}
