import {
    IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
	IonInput,
	IonMenuButton,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonToast,
} from '@ionic/react'
import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { SupabaseDataService } from '../services/supabase.data.service'
import './DatabaseView.css'
import { debounce } from 'ts-debounce'

const DatabaseView: React.FC = () => {
    const history = useHistory();
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const [present] = useIonAlert();
    const [view, setView] = useState<any>({})
    const supabaseDataService = new SupabaseDataService()

	const [presentToast, dismissToast] = useIonToast();
    const toast = (message: string, color: string = 'danger') => {
        presentToast({
            color: color,
            message: message,
            cssClass: 'toast',
            buttons: [{ icon: 'close', handler: () => dismissToast() }],
            duration: 6000,
            //onDidDismiss: () => console.log('dismissed'),
            //onWillDismiss: () => console.log('will dismiss'),
          })
    }
	const save = async () => {
        const sql = `DROP VIEW IF EXISTS ${view.table_schema}."${view.table_name}";;;CREATE OR REPLACE VIEW ${view.table_schema}."${view.table_name}" AS ${view.view_definition}`;
        console.log('run:', sql);
        const { data, error } = await supabaseDataService.runSql(sql, ';;;')
        if (error) {
            if (error && error.message) {
                toast(error.message, 'danger');
            } else {
                toast(JSON.stringify(error), 'danger');
                console.error(error)
            }
        } else {
            toast('View was saved.', 'success');
        }
    }
    const deleteView = async () => {
        const sql = `DROP VIEW IF EXISTS ${table_schema}."${table_name}";`;
        const { data, error } = await supabaseDataService.runSql(sql, ';;;')
        if (error) {
            if (error && error.message) {
                toast(error.message, 'danger');
            } else {
                toast(JSON.stringify(error), 'danger');
                console.error(error)
            }
        } else {
            toast('View was deleted.', 'success');
            history.replace('/database-views');
        }
    }

	const loadView = async () => {
        console.log('loadFunction');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
		const { data, error } = await supabaseDataService.getView(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
            console.log('f data', data![0]);
            setView(data![0])
		}
	}
    ///useEffect public NEW-VIEW false true false ***NEW-VIEW***
    useEffect(() => {
        if (table_schema === 'public' && table_name === 'NEW-VIEW') {
            const new_view = {
                table_schema: 'public',
                table_name: 'new_view',
                view_definition: `SELECT * FROM <table>`,
            }
            // useEffect public NEW-VIEW false true false ***NEW-VIEW***
            console.log('setting view to', new_view);
            setView(new_view)        
        } else {
            loadView()
        }
	}, [])
    useEffect(() => {
        console.log('view', view);
    }, [view]);
	function handleEditorChange(value: any, event: any) {
		// here is the current value
		console.log('handleEditorChange', value)
        setView({...view, view_definition: value})
	}

	function handleEditorDidMount(editor: any, monaco: any) {
		console.log('onMount: the editor instance:', editor)
		console.log('onMount: the monaco instance:', monaco)
	}

	function handleEditorWillMount(monaco: any) {
		console.log('beforeMount: the monaco instance:', monaco)
	}

	function handleEditorValidation(markers: any) {
		// model markers
		console.log('handleEditorValidation', markers)
		markers.forEach((marker: { message: any }) => console.log('onValidate:', marker.message))
	}

    return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton />
					</IonButtons>
					<IonTitle>
						View: {table_schema}.{table_name}
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
                    { (table_schema === 'public' && table_name === 'NEW-VIEW') &&
                        <>
        				<IonGrid>
                        <IonRow key="name-header" className="header">
                            <IonCol>
							View Name:{' '}
							<IonInput
								value={view.table_name}
								onIonChange={debounce((e) => setView({...view, table_name: e.detail.value!}), 750)}
								type='text'
								style={{ border: '1px solid' }}
							/>
                            </IonCol>
                        </IonRow>
                        </IonGrid>
                        </>
                    }
                    { !(table_schema === 'public' && table_name === 'NEW-VIEW') &&
                        <>
                        <IonGrid>
                        <IonRow key="info-header" className="header">
                            <IonCol>Schema</IonCol>
                            <IonCol>Name</IonCol>
                        </IonRow>
                        <IonRow key="info-data">
                            <IonCol>{view?.table_schema}</IonCol>
                            <IonCol>{view?.table_name}</IonCol>
                        </IonRow>
                        </IonGrid>
                        </>
                    }
                <Editor
								className='textarea'
								height="60vh"
								defaultLanguage='sql'
								defaultValue={view?.view_definition}
								value={view?.view_definition}
								theme={
									window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light'
								}
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
								{ text: 'OK', handler: (d) => deleteView() },
							  ],
							  onDidDismiss: (e) => console.log('did dismiss'),
							})
						  }>
							<strong>DELETE</strong>
						</IonButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton color='dark' fill='outline' onClick={save}>
							<strong>SAVE</strong>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	)
}

export default DatabaseView
