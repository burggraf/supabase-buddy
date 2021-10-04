import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import './SqlEditor.css';
import { SupabaseDataService } from '../services/supabase.data.service';
import SqlResults from '../components/SqlResults';
import Editor from "@monaco-editor/react";
import { debounce } from "ts-debounce";
import { Snippet } from '../models/Snippet';
const SqlEditor: React.FC = () => {
    const { id } = useParams<{ id: string; }>();

    const [content, setContent] = useState<string>(localStorage.getItem('sqlQuery') || '');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const supabaseDataService = new SupabaseDataService();

    function handleEditorChange(value: any, event: any) {
        // here is the current value
        console.log('handleEditorChange', value)
        setContent(value);
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
        console.log('content', content);
        if (content) {
            const { data, error } = await supabaseDataService.runSql(content);
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
            <IonBackButton defaultHref="/sql-snippets" />
          </IonButtons>
          <IonTitle>SQL Editor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        <IonGrid style={{height: '50%'}}>
            <IonRow>
                <IonCol>
                    Title: <IonInput 
                            onIonChange={debounce((e) => setTitle(e.detail.value!),750)}
                            type="text" style={{ border: '1px solid'}}/>
                </IonCol>
                <IonCol>
                    Description: <IonInput 
                                onIonChange={debounce((e) => setDescription(e.detail.value!),750)} 
                                type="text" style={{ border: '1px solid'}}/>
                </IonCol>
            </IonRow>
            <IonRow style={{height: '100%'}}>
                <IonCol>
                <Editor
                    className="textarea"
                    // height="50vh"
                    defaultLanguage="sql"
                    defaultValue={content}
                    theme={window.matchMedia('(prefers-color-scheme: dark)').matches ? "vs-dark" : "vs-light"}
                    onChange={debounce(handleEditorChange, 750)}
                    onMount={handleEditorDidMount}
                    beforeMount={handleEditorWillMount}
                    onValidate={handleEditorValidation}
                    options={{
                        minimap: {
                          enabled: false,
                        },
                    }}
                />
                </IonCol>
            </IonRow>
        </IonGrid>
        <SqlResults results={results} />

      </IonContent>
      <IonFooter >
      title: {title} description: {description}
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
