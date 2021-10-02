import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './HomeDashboard.css';
import { SupabaseDataService } from '../services/supabase.data.service';

const HomeDashboard: React.FC = () => {
    const supabaseDataService = new SupabaseDataService()
  const { name } = useParams<{ name: string; }>();
    const connect = async () => {
        const result = await supabaseDataService.connect();
        console.log(result);
    }
  const test = async () => {
        console.log("test");
        await supabaseDataService.connect();
        const { data, error } = await supabaseDataService.getAllRows('test');
        console.log('error', error);
        console.log('data', data);
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
      <IonButton strong color="primary" onClick={connect}>Connect</IonButton>
        <IonButton strong color="primary" onClick={test}>Test</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomeDashboard;
