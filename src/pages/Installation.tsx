import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CodeBlock from '../components/CodeBlock';
import SupabaseAuthService from '../services/supabase.auth.service';
import SupabaseDataService from '../services/supabase.data.service';
import './Installation.css';
const supabaseDataService = SupabaseDataService.getInstance();
const supabaseAuthService: SupabaseAuthService = new SupabaseAuthService();

const Installation: React.FC = () => {
    let _user: User | null = null;

  // const { name } = useParams<{ name: string; }>();
  const [email, setEmail] = useState('');
  
  const [emails, setEmails] = useState('');
  const [projectref, setProjectref] = useState(JSON.parse(localStorage.getItem('project') || '{}')?.url?.replace('https://','').split('.')[0]);
  const [apikey, setApikey] = useState(JSON.parse(localStorage.getItem('project') || '{}')?.apikey);
  const [password, setPassword] = useState('');

  const [id, setId] = useState('');
  const [installed, setInstalled] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
    )
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        setDarkMode(e.matches)
    })

    const checkServerVersion = async () => {
        const { data: serverVersionData, error: serverVersionError } = 
          await supabaseDataService.checkServerVersion();
          console.log('serverVersionData', serverVersionData,'error', serverVersionError);
            if (serverVersionError && serverVersionError.message.startsWith('Could not find the public.execute_sql')) {
                setInstalled(false);
            } else {
                setInstalled(true);
            }
      }
  
    useEffect(()=>{
        checkServerVersion();
        // Only run this one time!  No multiple subscriptions!
        supabaseAuthService.user.subscribe((user: User | null) => {
          _user = user;
          if (_user) {
            setEmail((_user as any)?.email);
            setEmails((_user as any)?.email);
            setId((_user as any)?.id);
          } else {
              setEmail('');
          }
        });
        // setTimeout(() => {
        //   document.getElementById(selectedAccordionItem)?.click();
        // } , 1000);
      }, []) // <-- empty dependency array
    

    const install = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                'REF': projectref,
                'PASSWORD': password,
                'EMAILS': emails.replace(/ /g, '')
            })
        };
        // const response = await fetch('https://supabase-buddy-middleware.fly.dev', requestOptions);
        const response = await fetch('https://supabase-buddy-middleware.fly.dev/install', requestOptions);
        const data = await response.json();
        console.log('data returned', data);
    }
    const uninstall = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                'REF': projectref,
                'PASSWORD': password
            })
        };
        // const response = await fetch('https://supabase-buddy-middleware.fly.dev', requestOptions);
        const response = await fetch('https://supabase-buddy-middleware.fly.dev/uninstall', requestOptions);
        const data = await response.json();
        console.log('data returned', data);
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Installation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
            <table style={{"width": "100%"}}>
                <tbody>
                    <tr>
                        <td colSpan={2} style={{paddingTop: '5px', paddingBottom: '5px'}}><div className="ion-text-center">
                            <b>Automatic installation (using middleware):</b>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="autoCenter"><b>Project Ref</b>
                        </td>
                        <td>
                            <IonInput
                                className='inputBox'
                                style={{fontWeight: 'bold'}}
                                key='inputRef'
                                value={projectref}
                                debounce={50}
                                onIonChange={e => setProjectref(e.detail.value!)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="autoCenter"><b>API Key</b>
                        </td>
                        <td>
                            <IonInput
                                className='inputBox'
                                style={{fontWeight: 'bold'}}
                                key='inputApikey'
                                value={apikey}
                                debounce={50}
                                onIonChange={e => setApikey(e.detail.value!)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="autoCenter"><b>Password</b>
                        </td>
                        <td>
                            <IonInput
                                className='inputBox'
                                style={{fontWeight: 'bold'}}
                                key='inputPassword'
                                value={password}
                                type='password'
                                debounce={50}
                                onIonChange={e => setPassword(e.detail.value!)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="autoCenter"><b>Emails</b>
                        </td>
                        <td>
                            <IonInput
                                className='inputBox'
                                style={{fontWeight: 'bold'}}
                                key='inputEmails'
                                value={emails}
                                type='email'
                                debounce={50}
                                onIonChange={e => setEmails(e.detail.value!)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

          <IonGrid>
              <IonRow>
                  <IonCol>
                      <div className="ion-text-center">
                      <b>Automatic installation (using middleware):</b>
                      </div>
                  </IonCol>
              </IonRow>
              <IonRow>
                  <IonCol>
                      <IonButton expand="block" strong color="success" onClick={install}>INSTALL</IonButton>
                  </IonCol>
                  <IonCol>
                      <IonButton expand="block" strong color="danger" onClick={uninstall}>UNINSTALL</IonButton>
                  </IonCol>
              </IonRow>
            </IonGrid>
        {!installed && 
            <div className="boldText">
                <p>Your server does not have the required functions installed.</p>
                <p>Please install the following functions by executing the following code block in your database.  
                    You can do this with any of the following methods:</p>
                <ul>
                    <li>Pasting the code into a query window in your Supabase Dashboard and hitting the <b>RUN</b> button.</li>
                    <li>Pasting the code into the query window of another third-party app that's connected to your database.</li>
                    <li>Pasting the code into <b>psql</b> after connecting to your database with the connection string found in your Supabase Dashboard.</li>
                </ul>
            </div>        
        }
        <IonGrid>
            <IonRow>
                <IonCol>
                <div className="ion-text-center">
                <b>Manual Install Code:</b>
                </div>
                </IonCol>
                </IonRow><IonRow>
                <IonCol>
                    <CodeBlock language="sql" code={`
                        CREATE EXTENSION IF NOT EXISTS PLV8;
                        CREATE SCHEMA IF NOT EXISTS buddy;
                        CREATE TABLE IF NOT EXISTS buddy.authorized_users (id UUID PRIMARY KEY);
                        INSERT INTO buddy.authorized_users (id) VALUES ('${id || '00000000-0000-0000-0000-000000000000'}');

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

                        // this handles "TypeError: Do not know how to serialize a BigInt"
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
                    `} darkMode={darkMode}/>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <div className="ion-text-center">
                    <b>Manual Uninstall Code:</b>
                    </div>
                </IonCol>
                </IonRow>
                <IonRow>
                <IonCol>
                    <CodeBlock language="sql" code={`
                        DROP FUNCTION IF EXISTS execute_sql;
                        -- OPTIONAL:
                        DROP TABLE IF EXISTS buddy.authorized_users;
                        DROP SCHEMA IF EXISTS buddy;
                    `} darkMode={darkMode}/>
                </IonCol>
            </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Installation;
