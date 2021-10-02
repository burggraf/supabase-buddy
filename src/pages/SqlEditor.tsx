import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import './SqlEditor.css';
import { SupabaseDataService } from '../services/supabase.data.service';
import SqlResults from '../components/SqlResults';
import Editor from "@monaco-editor/react";
import { debounce } from "ts-debounce";
const SqlEditor: React.FC = () => {
    const [text, setText] = useState<string>(localStorage.getItem('sqlQuery') || '');
    const [results, setResults] = useState<any[]>([]);
    const supabaseDataService = new SupabaseDataService();

    

    
    function handleEditorChange(value: any, event: any) {
        // here is the current value
        console.log('handleEditorChange', value)
        setText(value);
        localStorage.setItem('sqlQuery', value);
      }
    
      function handleEditorDidMount(editor: any, monaco: any) {
        console.log("onMount: the editor instance:", editor);
        console.log("onMount: the monaco instance:", monaco)
      }
    
      function handleEditorWillMount(monaco: any) {
        console.log("beforeMount: the monaco instance:", monaco);
      }
    
      function handleEditorValidation(markers: any) {
        // model markers
        console.log('handleEditorValidation', markers);
        markers.forEach((marker: { message: any; }) => console.log('onValidate:', marker.message));
      }

    console.log('localStorage', localStorage.getItem('sqlQuery'));
  const { name } = useParams<{ name: string; }>();
    const runSql = async () => {
        console.log('text', text);
        if (text) {
            const { data, error } = await supabaseDataService.runSql(text);
            if (error) {
                console.error(error);
            } else {
                console.log('data', data);
                setResults(data!);
            }
        }
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>SQL Editor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonGrid>
            <IonRow>
                <IonCol>
                <Editor
                    className="textarea"
                    height="50vh"
                    defaultLanguage="sql"
                    defaultValue="-- type your sql here"
                    onChange={debounce(handleEditorChange, 750)}
                    onMount={handleEditorDidMount}
                    beforeMount={handleEditorWillMount}
                    onValidate={handleEditorValidation}
                />
                </IonCol>
            </IonRow>
        </IonGrid>
        <SqlResults results={results} />


      </IonContent>
      <IonFooter >
        <IonToolbar>
            <IonButtons slot="end">
                <IonButton color="dark" fill="outline" onClick={runSql}><strong>RUN</strong>
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SqlEditor;
