CREATE EXTENSION IF NOT EXISTS PLV8;
DROP FUNCTION IF EXISTS execute_sql;
CREATE OR REPLACE FUNCTION execute_sql(sqlcode TEXT, statement_delimiter TEXT) RETURNS JSON SECURITY DEFINER AS $$

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
