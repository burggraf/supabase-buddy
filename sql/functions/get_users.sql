DROP FUNCTION IF EXISTS get_users;
CREATE OR REPLACE FUNCTION get_users() RETURNS JSON SECURITY DEFINER AS $$
if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
    throw 'not authorized';
}

    return plv8.execute(
        `SELECT id, email, phone, last_sign_in_at
            FROM auth.users
        `);

$$ language PLV8;


