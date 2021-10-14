import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewDidEnter } from '@ionic/react';
import { link, logIn, personAdd, refreshCircle } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router';

import { SupabaseAuthService } from '../services/supabase.auth.service';

import './Welcome.css';

const Welcome: React.FC = () => {
  const history = useHistory();
  const supabaseAuthService = new SupabaseAuthService();
  const { name } = useParams<{ name: string; }>();
  const [url, setUrl] = useState('');
  const [apikey, setApikey] = useState('');

  const loadSettings = async () => {
    const url = await localStorage.getItem('url') || '';
    const apikey = await localStorage.getItem('apikey') || '';
    setUrl(url);
    setApikey(apikey);
  }
  useIonViewDidEnter(async () => {
    await loadSettings();
  });

  const saveChanges = () => {
    // localStorage.setItem('url', url);
    // localStorage.setItem('apikey', apikey);
    // const url = localStorage.getItem('url');
    // const apikey = localStorage.getItem('apikey');
    const url = (document.getElementById('url') as HTMLInputElement).value;
    const apikey = (document.getElementById('apikey') as HTMLInputElement).value;
    if (url) localStorage.setItem('url', (document.getElementById('url') as HTMLInputElement).value);
    if (apikey) localStorage.setItem('apikey', (document.getElementById('apikey') as HTMLInputElement).value);
  }
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
      saveChanges();
      const {user, session, error} = 
          await supabaseAuthService.signInWithEmail(email, password);
      if (error) { console.error(error); toast(error.message) }
      else { 
          // history.replace('/home-dashboard');
          window.location.href = '/';
       }
  }
  const resetPassword = async () => {
    saveChanges();
    const {data, error} = 
          await supabaseAuthService.resetPassword(email);
          if (error) { toast(error.message) }
          else { toast('Please check your email for a password reset link', 'success') }
      }
  const sendMagicLink = async () => {
    saveChanges();
    const {user, session, error} = 
          await supabaseAuthService.sendMagicLink(email);
          if (error) { toast(error.message) }
      }
  const validateEmail = (email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons> */}
          <IonTitle>Supabase Buddy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* <IonList>
              <IonItem>
                  <IonLabel slot="start">API URL</IonLabel>
                    <IonInput id="url" name="url" debounce={750} className="input" slot="end" value="" />
              </IonItem>
              <IonItem>
                  <IonLabel slot="start">Api Key</IonLabel>
                    <IonInput id="apikey" name="apikey" debounce={750} className="input" slot="end" value="" />
              </IonItem>
          </IonList>
          <IonButton strong color="primary" onClick={saveChanges}>Save Changes</IonButton>
 */}

          <IonGrid class="ion-padding">
            
          <IonRow>
                <IonCol>
                    <IonLabel><b>API URL</b></IonLabel>
                </IonCol>
          </IonRow>
          <IonRow>
                <IonCol>
                    <IonInput id="url" name="url" 
                    onIonChange={e => setUrl(e.detail.value!)}
                    debounce={750} className="input" value={url} />
                </IonCol>
            </IonRow>


            <IonRow>
                <IonCol>
                    <IonLabel><b>Api Key</b></IonLabel>
                </IonCol>
          </IonRow>
          <IonRow>
                <IonCol>
                <IonInput id="apikey" name="apikey" 
                    onIonChange={e => setApikey(e.detail.value!)}
                    debounce={750} className="input" value={apikey} />
                </IonCol>
          </IonRow>


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

      </IonContent>
    </IonPage>
  );
};

export default Welcome;
