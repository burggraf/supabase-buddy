import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { add } from 'ionicons/icons'
import Moment from 'moment';
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { Snippet } from '../models/Snippet'
import SupabaseDataService from '../services/supabase.data.service'
import UtilsService from '../services/utils.service'

import './SqlSnippets.css'

const supabaseDataService = SupabaseDataService.getInstance()
const utilsService = UtilsService.getInstance()
let isMounted = false;
const SqlSnippets: React.FC = () => {
	const history = useHistory()
	
	const [snippets, setSnippets] = useState<Snippet[]>([])
	const { name } = useParams<{ name: string }>()
	const loadSnippets = async () => {
		const { data, error } = await supabaseDataService.getSnippets()
		if (error) {
			if (error.message === 'relation "public.snippets" does not exist') {
				console.log('*** CREATE NEW SNIPPETS TABLE ***');
				supabaseDataService.createSnippetsTable();
			} else {
				console.error(error)
			}
		} else {
			if (data) {
				for (let i = 0; i < data.length; i++) {
					data[i].created_at = Moment(data[i].created_at).format('MM/DD/YYYY hh:mm a')
					data[i].updated_at = Moment(data[i].updated_at).format('MM/DD/YYYY hh:mm a')				
				}	
			}
			setSnippets(data!)
		}
	}
	const editSnippet = (id: string) => {
		history.push(`/sql-editor/${id}`)
	}
	useIonViewDidEnter(() => {
		if (isMounted) loadSnippets();
	})
	useEffect(() => {
		loadSnippets();
		isMounted = true;
	}, []);                               

	const addSnippet = () => {
		// generate a random uuid
		const id = utilsService.uuidv4()
		history.push(`/sql-editor/${id}`)
	}
	const clickSnippet = (row: any, index: number) => {
		editSnippet(row.id);
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>SQL Snippets</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={addSnippet}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<TableGrid rows={snippets} rowClick={clickSnippet}/>
			</IonContent>
		</IonPage>
	)
}

export default SqlSnippets
