import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { Sort, TableGrid } from 'ionic-react-tablegrid'
import { add } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import SupabaseDataService from '../services/supabase.data.service'
import './DatabaseTables.css'



// const utilsService = UtilsService.getInstance()

const DatabaseTables: React.FC = () => {
	let isMounted = false;
    const history = useHistory();
	const supabaseDataService = SupabaseDataService.getInstance()
	// const { name } = useParams<{ name: string }>()
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
		history.push(`/database-table/${row["Schema^"]}/${row["Name^"]}`);
	}
    const [sort, setSort] = useState<Sort>({orderBy: 'table_name', ascending: true});
    // const changeSort = async (newSort: Sort) => {
    //   setSort(newSort);
    //   loadTables();
    // }  

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
					setRows={setTables}
						rowClick={clickHandler}></TableGrid> 
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTables
