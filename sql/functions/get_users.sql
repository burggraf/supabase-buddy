DROP FUNCTION IF EXISTS get_users;
CREATE OR REPLACE FUNCTION get_users() RETURNS JSON SECURITY DEFINER AS $$

    return plv8.execute(
        `SELECT *
            FROM auth.users
        `);

$$ language PLV8;


