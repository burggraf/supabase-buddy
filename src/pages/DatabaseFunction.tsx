import {
    IonBackButton,
	IonButton,
	IonButtons,
	IonCheckbox,
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
import './DatabaseFunction.css'
import { debounce } from 'ts-debounce'
import { setMode } from 'ionicons/dist/types/stencil-public-runtime'

const DatabaseFunction: React.FC = () => {
    const history = useHistory();
	const [present] = useIonAlert();
	const { function_schema } = useParams<{ function_schema: string }>()
	const { function_name } = useParams<{ function_name: string }>()
    const [definition, setDefinition] = useState<string>("")
    const [functionArguments, setFunctionArguments] = useState<string>("")
    const [functionLanguage, setFunctionLanguage] = useState<string>("")
    const [returnType, setReturnType] = useState<string>("")
    const [functionName, setFunctionName] = useState<string>("")
    const [functionSchema, setFunctionSchema] = useState<string>("")
    const [securityDefiner, setSecurityDefiner] = useState<boolean>(false)
	const [sqlPrefix, setSqlPrefix] = useState<string>("")
	const [sqlSuffix, setSqlSuffix] = useState<string>("$function$")
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


	const loadFunction = async () => {
        console.log('loadFunction');
        console.log('function_schema', function_schema);
        console.log('function_name', function_name);
		const { data, error } = await supabaseDataService.getFunction(function_schema, function_name)
		if (error) {
			console.error(error)
		} else {
            console.log('f data', data![0]);
			let definition = data![0].definition;
			// extract a portion of the definition between two tokens
			let start = definition.indexOf('$function$')
			let end = definition.indexOf('$function$', start + 1)
			if (start > -1 && end > -1) {
				definition = definition.substring(start + 11, end)
			}
			setDefinition(definition);
            setFunctionArguments(data![0].function_arguments);
            setFunctionLanguage(data![0].function_language);
            setReturnType(data![0].return_type);
            setFunctionName(data![0].function_name);
            setFunctionSchema(data![0].function_schema);
            setSecurityDefiner(data![0].security_definer);
		}
	}
	useEffect(() => {
		setSqlPrefix(`CREATE OR REPLACE FUNCTION ${functionSchema}.${functionName}(${functionArguments})
  RETURNS ${returnType} LANGUAGE ${functionLanguage} ${securityDefiner?'SECURITY DEFINER':''} AS $function$`);

	},[functionArguments, functionLanguage, returnType, functionName, functionSchema, securityDefiner]);
    useEffect(() => {
		loadFunction()
	}, []);
	function handleEditorChange(value: any, event: any) {
		// here is the current value
		console.log('handleEditorChange', value)
		setDefinition(value)
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
	const runSql = async () => {
			const sql = sqlPrefix + '\n' + definition + '\n' +  sqlSuffix;
			console.log('RUN THIS:', sql);
			const { data, error } = await supabaseDataService.runSql(sql, ';;;')
			if (error) {
				if (error && error.message) {
					toast(error.message, 'danger');
				} else {
					toast(JSON.stringify(error), 'danger');
					console.error(error)
				}
			} else {
				toast('Function was saved.', 'success');
			}
		}
	
	const deleteFunction = async () => {
		console.log('no implemented yet');
		toast('not implemented yet');
	}

    return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref="/database-functions" />
					</IonButtons>
					<IonTitle>
						Function: {function_schema}.{function_name}
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
				<IonRow key="schema">
					<IonCol className="ion-text-center">Schema</IonCol>
					<IonCol>
						<IonInput
							value={functionSchema}
							onIonChange={debounce((e) => setFunctionSchema(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
					</IonCol>
					<IonCol className="ion-text-center">Name</IonCol>
					<IonCol>
						<IonInput
							value={functionName}
							onIonChange={debounce((e) => setFunctionName(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
					</IonCol>
				</IonRow>
				<IonRow key="language">
					<IonCol className="ion-text-center">Lang</IonCol>
					<IonCol>
						<IonInput
							value={functionLanguage}
							onIonChange={debounce((e) => setFunctionLanguage(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
					</IonCol>
					<IonCol className="ion-text-center">Returns</IonCol>
					<IonCol>
						<IonInput
							value={returnType}
							onIonChange={debounce((e) => setReturnType(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
						</IonCol>						
				</IonRow>
				<IonRow key="arguments">
					<IonCol size="3" className="ion-text-center">Args</IonCol>
					<IonCol size="6">
						<IonInput
							value={functionArguments}
							onIonChange={debounce((e) => setFunctionArguments(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
					</IonCol>
					<IonCol size="3" className="ion-text-center">Sec Def <IonCheckbox checked={securityDefiner} onIonChange={e => setSecurityDefiner(e.detail.checked)} />
					  </IonCol>
				</IonRow>
			</IonGrid>
			<pre style={{paddingLeft:'10px'}}>{sqlPrefix}</pre>
                <Editor
								className='textarea'
								height="55vh"
								defaultLanguage='sql'
								defaultValue={definition}
								value={definition}
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
						<pre style={{paddingLeft:'10px'}}>{sqlSuffix}</pre>
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
								{ text: 'OK', handler: (d) => deleteFunction() },
							  ],
							  onDidDismiss: (e) => console.log('did dismiss'),
							})
						  }>
							<strong>DELETE</strong>
						</IonButton>
					</IonButtons>
					<IonButtons slot='end'>
						<IonButton color='dark' fill='outline' onClick={runSql}>
							<strong>SAVE</strong>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	)
}

export default DatabaseFunction
