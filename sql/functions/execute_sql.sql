CREATE EXTENSION IF NOT EXISTS PLV8;
DROP FUNCTION IF EXISTS execute_sql;
CREATE OR REPLACE FUNCTION execute_sql(sqlcode TEXT, statement_delimiter TEXT) RETURNS JSON SECURITY DEFINER AS $$

if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
    throw 'not authorized';
}

const arr = sqlcode.split(statement_delimiter);
const results = [];

// this handles "TypeError: Do not know how to serialize a BigInt"
function toJson(data) {
  if (data !== undefined) {
    return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
        .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
  }
}

for (let i = 0; i < arr.length; i++) {
    if (arr[i].trim() !== '') {
        const result = plv8.execute(arr[i]);
        results.push(toJson(result));
    }
}
return results;

$$ language PLV8;

DROP FUNCTION IF EXISTS auth.is_admin;
CREATE OR REPLACE FUNCTION auth.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select case when current_setting('request.jwt.claim.email', true)::text 
  IN ('authorized_user@your_domain.com') then true else false end as is_admin
$function$
