import {
    IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
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
        console.log('running this:', view.definition);
        const sql = `DROP VIEW ${table_schema}.${table_name};;;CREATE OR REPLACE VIEW ${table_schema}.${table_name} AS ${view.view_definition}`;
        console.log("RUN SQL:", sql);
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
        toast('not implmented yet', 'danger');
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
    useEffect(() => {
		loadView()
	}, [])
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
				<IonGrid>

                    <IonRow key="info-header" className="header scrollMe">
                        <IonCol>Schema</IonCol>
                        <IonCol>Name</IonCol>
                        <IonCol>check_option</IonCol>
                        <IonCol>is_updatable</IonCol>
                        <IonCol>is_insertable_into</IonCol>
                        <IonCol>is_trigger_updatable</IonCol>
                        <IonCol>is_trigger_deletable</IonCol>
                        <IonCol>is_trigger_insertable_into</IonCol>
                    </IonRow>
                    <IonRow key="info-data" className="scrollMe">
                        <IonCol>{view.table_schema}</IonCol>
                        <IonCol>{view.table_name}</IonCol>
                        <IonCol>{view.check_option}</IonCol>
                        <IonCol>{view.is_updatable}</IonCol>
                        <IonCol>{view.is_insertable_into}</IonCol>
                        <IonCol>{view.is_trigger_updatable}</IonCol>
                        <IonCol>{view.is_trigger_deletable}</IonCol>
                        <IonCol>{view.is_trigger_insertable_into}</IonCol>
                    </IonRow>
				</IonGrid>
                <Editor
								className='textarea'
								height="60vh"
								defaultLanguage='sql'
								defaultValue={view.view_definition}
								value={view.view_definition}
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
