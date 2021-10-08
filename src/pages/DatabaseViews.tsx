import {
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
    useIonViewDidEnter
} from '@ionic/react'
import { useHistory, useParams } from 'react-router'
import './DatabaseViews.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import { useEffect, useState } from 'react'

const DatabaseViews: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [views, setViews] = useState<any[]>([])
    const loadViews = async () => {
        const { data, error } = await supabaseDataService.getViews();
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            setViews(data!);
        }
    }
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter...')
        loadViews()
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
					<IonTitle>Database Views</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow className="header">
                    <IonCol>Name</IonCol>
						<IonCol>Schema</IonCol>
					</IonRow>
                    {views.map((view: any) => {
                        return (
                            <IonRow key={view.table_name} onClick={() => history.push(`/database-view/${view.table_schema}/${view.table_name}`)}>
                                <IonCol>{view.table_name}</IonCol>
                                <IonCol>{view.table_schema}</IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseViews
