import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonPopover, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { SupabaseDataService } from '../services/supabase.data.service';
import './AuthUsers.css';
import Moment from 'moment';
import { ellipsisHorizontal, mail } from 'ionicons/icons';
import { SupabaseAuthService } from '../services/supabase.auth.service';

const AuthUsers: React.FC = () => {
	const supabaseDataService = new SupabaseDataService();
  const supabaseAuthService = new SupabaseAuthService();
    const history = useHistory();
    const [users, setUsers] = useState<any[]>([])
    const [showPopover, setShowPopover] = useState<{open: boolean, event: Event | undefined, user: any}>({
      open: false,
      event: undefined,
      user: undefined
    });
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
	const [presentToast, dismissToast] = useIonToast();
    const toast = (message: string, color: string = 'danger') => {
        presentToast({
            color: color,
            message: message,
            cssClass: 'toast',
            buttons: [{ icon: 'close', handler: () => dismissToast() }],
            duration: 6000,
            //onDidDismiss: () => console.log('dismissed'),
            //onWillDismiss: () => console.log('will dismiss'),
          })
    }
  const { name } = useParams<{ name: string; }>();
  const sendPasswordResetEmail = async (email: any) => {
    const { data, error} = await supabaseAuthService.resetPassword(email);
    if (!error) {
      toast('Password reset email sent.', 'success')
    } else {
      toast('Error: ' + error?.message, 'danger')
    }    
  }
  const sendMagicLink = async (email: any) => {
    const { user, session, error} = await supabaseAuthService.sendMagicLink(email);
    if (!error) {
      toast('Magic link email sent.', 'success')
    } else {
      toast('Error: ' + error?.message, 'danger')
    }
  }

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
                 &nbsp;
               </IonCol>
                {/* <IonCol>
                    <IonLabel>User UID</IonLabel>
               </IonCol> */}
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
                    <IonCol className="ion-text-center">
                      <IonButton fill='outline' color="medium" onClick={(e) => {e.stopPropagation();setShowPopover({open: true, event: e.nativeEvent, user})}}>
	        							<IonIcon size="small" icon={ellipsisHorizontal}></IonIcon>                        
					        		</IonButton>
                    </IonCol>
                        {/* <IonCol>
                            <IonLabel>{user.id}</IonLabel>
                    </IonCol> */}
                </IonRow>                        
            ))}         
        </IonGrid>
        <IonPopover
          isOpen={showPopover.open}
          event={showPopover.event}
          onDidDismiss={e => setShowPopover({open: false, event: undefined, user: undefined})}>
          <IonList>
            <IonListHeader>
              <IonLabel className="ion-text-center">{showPopover.user?.email}</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonButton fill="clear" onClick={()=>{sendPasswordResetEmail(showPopover.user?.email)}} color="dark">
                <IonIcon slot="start" size="small" icon={mail}></IonIcon> 
                Send Password Reset Email
              </IonButton>
            </IonItem>
            <IonItem>
              <IonButton fill="clear" onClick={()=>{sendMagicLink(showPopover.user?.email)}} color="dark">
                <IonIcon slot="start" size="small" icon={mail}></IonIcon> 
                Send Magic Link
              </IonButton>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default AuthUsers;
