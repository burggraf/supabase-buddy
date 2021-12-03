import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { add } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { Sort } from 'ionic-react-tablegrid'
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
        const { data, error } = await supabaseDataService.getTables(sort.orderBy, sort.ascending);
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
	const clickHandler = (row: any, index: number) => {
		console.log('clickHandler: row, index:', row, index);
		history.push(`/database-table/${row.Schema}/${row.Name}`);
	}
    const [sort, setSort] = useState<Sort>({orderBy: 'table_name', ascending: true});
    const changeSort = async (newSort: Sort) => {
      setSort(newSort);
      loadTables();
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
				<TableGrid rows={tables} 
						rowClick={clickHandler} 
						sort={sort} 
						changeSortCallback={changeSort} 
						sortableColumns={['table_schema','table_name','table_type']}/>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTables
