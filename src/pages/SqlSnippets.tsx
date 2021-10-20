import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { add } from 'ionicons/icons'
import Moment from 'moment';
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { Snippet } from '../models/Snippet'
import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'

import './SqlSnippets.css'

const supabaseDataService = new SupabaseDataService()
const utilsService = new UtilsService()
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
				<IonGrid key={utilsService.randomKey()}>
					<IonRow key={utilsService.randomKey()} className="header">
						<IonCol key={utilsService.randomKey()}>Title</IonCol>
						<IonCol key={utilsService.randomKey()}>Description</IonCol>
						<IonCol key={utilsService.randomKey()}>Created</IonCol>
						<IonCol key={utilsService.randomKey()}>Updated</IonCol>
					</IonRow>

					{snippets.map((snippet) => (
						<IonRow
							key={utilsService.randomKey()}
							onClick={() => {
								editSnippet(snippet.id)
							}}>
							<IonCol key={utilsService.randomKey()}>{snippet.title}</IonCol>
							<IonCol key={utilsService.randomKey()}>{snippet.description}</IonCol>
							<IonCol key={utilsService.randomKey()}>{Moment(snippet.created_at).format('YYYY-MM-DD hh:mmA')}</IonCol>
							<IonCol key={utilsService.randomKey()}>{Moment(snippet.updated_at).format('YYYY-MM-DD hh:mmA')}</IonCol>
						</IonRow>
					))}
					{/* <IonRow>
						<IonCol></IonCol>
					</IonRow> */}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default SqlSnippets
