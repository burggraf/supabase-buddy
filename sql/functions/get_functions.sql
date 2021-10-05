DROP FUNCTION IF EXISTS get_functions;
CREATE OR REPLACE FUNCTION get_functions(options JSON) RETURNS JSON SECURITY DEFINER AS $$
if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
    throw 'not authorized';
}

    const exclude_schemas = 
        options.exclude_schemas || 
        "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage', 'pgbouncer'";

    return plv8.execute(
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

$$ language PLV8;


