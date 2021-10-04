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
    useIonViewDidEnter,
} from '@ionic/react'
import { add } from 'ionicons/icons'
import { useHistory, useParams } from 'react-router'
import './SqlSnippets.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import { useEffect, useState } from 'react'
import { Snippet } from '../models/Snippet'
import Moment from 'moment';

const SqlSnippets: React.FC = () => {
	const history = useHistory()
	const supabaseDataService = new SupabaseDataService()
	const [snippets, setSnippets] = useState<Snippet[]>([])
	const { name } = useParams<{ name: string }>()
	const loadSnippets = async () => {
		const { data, error } = await supabaseDataService.getSnippets()
		if (error) {
			console.error(error)
		} else {
			setSnippets(data!)
		}
	}
	const editSnippet = (id: string) => {
		console.log('editSnippet', id)
		history.push(`/sql-editor/${id}`)
	}
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter...')
		loadSnippets()
	})

	useEffect(() => {
		// loadSnippets(); //  moved to useIonViewDidEnter
	}, [])
	// generate a random uuid
	const uuidv4 = () => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8
			return v.toString(16)
		})
	}

	const addSnippet = () => {
		const id = uuidv4()
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
				<IonGrid>
					<IonRow key='header'>
						<IonCol>Title</IonCol>
						<IonCol>Description</IonCol>
						<IonCol>Created</IonCol>
						<IonCol>Updated</IonCol>
					</IonRow>

					{snippets.map((snippet) => (
						<IonRow
							key={snippet.id}
							onClick={() => {
								editSnippet(snippet.id)
							}}>
							<IonCol>{snippet.title}</IonCol>
							<IonCol>{snippet.description}</IonCol>
							<IonCol>{Moment(snippet.created_at).format('YYYY-MM-DD hh:mmA')}</IonCol>
							<IonCol>{Moment(snippet.updated_at).format('YYYY-MM-DD hh:mmA')}</IonCol>
						</IonRow>
					))}
					<IonRow>
						<IonCol></IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default SqlSnippets
