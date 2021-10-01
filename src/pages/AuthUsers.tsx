import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import './AuthUsers.css';
const Page: React.FC = () => {

  const getUsers = async () => {
}
  const { name } = useParams<{ name: string; }>();
  getUsers();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Users</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>


      </IonContent>
    </IonPage>
  );
};

export default Page;
