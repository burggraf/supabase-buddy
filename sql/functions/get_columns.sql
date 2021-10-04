DROP FUNCTION IF EXISTS get_columns;
CREATE OR REPLACE FUNCTION get_columns(table_schema TEXT, table_name TEXT) RETURNS JSON SECURITY DEFINER AS $$

    return plv8.execute(
        `SELECT *
            FROM information_schema.columns
            WHERE table_schema = '${table_schema}'
            AND table_name = '${table_name}'
        `);

$$ language PLV8;


