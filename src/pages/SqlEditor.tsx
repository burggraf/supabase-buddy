import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import './SqlEditor.css';
import { SupabaseDataService } from '../services/supabase.data.service';
import SqlResults from '../components/SqlResults';
const SqlEditor: React.FC = () => {
    const [text, setText] = useState<string>(localStorage.getItem('sqlQuery') || '');
    const [results, setResults] = useState<any[]>([]);
    const supabaseDataService = new SupabaseDataService();

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
                    <IonTextarea className="textarea"
                        placeholder="SQL Statement" 
                        rows={10} 
                        value={text} 
                        debounce={750}
                        onIonChange={e => {setText(e.detail.value!);localStorage.setItem('sqlQuery',e.detail.value!);}}></IonTextarea>
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
