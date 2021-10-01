import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, 
    IonHeader, IonIcon, IonInput, IonLabel, IonPage, IonRow, 
    IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { checkmark, link, logIn, personAdd, refreshCircle } from 'ionicons/icons';
import { useState } from 'react';
import './ResetPassword.css';
import { useHistory } from "react-router-dom";

import { SupabaseAuthService } from './supabase.auth.service';
import { useParams } from 'react-router';

import { StartupService } from '../services/startup.service';
const startupService = new StartupService();
const defaultRoute = startupService.getDefaultRoute();


const supabaseAuthService = new SupabaseAuthService();

const ResetPassword: React.FC = () => {
    const history = useHistory();
    const { token } = useParams<{ token: string; }>();
    
    const [present, dismiss] = useIonToast();
    const [password, setPassword] = useState('');
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
    const updatePassword = async () => {
        const { data, error }  = 
            await supabaseAuthService.updatePassword(token, password);
        if (error) { toast(error.message) }
        else { 
            present({
                color: 'success',
                message: 'Password successfully updated',
                cssClass: 'toast',
                buttons: [{ icon: 'close', handler: () => dismiss() }],
                duration: 6000,
                onDidDismiss: () => {
                    // history.push(defaultRoute);
                    history.replace(defaultRoute);
                },
                //onWillDismiss: () => console.log('will dismiss'),
              })                
         }
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/page" />
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Reset Password</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid class="ion-padding">
            <IonRow>
                <IonCol>
                    <IonLabel><b>New Password</b></IonLabel>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonInput type="password" 
                    placeholder="Enter your new password" 
                    onIonChange={e => setPassword(e.detail.value!)}
                    value={password} class="inputBox" />
                </IonCol>
            </IonRow>
            {password.length > 0 && password.length < 6 && 
                <IonRow>
                    <IonCol>
                        <IonLabel color="danger"><b>Password too short</b></IonLabel>
                    </IonCol>
                </IonRow>
            }
            <IonRow>
                <IonCol>
                    <IonButton expand="block" 
                    disabled={password.length < 6}
                    onClick={updatePassword}>
                        <IonIcon icon={checkmark} size="large" />&nbsp;&nbsp;
                        <b>Save New Password</b>
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
        
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
