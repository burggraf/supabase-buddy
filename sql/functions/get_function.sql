DROP FUNCTION IF EXISTS get_function;
CREATE OR REPLACE FUNCTION get_function(function_schema text, function_name text) RETURNS JSON SECURITY DEFINER AS $$

    return plv8.execute(
        `select n.nspname as function_schema,
       p.proname as function_name,
       l.lanname as function_language,
       case when l.lanname = 'internal' then p.prosrc
            else pg_get_functiondef(p.oid)
            end as definition,
       pg_get_function_arguments(p.oid) as function_arguments,
       t.typname as return_type
        from pg_proc p
        left join pg_namespace n on p.pronamespace = n.oid
        left join pg_language l on p.prolang = l.oid
        left join pg_type t on t.oid = p.prorettype 
        where n.nspname = '${function_schema}'
        and p.proname = '${function_name}'
        `);

$$ language PLV8;


