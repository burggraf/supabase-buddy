import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';

// import { keys } from 'rxjs';
import { keys } from './keys.service';

const supabase: SupabaseClient = createClient(keys.SUPABASE_URL, keys.SUPABASE_KEY);

export class SupabaseDataService {

  constructor() {}
  
  // generic sample functions
  public getProperty = async (ListingKey: string, view: string) => {
    const { data, error } = await supabase.rpc('getProperty', { _ListingKey: ListingKey, _view: view });
    return { data, error };    
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
  public async getRows(table: string, whereColumn: string, whereValue: any, columnList: string = '*', offset: number = 0, limit: number = 100) {
    const { data, error } = 
    await supabase.from(table)
    .select(columnList)
    .eq(whereColumn, whereValue)
    .range(offset, offset + limit)
    return { data, error };
  }


}
