DROP FUNCTION IF EXISTS get_user;
CREATE OR REPLACE FUNCTION get_user(id text) RETURNS JSON SECURITY DEFINER AS $$

    return plv8.execute(
        `SELECT *
            FROM auth.users
            WHERE id = '${id}'
        `);

$$ language PLV8;


