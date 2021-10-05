DROP FUNCTION IF EXISTS get_column;
CREATE OR REPLACE FUNCTION get_column(table_schema TEXT, table_name TEXT, column_name TEXT) RETURNS JSON SECURITY DEFINER AS $$
if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
    throw 'not authorized';
}

    return plv8.execute(
        `SELECT *
            FROM information_schema.columns
            WHERE table_schema = '${table_schema}'
            AND table_name = '${table_name}'
            AND column_name = '${column_name}'
        `);

$$ language PLV8;


