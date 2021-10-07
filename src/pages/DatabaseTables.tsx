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
import './DatabaseTables.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import { useEffect, useState } from 'react'

const DatabaseTables: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [tables, setTables] = useState<any[]>([])
    const loadTables = async () => {
        const { data, error } = await supabaseDataService.getTables();
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            setTables(data!);
        }
    }
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter...')
        loadTables()
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
					<IonTitle>Database Tables</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow>
						<IonCol>Name</IonCol>
						<IonCol>Description</IonCol>
						<IonCol>Schema</IonCol>
					</IonRow>
                    {tables.map((table: any) => {
                        return (
                            <IonRow key={table.table_name} onClick={() => history.push(`/database-table/${table.table_schema}/${table.table_name}`)}>
                                <IonCol>{table.table_name}</IonCol>
                                <IonCol>{table.description}</IonCol>
                                <IonCol>{table.table_schema}</IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTables
