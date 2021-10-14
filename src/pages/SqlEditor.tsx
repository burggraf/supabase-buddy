import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonMenuButton,
	IonPage,
	IonRow,
	IonTextarea,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonViewDidEnter,
} from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import './SqlEditor.css'
import { SupabaseDataService } from '../services/supabase.data.service'
import SqlResults from '../components/SqlResults'
import Editor from '@monaco-editor/react'
import { debounce } from 'ts-debounce'
import { Snippet } from '../models/Snippet'
const SqlEditor: React.FC = () => {
	const { id } = useParams<{ id: string }>()
	const [present] = useIonAlert();
	const history = useHistory();
	useEffect(() => {
		if (id === 'sql-snippets' || typeof id === 'undefined') {
			history.replace('/sql-snippets');
		} else {
			loadSnippet(id);
		}
	}, []);
	const [content, setContent] = useState<string>('')
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [statementDelimiter, setStatementDelimiter] = useState<string>(';')
	const [results, setResults] = useState<any[]>([])
	const [darkMode, setDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches)
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		setDarkMode(e.matches)
	});
	const supabaseDataService = new SupabaseDataService()

    async function save() {
        const {data, error} = await supabaseDataService.saveSnippet({
            id,
            title,
            description,
			statement_delimiter: statementDelimiter,
            content
        });
		if (error) {
			console.error(error)
		} else {
		}
    }
	async function loadSnippet(id: string) {
		const { data, error } = await supabaseDataService.getSnippet(id)
		if (error) {
			console.error(error)
		} else {			
			setTitle(data.title)
			setDescription(data.description)
			setContent(data.content)
			setStatementDelimiter(data.statement_delimiter)
		}
	}
	function handleEditorChange(value: any, event: any) {
		// here is the current value
		setContent(value)
	}

	function handleEditorDidMount(editor: any, monaco: any) {
	}

	function handleEditorWillMount(monaco: any) {
	}

	function handleEditorValidation(markers: any) {
		// model markers
		markers.forEach((marker: { message: any }) => console.log('onValidate:', marker.message))
	}

	const { name } = useParams<{ name: string }>()
	const runSql = async () => {
		if (content) {
			const { data, error } = await supabaseDataService.runSql(content, statementDelimiter)
			if (error) {
				if (error && error.message) {
					// console.error(error.message);
					//setResults([error.message]);
					setResults( [error.message] );
				} else {
					console.error(error)
				}
			} else {
				setResults(data!)
			}
		}
	}
	const deleteSnippet = async () => {
		const { data, error } = await supabaseDataService.deleteSnippet(id)
		if (error) {
			console.error(error)
		} else {
			history.replace('/sql-snippets');
		}
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref='/sql-snippets' />
					</IonButtons>
					<IonTitle>SQL Editor</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={save}>
                            <IonIcon size="large" icon={checkmark}></IonIcon>
                        </IonButton>
                    </IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow>
						<IonCol size="5">
							Title:{' '}
							<IonInput
								value={title}
								onIonChange={debounce((e) => setTitle(e.detail.value!), 750)}
								type='text'
								style={{ border: '1px solid' }}
							/>
						</IonCol>
						<IonCol size="6">
							Description:{' '}
							<IonInput
								value={description}
								onIonChange={debounce((e) => setDescription(e.detail.value!), 750)}
								type='text'
								style={{ border: '1px solid' }}
							/>
						</IonCol>
						<IonCol size="1">
							Sep:{' '}
							<IonInput
								value={statementDelimiter}
								onIonChange={debounce((e) => setStatementDelimiter(e.detail.value!), 750)}
								type='text'
								style={{ width:'20pt', border: '1px solid' }}
							/>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<Editor
								className='textarea'
								height="40vh"
								defaultLanguage='sql'
								defaultValue={content}
								value={content}
								theme={darkMode ? 'vs-dark' : 'vs-light'}
								onChange={debounce(handleEditorChange, 750)}
								onMount={handleEditorDidMount}
								beforeMount={handleEditorWillMount}
								onValidate={handleEditorValidation}
								options={{
									minimap: {
										enabled: false,
									},
								}}
							/>
						</IonCol>
					</IonRow>
				</IonGrid>
				<div style={{ height: '60%' }}>
					<SqlResults results={results} />
				</div>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonButton color='danger' fill='outline' 
						onClick={() =>
							present({
							  cssClass: 'my-css',
							  header: 'Delete',
							  message: 'Are you sure?',
							  buttons: [
								'Cancel',
								{ text: 'OK', handler: (d) => deleteSnippet() },
							  ],
							  onDidDismiss: (e) => console.log('did dismiss'),
							})
						  }>
							<strong>DELETE</strong>
						</IonButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton color='dark' fill='outline' onClick={runSql}>
							<strong>RUN</strong>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	)
}

export default SqlEditor
