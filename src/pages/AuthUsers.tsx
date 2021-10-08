import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { SupabaseDataService } from '../services/supabase.data.service';
import './AuthUsers.css';
import Moment from 'moment';

const AuthUsers: React.FC = () => {
	const supabaseDataService = new SupabaseDataService();
    const history = useHistory();
    const [users, setUsers] = useState<any[]>([])
	const loadUsers = async () => {
		const { data, error } = await supabaseDataService.getUsers()
		if (error) {
			console.error(error)
		} else {
      console.log('got data of type ', typeof data);
      setUsers(data!)
      console.log('users', data!);
		}
	}
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter...')
		loadUsers()
	})
	useEffect(() => {
		//loadUsers()
	}, [])
  const { name } = useParams<{ name: string; }>();

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
        <IonGrid>

            <IonRow className="header">
                <IonCol>
                    <IonLabel>Email</IonLabel>
                </IonCol>
                <IonCol>
                    <IonLabel>Phone</IonLabel>
                </IonCol>
                <IonCol>
                    <IonLabel>Last Sign In</IonLabel>
               </IonCol>
                <IonCol>
                    <IonLabel>User UID</IonLabel>
               </IonCol>
            </IonRow>
            {users.map((user: any) => (
                <IonRow key={user.id} onClick={()=>{history.push(`/auth-user/${user.id}`)}}>
                    <IonCol>
                        <IonLabel>{user.email}</IonLabel>
                    </IonCol>
                    <IonCol>
                        <IonLabel>{user.phone}</IonLabel>
                    </IonCol>
                    <IonCol>
                        <IonLabel>{Moment(user.last_sign_in_at).format('YYYY-MM-DD hh:mmA')}</IonLabel>
                    </IonCol>
                        <IonCol>
                            <IonLabel>{user.id}</IonLabel>
                    </IonCol>
                </IonRow>                        
            ))}         
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default AuthUsers;
