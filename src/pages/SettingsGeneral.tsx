import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './SettingsGeneral.css';

const SettingsGeneral: React.FC = () => {
    const loadSettings = async () => {
        const url = await localStorage.getItem('url');
        const anonkey = await localStorage.getItem('anonkey');
        const urlField = document.getElementById('url') as HTMLInputElement;
        const anonkeyField = document.getElementById('anonkey') as HTMLInputElement;
        (urlField as any).value = url;
        (anonkeyField as any).value = anonkey;
    }

    useIonViewDidEnter(async () => {
        await loadSettings();
    });

    const saveChanges = () => {
        const url = (document.getElementById('url') as HTMLInputElement).value;
        const anonkey = (document.getElementById('anonkey') as HTMLInputElement).value;
        if (url) localStorage.setItem('url', (document.getElementById('url') as HTMLInputElement).value);
        if (anonkey) localStorage.setItem('anonkey', (document.getElementById('anonkey') as HTMLInputElement).value);
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

