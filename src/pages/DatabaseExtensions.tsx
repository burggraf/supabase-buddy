import {
    IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonRow,
	IonTitle,
	IonToggle,
	IonToolbar,
    useIonAlert,
    useIonToast,
    useIonViewDidEnter
} from '@ionic/react'
import { useHistory, useParams } from 'react-router'
import './DatabaseExtensions.css'
import SupabaseDataService from '../services/supabase.data.service'
import { useEffect, useState } from 'react'
import { add, addCircleOutline, removeCircleOutline } from 'ionicons/icons'
import UtilsService from '../services/utils.service'
const utilsService = UtilsService.getInstance();

const DatabaseExtensions: React.FC = () => {
    const [presentAlert] = useIonAlert();
    const [presentToast, dismissToast] = useIonToast();

    const history = useHistory();
	const supabaseDataService = SupabaseDataService.getInstance()
    const { name } = useParams<{ name: string }>()
    const [views, setViews] = useState<any[]>([])
    const loadExtensions = async () => {
        const { data, error } = await supabaseDataService.getExtensions();
        if (error) {
            console.error(error);
        } else {
            setViews(data!);
        }
    }
	useIonViewDidEnter(() => {
        loadExtensions()
	})
    useEffect(() => {
        // loadTables();
    },[]);
    const installExtension = async (extension: any) => {
        const { data, error } = await supabaseDataService.installExtension(extension);
        if (error) {
            toast(error.message, 'danger');
            console.error(error);
        } else {
            loadExtensions()
        }
    }
    const unInstallExtension = async (extension: any) => {
        const { data, error } = await supabaseDataService.unInstallExtension(extension);
        if (error) {
            toast(error.message, 'danger');
            console.error(error);
        } else {
            loadExtensions()
        }
    }
    const addOrRemoveExtension = (name: any, installed: boolean): void => {

        presentAlert({
            cssClass: 'my-css',
            header: installed ? 'Remove Extension' : 'Install Extension',
            message: `Are you sure you want to ` + (installed ? 'remove' : 'install') + ` ${name}?`,
            buttons: [
              'Cancel',
              { text: installed? 'REMOVE' : 'INSTALL', 
                handler: (d) => installed ? unInstallExtension(name) : installExtension(name) },
            ],
            //onDidDismiss: (e) => console.log('did dismiss'),
          })

    }
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

    return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Database Extensions</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow className="header">
                        <IonCol size="4" class="breakItUp">Name</IonCol>
                        <IonCol size="6" class="breakItUp">Description</IonCol>
					    <IonCol size="1" class="breakItUp">Version</IonCol>
					    <IonCol size="1" class="breakItUp">Installed</IonCol>
					</IonRow>
                    {views.map((extension: any) => {
                        return (
                            <IonRow key={utilsService.randomKey()}>
                                <IonCol size="4" class="breakItUp">{extension.name}</IonCol>
                                <IonCol size="6" class="breakItUp">{extension.comment}</IonCol>
                                <IonCol size="1" class="breakItUp">{extension.default_version}</IonCol>
                                <IonCol size="1" class="breakItUp">
                                    <IonButton
                                        strong
                                        fill='clear'
                                        onClick={() => {
                                            addOrRemoveExtension(extension.name, extension.installed_version ? true : false)
                                        }}
                                        color='danger'>
                                            <IonIcon color={extension.installed_version ? 'danger' : 'primary'} size='large' icon={extension.installed_version ? removeCircleOutline : addCircleOutline}>
                                            </IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseExtensions

