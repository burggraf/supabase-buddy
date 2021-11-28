import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import './HomeDashboard.css';
import { SupabaseDataService } from '../services/supabase.data.service';
import { useEffect, useState } from 'react';
const supabaseDataService = new SupabaseDataService();

const HomeDashboard: React.FC = () => {
  const history = useHistory();

  const [serverVersion, setServerVersion] = useState<string>();
  const [present, dismiss] = useIonToast();
  const toast = (message: string, color: string = 'danger') => {
      present({
          color: color,
          message: message,
          cssClass: 'toast',
          buttons: [{ icon: 'close', handler: () => dismiss() }],
          duration: 6000,
          //onDidDismiss: () => console.log('dismissed'),
          //onWillDismiss: () => console.log('will dismiss'),
        })
  }

    const checkServerVersion = async () => {
      const { data: serverVersionData, error: serverVersionError } = 
        await supabaseDataService.checkServerVersion();
          if (serverVersionError && serverVersionError.message.startsWith('Could not find the public.execute_sql')) {
            history.replace('/installation');
            return;            
          } else if (serverVersionError) {
            console.error(serverVersionError);
            if (serverVersionError.message === 'JWSError JWSInvalidSignature') {
              // checkServerVersion error: JWSError JWSInvalidSignature
              history.replace('/welcome');
            } else {
              toast('checkServerVersion error: ' + serverVersionError.message, 'danger');
            }
          } else {
            console.log('serverVersionData', serverVersionData);
            setServerVersion((serverVersionData as any)[0].version);
          }
    }

    useEffect(() => {
      checkServerVersion();
    } , [])

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
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel><b>Server Version</b></IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>{serverVersion}</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomeDashboard;
