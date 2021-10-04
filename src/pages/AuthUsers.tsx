import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SupabaseDataService } from '../services/supabase.data.service';
import './AuthUsers.css';
import Moment from 'moment';

const Page: React.FC = () => {
	const supabaseDataService = new SupabaseDataService()
    const [users, setUsers] = useState<any[]>([])
	const loadUsers = async () => {
		const { data, error } = await supabaseDataService.getUsers()
		if (error) {
			console.error(error)
		} else {
			setUsers(data!)
            console.log('users', data);
		}
	}
	useEffect(() => {
		loadUsers()
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

        {/* 
        aud: "authenticated"
confirmation_sent_at: "2021-10-01T23:17:36.816Z"
confirmation_token: ""
confirmed_at: "2021-10-01T23:18:00.495Z"
created_at: "2021-10-01T23:17:36.813Z"
email: "markb@mantisbible.com"
email_change: ""
email_change_confirm_status: 0
email_change_sent_at: null
email_change_token_current: ""
email_change_token_new: ""
email_confirmed_at: "2021-10-01T23:18:00.495Z"
encrypted_password: "$2a$10$jItprxBLueztMpIfsgpZJ.zFbHdKgANQ3ZHXrmtAwym92emZM/gRe"
id: "f91bb44b-9538-4993-809a-df15d6a817d5"
instance_id: "00000000-0000-0000-0000-000000000000"
invited_at: "2021-10-01T23:17:36.816Z"
is_super_admin: false
last_sign_in_at: "2021-10-01T23:18:00.496Z"
phone: null
phone_change: ""
phone_change_sent_at: null
phone_change_token: ""
phone_confirmed_at: null
raw_app_meta_data: {provider: 'email'}
raw_user_meta_data: [null]
recovery_sent_at: null
recovery_token: ""
role: "authenticated"
updated_at: "2021-10-01T23:17:36.813Z" */}
            <IonRow>
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
                <IonRow key={user.id}>
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

export default Page;
