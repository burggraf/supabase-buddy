DROP FUNCTION IF EXISTS get_user;
CREATE OR REPLACE FUNCTION get_user(id text) RETURNS JSON SECURITY DEFINER AS $$
if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
    throw 'not authorized';
}

    return plv8.execute(
        `SELECT *
            FROM auth.users
            WHERE id = '${id}'
        `);

$$ language PLV8;


