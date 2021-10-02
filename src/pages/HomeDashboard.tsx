import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './HomeDashboard.css';
import { SupabaseDataService } from '../services/supabase.data.service';

const HomeDashboard: React.FC = () => {
    const supabaseDataService = new SupabaseDataService()
  const { name } = useParams<{ name: string; }>();
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
      </IonContent>
    </IonPage>
  );
};

export default HomeDashboard;
