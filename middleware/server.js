const VERSION = '2';
const http = require('http');
const cors = require("cors");
const app = require("restana")(); // more efficient than express.js
const { Client } = require('pg');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: "*"}));
const port = process.env.PORT || 3000;

app.get(["/", "/:a/:b/:c"], (req, res) => {
  a = req.params.a;
  b = req.params.b;
  c = req.params.c;
  if (true) {
      res.statusCode = 200;
      res.send(`got params: ${a} ${b} ${c}`);
  } else {
      res.statusCode = 400;
      res.send('error message');
  }
});

const getUninstallSQL = () => {
  const SQL = `
    DROP FUNCTION IF EXISTS execute_sql;
    DROP TABLE IF EXISTS buddy.authorized_users;
    DROP SCHEMA IF EXISTS buddy;
  `;
  return SQL;
}
const getInstallSQL = (EMAILS) => {
  const arrEmails = EMAILS.split(',');
  const txtEmails = arrEmails.map(email => `'${email}'`).join(',');
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS PLV8;
    CREATE SCHEMA IF NOT EXISTS buddy;
    CREATE TABLE IF NOT EXISTS buddy.authorized_users (id UUID PRIMARY KEY);

    INSERT INTO buddy.authorized_users (id) 
     (SELECT id from auth.users where email in (${txtEmails}));

    DROP FUNCTION IF EXISTS execute_sql;
    CREATE OR REPLACE FUNCTION execute_sql (sqlcode text, statement_delimiter text)
    RETURNS json
    SECURITY DEFINER
    AS $$

    if (plv8.execute(
        "select id from buddy.authorized_users where id = auth.uid()").length == 0) {
        throw 'not authorized';
    };

    const arr = sqlcode.split(statement_delimiter);
    const results = [];

    function toJson(data) {
        if (data !== undefined) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? \`$\{v\}#bigint\` : v)
            .replace(/"(-?\d+)#bigint"/g, (_, a) => a).replace(/#bigint/g, '');
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
  `;
  return SQL;
};
const uninstall = async (req, res) => {
  // USER (optional) = postgres
  // PASSWORD (required) = postgres password
  // REF (REF or HOST required) = project ref (db.REF.supabase.co)
  // HOST (REF or HOST require) = domain or IP address of the server
  // PORT (optional) = 5432 (port number of the server)
  // DATABASE (optional) = postgres (database name)
  // console.log('uninstall req.body', JSON.stringify(req.body, null, 2));
  const connectionString = 
  `postgresql://${req.body.USER || 'postgres'}:${req.body.PASSWORD || ''}@${req.body.HOST || 'db.' + (req.body.REF || '') + '.supabase.co'}:${req.body.PORT || '5432'}/${req.body.DATABASE || 'postgres'}`;
  try {
    const client = new Client(connectionString);
    await client.connect();
    const response = 
      await client.query(getUninstallSQL());
    res.statusCode = 200;
    res.send({"response": response});
    await client.end();  
  } catch (err) {
    // console.error(err.stack);
    res.statusCode = 400;
    res.send({"err": err.stack});
  }
};

const install = async (req, res) => {
  // USER (optional) = postgres
  // PASSWORD (required) = postgres password
  // REF (REF or HOST required) = project ref (db.REF.supabase.co)
  // HOST (REF or HOST require) = domain or IP address of the server
  // PORT (optional) = 5432 (port number of the server)
  // DATABASE (optional) = postgres (database name)
  // EMAILS (required) = comma separated list of email addresses
  // console.log('req.body', JSON.stringify(req.body, null, 2));
  const connectionString = 
  `postgresql://${req.body.USER || 'postgres'}:${req.body.PASSWORD || ''}@${req.body.HOST || 'db.' + (req.body.REF || '') + '.supabase.co'}:${req.body.PORT || '5432'}/${req.body.DATABASE || 'postgres'}`;
  try {
    const client = new Client(connectionString);
    await client.connect();

    const response = 
      await client.query(getInstallSQL(req.body.EMAILS || ''));
    // console.log(response); // Hello world!
    res.statusCode = 200;
    res.send({"response": response});
    await client.end();  
  } catch (err) {
    // console.error(err.stack);
    res.statusCode = 400;
    res.send({"err": err.stack});
  }
};

app.post("/install", (req, res) => {
  install(req, res);
});
app.post("/uninstall", (req, res) => {
  uninstall(req, res);
});

http.createServer(app).listen(port, '0.0.0.0', function () {
  console.log(`supabase-buddy-middleware app listening on port ${port}!`);
})