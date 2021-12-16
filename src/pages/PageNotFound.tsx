import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './PageNotFound.css';

const PageNotFound: React.FC = () => {

  // const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Page Not Found</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding ion-text-center">
        <h1><a href="/"><b>LOG IN</b></a></h1>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PageNotFound;
