DROP FUNCTION IF EXISTS get_tables;
CREATE OR REPLACE FUNCTION get_tables(options JSON) RETURNS JSON SECURITY DEFINER AS $$

    const exclude_schemas = 
        options.exclude_schemas || 
        "'pg_catalog', 'information_schema', 'extensions', 'auth', 'storage'";

    return plv8.execute(
        `SELECT information_schema.tables.*,pg_description.description 
        FROM information_schema.tables 
        LEFT OUTER JOIN pg_description 
        ON pg_description.objoid = (information_schema.tables.table_schema || '.' || information_schema.tables.table_name)::regclass
        WHERE table_schema 
        NOT IN (${exclude_schemas})
        `);

$$ language PLV8;


