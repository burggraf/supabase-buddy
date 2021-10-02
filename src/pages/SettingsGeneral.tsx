import { useIonViewDidEnter, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './SettingsGeneral.css';

const SettingsGeneral: React.FC = () => {
    const [url, setUrl] = useState('');
    const [anonkey, setAnonkey] = useState('');
    const loadSettings = async () => {
        const url = await localStorage.getItem('url');
        const anonkey = await localStorage.getItem('anonkey');
        console.log('url', url);
        console.log('anonkey', anonkey);
        //setUrl(url => localStorage.getItem('url') || '');
        //setAnonkey(anonkey => localStorage.getItem('anonkey') || '');
        const urlField = document.getElementById('url') as HTMLInputElement;
        const anonkeyField = document.getElementById('anonkey') as HTMLInputElement;
        (urlField as any).value = url;
        (anonkeyField as any).value = anonkey;
    }

    useEffect(() => {
        // loadSettings();
    }, []);

    useIonViewDidEnter(async () => {
        console.log('useIonViewDidEnter...');
        await loadSettings();
        // console.log('url', url);
        // console.log('anonkey', anonkey);
    });

    const { name } = useParams<{ name: string; }>();
    const saveChanges = () => {
        // localStorage.setItem('url', url);
        // localStorage.setItem('anonkey', anonkey);
        // const url = localStorage.getItem('url');
        // const anonkey = localStorage.getItem('anonkey');
        console.log('url', (document.getElementById('url') as HTMLInputElement).value);
        console.log('anonkey', (document.getElementById('anonkey') as HTMLInputElement).value);        
        const url = (document.getElementById('url') as HTMLInputElement).value;
        const anonkey = (document.getElementById('anonkey') as HTMLInputElement).value;
        console.log('url', url);
        console.log('anonkey', anonkey);
        if (url) localStorage.setItem('url', (document.getElementById('url') as HTMLInputElement).value);
        if (anonkey) localStorage.setItem('anonkey', (document.getElementById('anonkey') as HTMLInputElement).value);
        console.log('saved url', localStorage.getItem('url'));
        console.log('saved anonkey', localStorage.getItem('anonkey'));
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings/General</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
          <IonList>
              <IonItem>
                  <IonLabel slot="start">API URL</IonLabel>
                    <IonInput id="url" name="url" debounce={750} className="input" slot="end" value="" />
              </IonItem>
              <IonItem>
                  <IonLabel slot="start">Anon Key</IonLabel>
                    <IonInput id="anonkey" name="anonkey" debounce={750} className="input" slot="end" value="" />
              </IonItem>
          </IonList>

          <IonButton strong color="primary" onClick={saveChanges}>Save Changes</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default SettingsGeneral;
function ionViewWillEnter() {
    throw new Error('Function not implemented.');
}

