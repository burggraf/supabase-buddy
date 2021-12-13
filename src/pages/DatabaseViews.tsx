import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { add } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'

import './DatabaseViews.css'

const utilsService = new UtilsService()

const DatabaseViews: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [views, setViews] = useState<any[]>([])
    const loadViews = async () => {
        const { data, error } = await supabaseDataService.getViews();
        if (error) {
            console.error(error);
        } else {
            setViews(data!);
        }
    }
	useIonViewDidEnter(() => {
        loadViews()
	})
    useEffect(() => {
        // loadTables();
    },[]);
    const addView = () => {
        history.push(`/database-view/public/NEW-VIEW`);
    }
	const clickView = (row: any, index: number) => {
		history.push(`/database-view/${row.table_schema}/${row.table_name}`);		
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Database Views</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={addView}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent>

				<TableGrid rows={views} rowClick={clickView}/>

			</IonContent>
		</IonPage>
	)
}

export default DatabaseViews
