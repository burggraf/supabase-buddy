import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonPopover, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { add, caretUpOutline, closeOutline, ellipsisHorizontal, mail } from 'ionicons/icons';
import Moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import TableColumnSort from '../components/TableColumnSort';

import { SupabaseAuthService } from '../services/supabase.auth.service';
import { SupabaseDataService } from '../services/supabase.data.service';

import './AuthUsers.css';
import { Sort } from '../models/Sort';

const AuthUsers: React.FC = () => {
	const supabaseDataService = new SupabaseDataService();
  const supabaseAuthService = new SupabaseAuthService();
    const history = useHistory();
    const [users, setUsers] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)
    const [inviteEmail, setInviteEmail] = useState('');
    const [showPopover, setShowPopover] = useState<{open: boolean, event: Event | undefined, user: any | undefined}>({
      open: false,
      event: undefined,
      user: undefined
    });
    const [showInvite, setShowInvite] = useState<{open: boolean, event: Event | undefined}>({
      open: false,
      event: undefined
    });
    const [sort, setSort] = useState<Sort>({orderBy: 'email', ascending: true});
    const changeSort = async (newSort: Sort) => {
      setSort(newSort);
      loadUsers();
    }  
    const [page, setPage] = useState<{limit: number, offset: number}>({limit: 100, offset: 0});
	const loadUsers = async () => {
		const { data, error } = await supabaseDataService.getUsers(sort.orderBy, sort.ascending, page.limit, page.offset);
		if (error) {
			console.error('getUsers error', error)
		} else {
      setUsers(data!)
		}
    const { data: userCount, error: errorUserCount } = await supabaseDataService.getUserCount()
    if (errorUserCount) {
      console.error('getUserCount error', errorUserCount)
    } else {
      setTotal(userCount![0].total);
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
          <IonTitle>Users ({total})</IonTitle>
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
                <IonCol size="4" className="breakItUp">
                    <IonLabel>Email</IonLabel>&nbsp;&nbsp;<TableColumnSort sort={sort} columnName="email" callback={changeSort}/>
                </IonCol>
                <IonCol size="3" className="breakItUp">
                    <IonLabel>Phone</IonLabel>&nbsp;&nbsp;<TableColumnSort sort={sort} columnName="phone" callback={changeSort}/>
                </IonCol>
                <IonCol size="3" className="breakItUp">
                    <IonLabel>Last Sign In</IonLabel>&nbsp;&nbsp;<TableColumnSort sort={sort} columnName="last_sign_in_at" callback={changeSort}/>
               </IonCol>
               <IonCol size="2" className="breakItUp">
                 &nbsp;
               </IonCol>
                {/* <IonCol>
                    <IonLabel>User UID</IonLabel>
               </IonCol> */}
            </IonRow>
            {users.map((user: any) => (
                <IonRow key={user.id} onClick={()=>{history.push(`/auth-user/${user.id}`)}}>
                    <IonCol size="4" className="breakItUp">
                        <IonLabel>{user.email || '<no email>'}</IonLabel>
                    </IonCol>
                    <IonCol size="3" className="breakItUp">
                        <IonLabel>{user.phone || '-'}</IonLabel>
                    </IonCol>
                    <IonCol size="3" className="breakItUp">
                        <IonLabel>{user.last_sign_in_at ? Moment(user.last_sign_in_at).format('YYYY-MM-DD hh:mmA') : 'never'}</IonLabel>
                    </IonCol>
                    <IonCol size="2" className="ion-text-center breakItUp">
                      <IonButton fill='clear' color="medium" onClick={(e) => {e.stopPropagation();setShowPopover({open: true, event: e.nativeEvent, user})}}>
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
          <div className="ion-padding">
              <IonButton expand="block" onClick={()=>{setShowInvite({open: false, event: undefined})}} color="light">
                Cancel
              </IonButton>
          </div>
        </IonPopover>
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
            <IonItem>
              <IonButton fill="clear" onClick={()=>{setShowPopover({open: false, event: undefined, user: undefined})}} color="dark">
                <IonIcon slot="start" size="small" icon={closeOutline}></IonIcon> 
                Cancel
              </IonButton>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default AuthUsers;
