CREATE EXTENSION IF NOT EXISTS PLV8;
CREATE SCHEMA IF NOT EXISTS buddy;
DROP FUNCTION IF EXISTS execute_sql;

CREATE OR REPLACE FUNCTION execute_sql (sqlcode text, statement_delimiter text)
  RETURNS json
  SECURITY DEFINER
  AS $$

  if (plv8.execute('select id from buddy.authorized_users').length == 0) then
      throw 'not authorized';
  end if;
  /*
  if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
      throw 'not authorized';
  }
  */

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

$$
LANGUAGE PLV8;

-- DROP FUNCTION IF EXISTS auth.is_admin;

-- CREATE OR REPLACE FUNCTION auth.is_admin ()
--   RETURNS boolean
--   LANGUAGE sql
--   STABLE
--   AS $function$
--   SELECT
--     CASE WHEN current_setting('request.jwt.claim.email', TRUE)::text IN ('authorized_user@your_domain.com') THEN
--       TRUE
--     ELSE
--       FALSE
--     END AS is_admin
-- $function$
