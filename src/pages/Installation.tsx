import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CodeBlock from '../components/CodeBlock';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import SupabaseAuthService from '../services/supabase.auth.service'
import { User } from '@supabase/supabase-js';
import SupabaseDataService from '../services/supabase.data.service';
const supabaseDataService = SupabaseDataService.getInstance();
const supabaseAuthService: SupabaseAuthService = new SupabaseAuthService();

const Installation: React.FC = () => {
    let _user: User | null = null;

  const { name } = useParams<{ name: string; }>();
  const [email, setEmail] = useState('');
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
            setId((_user as any)?.id);
          } else {
              setEmail('');
          }
        });
        // setTimeout(() => {
        //   document.getElementById(selectedAccordionItem)?.click();
        // } , 1000);
      }, []) // <-- empty dependency array
    
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
                    <IonLabel><b>INSTALL CODE:</b></IonLabel>
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
                    `} darkMode={darkMode}/>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonLabel><b>UNINSTALL CODE:</b></IonLabel>
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
