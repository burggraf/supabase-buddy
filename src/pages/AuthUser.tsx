import { IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SupabaseDataService } from '../services/supabase.data.service';
import './AuthUser.css';
import Moment from 'moment';

const AuthUser: React.FC = () => {
    const { id } = useParams<{ id: string; }>();

	const supabaseDataService = new SupabaseDataService()
    const [user, setUser] = useState<any>({})

    const loadUser = async () => {
		const { data, error } = await supabaseDataService.getUser(id)
		if (error) {
			console.error(error)
		} else {
            if (data && data.length > 0 ) {
                setUser(data![0]);
            }
		}
	}
	useEffect(() => {
		loadUser()
	}, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/auth-users" />
          </IonButtons>
          <IonTitle>User Detail</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
          <IonGrid>
              {Object.keys(user).map((key, index) => {
                  return (
                        <IonRow key={index}>
                            <IonCol size="4">
                                <IonLabel>{key}</IonLabel>
                            </IonCol>
                            <IonCol size="8">
                                <IonLabel>
                                    {typeof user[key] !== 'object' && user[key]}
                                    {typeof user[key] === 'object' && JSON.stringify(user[key])}
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                  )})}
          </IonGrid>
        {/* <IonGrid>

        {Object.keys(user).map((key, index) => {
                        return (
                            <IonRow key={key}>
                                <IonCol>{key}</IonCol>
                                <IonCol>{user[key]}</IonCol>
                            </IonRow>
                        )
                    })}

        </IonGrid> */}

      </IonContent>
    </IonPage>
  );
};

export default AuthUser;
