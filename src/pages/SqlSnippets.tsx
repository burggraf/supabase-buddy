import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useParams } from 'react-router';
import './SqlSnippets.css';
import { SupabaseDataService } from '../services/supabase.data.service';
import { useEffect, useState } from 'react';
import { Snippet } from '../models/Snippet';

const SqlSnippets: React.FC = () => {
  const supabaseDataService = new SupabaseDataService();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { name } = useParams<{ name: string; }>();
  const loadSnippets = async () => {
    const { data, error } = await supabaseDataService.getSnippets();
    if (error) { console.error(error); }
    else {
        setSnippets(data!);
    }
  }
  useEffect( () => {
      loadSnippets();
  }, []);
  const addSnippet = () => {

  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>SQL Snippets</IonTitle>
          <IonButtons slot="end">
            <IonButton color="primary" onClick={addSnippet}>
                  <IonIcon size="large" icon={add}></IonIcon>
              </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        snippets: {snippets}
      </IonContent>
    </IonPage>
  );
};

export default SqlSnippets;
