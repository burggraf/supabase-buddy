import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonPopover, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { SupabaseDataService } from '../services/supabase.data.service';
import './AuthUsers.css';
import Moment from 'moment';
import { add, ellipsisHorizontal, mail } from 'ionicons/icons';
import { SupabaseAuthService } from '../services/supabase.auth.service';

const AuthUsers: React.FC = () => {
	const supabaseDataService = new SupabaseDataService();
  const supabaseAuthService = new SupabaseAuthService();
    const history = useHistory();
    const [users, setUsers] = useState<any[]>([])
    const [inviteEmail, setInviteEmail] = useState('');
    const [showPopover, setShowPopover] = useState<{open: boolean, event: Event | undefined, user: any}>({
      open: false,
      event: undefined,
      user: undefined
    });
    const [showInvite, setShowInvite] = useState<{open: boolean, event: Event | undefined}>({
      open: false,
      event: undefined
    });
	const loadUsers = async () => {
		const { data, error } = await supabaseDataService.getUsers()
		if (error) {
			console.error(error)
		} else {
      setUsers(data!)
		}
	}
	useIonViewDidEnter(() => {
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
    setShowInvite({open: false, event: undefined});
  }
  const inviteUser = async () => {

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Users</IonTitle>
					<IonButtons slot='end'>
						<IonButton fill="outline" color='primary' onClick={(e) => {setShowInvite({open: true, event: e.nativeEvent})}}>
							<IonIcon size='small' icon={add} slot="start"></IonIcon> <b>Send Link</b>
						</IonButton>
					</IonButtons>
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
                        <IonLabel>{user.email || '<no email>'}</IonLabel>
                    </IonCol>
                    <IonCol>
                        <IonLabel>{user.phone || '-'}</IonLabel>
                    </IonCol>
                    <IonCol>
                        <IonLabel>{user.last_sign_in_at ? Moment(user.last_sign_in_at).format('YYYY-MM-DD hh:mmA') : 'never'}</IonLabel>
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
          backdropDismiss={true}
          keyboardClose={true}
          showBackdrop={true}
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

        <IonPopover
          isOpen={showInvite.open}
          event={showInvite.event}
          backdropDismiss={true}
          keyboardClose={true}
          showBackdrop={true}
          onDidDismiss={e => setShowInvite({open: false, event: undefined})}>
          <div className="ion-text-center">
            <br/>
            <IonLabel>Email Address:</IonLabel>
          </div>
          <div className="ion-text-center ion-padding">
            <IonInput style={{ border: '1px solid' }} 
              type="email" placeholder="Email Address" 
              onIonChange={e => setInviteEmail(e.detail.value!)}></IonInput>
          </div>
          <div className="ion-padding">
              <IonButton strong expand="block" onClick={()=>{sendMagicLink(inviteEmail)}} color="primary">
                Send Magic Link
              </IonButton>
          </div>
        </IonPopover>

      </IonContent>
    </IonPage>
  );
};

export default AuthUsers;
