import {
    IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid,
    IonHeader, IonIcon, IonInput, IonLabel, IonPage, IonRow,
    IonTitle, IonToolbar, useIonToast
} from '@ionic/react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { link, logIn, personAdd, refreshCircle } from 'ionicons/icons';
import { useState } from 'react';
import './Login.css';
import ProviderSignInButton from './ProviderSignInButton';


let supabase: SupabaseClient;

const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const isConnected = () => {
    return (typeof supabase !== 'undefined');
}
const connect = async () => {
    const url = localStorage.getItem('url');
    const anonkey = localStorage.getItem('anonkey');
    if (url && anonkey) {
      supabase = await createClient(url, anonkey);
      return true;
    } else {
      return false;
    }
}

const Login: React.FC = () => {
    const [present, dismiss] = useIonToast();
    const [email, setEmail] = useState('');
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
    const signInWithEmail = async () => {
        if (!isConnected()) {
            await connect();
          }
        const {user, session, error} = 
            await supabase.auth.signIn({email, password}, {
                redirectTo: window.location.origin
              });
        if (error) { console.error(error); toast(error.message) }
    }
    const signUp = async () => {
        if (!isConnected()) {
            await connect();
          }
        const {user, session, error} = 
            await supabase.auth.signUp({email, password}, {
                redirectTo: window.location.origin
              });
            if (error) { toast(error.message) }
            else { toast('Please check your email for a confirmation link', 'success') }
        }
    const resetPassword = async () => {
        if (!isConnected()) {
            await connect();
          }
        const {data, error} = 
            await supabase.auth.api.resetPasswordForEmail(email, {
                redirectTo: window.location.origin
              });
            if (error) { toast(error.message) }
            else { toast('Please check your email for a password reset link', 'success') }
        }
    const sendMagicLink = async () => {
        if (!isConnected()) {
            await connect();
          }
        const {user, session, error} = 
            await supabase.auth.signIn({email}, {
                redirectTo: window.location.origin
              });
            if (error) { toast(error.message) }
        }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/page" />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login Page</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid class="ion-padding">
            <IonRow>
                <IonCol>
                    <IonLabel><b>Email</b></IonLabel>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonInput type="email" 
                    placeholder="Enter your email" 
                    onIonChange={e => setEmail(e.detail.value!)}
                    value={email} class="inputBox" />
                </IonCol>
            </IonRow>
            {!validateEmail(email) && email.length > 0 && 
                <IonRow>
                    <IonCol>
                        <IonLabel color="danger"><b>Invalid email format</b></IonLabel>
                    </IonCol>
                </IonRow>
            }
            <IonRow>
                <IonCol>
                    <IonLabel><b>Password</b></IonLabel>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonInput type="password" 
                    placeholder="Enter your password" 
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
                    disabled={!validateEmail(email) || password.length < 6}
                    onClick={signInWithEmail}>
                        <IonIcon icon={logIn} size="large" />&nbsp;&nbsp;
                        <b>Sign in with email</b>
                    </IonButton>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                        <IonButton expand="block" 
                        disabled={!validateEmail(email) || password.length < 6}
                        onClick={signUp}>
                        <IonIcon icon={personAdd} size="large" />&nbsp;&nbsp;
                        <b>Sign Up</b></IonButton>
                </IonCol>
                <IonCol>
                    <IonButton expand="block" 
                    disabled={!validateEmail(email) || password.length > 0}
                    onClick={resetPassword}>
                    <IonIcon icon={refreshCircle} size="large" />&nbsp;&nbsp;
                    <b>Reset Password</b></IonButton>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton expand="block" 
                    disabled={!validateEmail(email) || password.length > 0}
                    onClick={sendMagicLink}>
                    <IonIcon icon={link} size="large" />&nbsp;&nbsp;
                    <b>Send Sign In Link</b></IonButton>                    
                </IonCol>
            </IonRow>
        </IonGrid>
        <IonRow>
            <IonCol class="ion-text-center">
                <IonLabel><b>Sign in with:</b></IonLabel>
            </IonCol>
        </IonRow>
        <IonRow>
            <IonCol>
                <ProviderSignInButton name="google" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="facebook" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="twitter" />
            </IonCol>
        </IonRow>
        <IonRow>
            <IonCol>
                <ProviderSignInButton name="apple" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="twitch" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="discord" />
            </IonCol>
        </IonRow>
        <IonRow>
            <IonCol>
                <ProviderSignInButton name="github" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="bitbucket" />
            </IonCol>
            <IonCol>
                <ProviderSignInButton name="gitlab" />
            </IonCol>
        </IonRow>

        
      </IonContent>
    </IonPage>
  );
};

export default Login;
