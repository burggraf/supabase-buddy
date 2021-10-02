import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { checkmark } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import './SqlEditor.css';
import { SupabaseDataService } from '../services/supabase.data.service';
const SqlEditor: React.FC = () => {
    const [text, setText] = useState<string>();
    const supabaseDataService = new SupabaseDataService();
  const { name } = useParams<{ name: string; }>();
    const runSql = async () => {
        console.log('text', text);
        if (text) {
            const { data, error } = await supabaseDataService.runSql(text);
            console.log('error', error);
            console.log('data', data);
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
                        onIonChange={e => setText(e.detail.value!)}></IonTextarea>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>row 2 col1</IonCol>
            </IonRow>
        </IonGrid>

      </IonContent>
      <IonFooter >
        <IonToolbar>
            <IonButtons slot="end">
                <IonButton color="dark" fill="outline" onClick={runSql}><strong>RUN</strong>
                  {/* <IonIcon size="large" icon={checkmark}></IonIcon> */}
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SqlEditor;
