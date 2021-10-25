import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import CodeBlock from '../components/CodeBlock';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { SupabaseAuthService } from '../services/supabase.auth.service'
import { User } from '@supabase/supabase-js';
const supabaseAuthService: SupabaseAuthService = new SupabaseAuthService();

const Installation: React.FC = () => {
    let _user: User | null = null;

  const { name } = useParams<{ name: string; }>();
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
    )
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        setDarkMode(e.matches)
    })
    useEffect(()=>{
        // Only run this one time!  No multiple subscriptions!
        supabaseAuthService.user.subscribe((user: User | null) => {
          _user = user;
          if (_user) {
            setEmail((_user as any)?.email);
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
        <p>Your server does not have the required functions installed.</p>
        <p>Please install the following functions by executing the following code block in your database.  
            You can do this with any of the following methods:</p>
        <ul>
            <li>Pasting the code into a query window in your Supabase Dashboard and hitting the <b>RUN</b> button.</li>
            <li>Pasting the code into the query window of another third-party app that's connected to your database.</li>
            <li>Pasting the code into <b>psql</b> after connecting to your database with the connection string found in your Supabase Dashboard.</li>
        </ul>
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonLabel><b>INSTALL CODE:</b></IonLabel>
                </IonCol>
                </IonRow><IonRow>
                <IonCol>
                    <CodeBlock language="sql" code={`
                        CREATE EXTENSION IF NOT EXISTS PLV8;

                        DROP FUNCTION IF EXISTS execute_sql;

                        CREATE OR REPLACE FUNCTION execute_sql (sqlcode text, statement_delimiter text)
                        RETURNS json
                        SECURITY DEFINER
                        LANGUAGE PLV8
                        AS $function$
                            if (!plv8.execute("select auth.is_admin()")[0].is_admin) {
                                throw 'not authorized';
                            }
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
                        $function$;

                        
                        DROP FUNCTION IF EXISTS auth.is_admin;

                        CREATE OR REPLACE FUNCTION auth.is_admin ()
                        RETURNS boolean
                        LANGUAGE sql
                        STABLE
                        AS $function$
                            SELECT
                                CASE 
                                    WHEN current_setting('request.jwt.claim.email', TRUE)::text IN ('${email || '<your_admin_email@host.com>'}') 
                                THEN
                                    TRUE
                                ELSE
                                    FALSE
                                END 
                            AS is_admin
                        $function$;

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
                        DROP FUNCTION IF EXISTS auth.is_admin;
                    `} darkMode={darkMode}/>
                </IonCol>
            </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Installation;
