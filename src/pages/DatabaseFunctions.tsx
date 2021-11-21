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
    useIonViewDidEnter,
} from '@ionic/react'
import { useHistory, useParams } from 'react-router'
import './DatabaseFunctions.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import { useEffect, useState } from 'react'
import { UtilsService } from '../services/utils.service'
import TableGrid from '../components/TableGrid'
const utilsService = new UtilsService()

const DatabaseFunctions: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [functions, setFunctions] = useState<any[]>([])
    const loadFunctions = async () => {
        const { data, error } = await supabaseDataService.getFunctions();
        if (error) {
            console.error(error);
        } else {
            setFunctions(data!);
        }
    }
	useIonViewDidEnter(() => {
        loadFunctions()
	})
    useEffect(() => {
        //loadFunctions();
    },[]);
    
	const clickFunction = (row: any, index: number) => {
		history.push(`/database-function/${row.function_schema}/${row.function_name}`);		
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Functions</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<TableGrid rows={functions} rowClick={clickFunction}/>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseFunctions
