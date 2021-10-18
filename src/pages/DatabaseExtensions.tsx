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
	IonToolbar,
    useIonViewDidEnter
} from '@ionic/react'
import { useHistory, useParams } from 'react-router'
import './DatabaseExtensions.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import { useEffect, useState } from 'react'
import { add } from 'ionicons/icons'
import { UtilsService } from '../services/utils.service'
const utilsService = new UtilsService()

const DatabaseExtensions: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
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
                            <IonRow key={utilsService.randomKey()} onClick={() => console.log('onClick not implemented')}>
                                <IonCol size="4" class="breakItUp">{extension.name}</IonCol>
                                <IonCol size="6" class="breakItUp">{extension.comment}</IonCol>
                                <IonCol size="1" class="breakItUp">{extension.default_version}</IonCol>
                                <IonCol size="1" class="breakItUp">{extension.installed_version}</IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseExtensions
