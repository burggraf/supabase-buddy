import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'

import './DatabaseTables.css'

const utilsService = new UtilsService()

const DatabaseTables: React.FC = () => {
	let isMounted = false;
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [tables, setTables] = useState<any[]>([])
    const loadTables = async () => {
        const { data, error } = await supabaseDataService.getTables();
        if (error) {
            console.error(error);
        } else {
            setTables(data!);
        }
    }
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter, isMounted', isMounted);
		if (isMounted) loadTables();
	})
	useEffect(() => {
		loadTables();
		isMounted = true;
	}, []);                               
	const addTable = () => {
		history.push(`/database-table/public/NEW-TABLE`)
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Database Tables</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={addTable}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow className="header">
						<IonCol>Name</IonCol>
						<IonCol>Description</IonCol>
						<IonCol>Schema</IonCol>
					</IonRow>
                    {tables.map((table: any) => {
                        return (
                            <IonRow key={utilsService.randomKey()} onClick={() => history.push(`/database-table/${table.table_schema}/${table.table_name}`)}>
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
