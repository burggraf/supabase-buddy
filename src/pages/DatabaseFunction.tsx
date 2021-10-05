import {
    IonBackButton,
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
} from '@ionic/react'
import Editor from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { SupabaseDataService } from '../services/supabase.data.service'
import './DatabaseFunction.css'
import { debounce } from 'ts-debounce'

const DatabaseFunction: React.FC = () => {
    const history = useHistory();
	const { function_schema } = useParams<{ function_schema: string }>()
	const { function_name } = useParams<{ function_name: string }>()
    const [definition, setDefinition] = useState<string>("")
    const [functionArguments, setFunctionArguments] = useState<string>("")
    const [functionLanguage, setFunctionLanguage] = useState<string>("")
    const [returnType, setReturnType] = useState<string>("")
    const [functionName, setFunctionName] = useState<string>("")
    const [functionSchema, setFunctionSchema] = useState<string>("")
    const [securityDefiner, setSecurityDefiner] = useState<boolean>(false)
	const supabaseDataService = new SupabaseDataService()
	const loadFunction = async () => {
        console.log('loadFunction');
        console.log('function_schema', function_schema);
        console.log('function_name', function_name);
		const { data, error } = await supabaseDataService.getFunction(function_schema, function_name)
		if (error) {
			console.error(error)
		} else {
            console.log('f data', data![0]);
            setDefinition(data![0].definition);
            setFunctionArguments(data![0].function_arguments);
            setFunctionLanguage(data![0].function_language);
            setReturnType(data![0].return_type);
            setFunctionName(data![0].function_name);
            setFunctionSchema(data![0].function_schema);
            setSecurityDefiner(data![0].security_definer);
		}
	}
    useEffect(() => {
		loadFunction()
	}, [])
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

    return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton />
					</IonButtons>
					<IonTitle>
						Function: {function_schema}.{function_name}
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
                    {/* definition: "CREATE OR REPLACE FUNCTION public.execute_sql(sqlcode text, statement_delimiter text)\n RETURNS json\n LANGUAGE plv8\n SECURITY DEFINER\nAS $function$\n\nconst arr = sqlcode.split(statement_delimiter);\nconst results = [];\n\n// this handles \"TypeError: Do not know how to serialize a BigInt\"\nfunction toJson(data) {\n  if (data !== undefined) {\n    return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)\n        .replace(/\"(-?\\d+)#bigint\"/g, (_, a) => a);\n  }\n}\n\nfor (let i = 0; i < arr.length; i++) {\n    if (arr[i].trim() !== '') {\n        const result = plv8.execute(arr[i]);\n        results.push(toJson(result));\n    }\n}\nreturn results;\n\n$function$\n"
                    function_arguments: "sqlcode text, statement_delimiter text"
                    function_language: "plv8"
                    function_name: "execute_sql"
                    function_schema: "public"
                    return_type: "json"                     */}

                    <IonRow key="schema">
                        <IonCol size="2">Schema</IonCol>
                        <IonCol>{functionSchema}</IonCol>
                    </IonRow>
                    <IonRow key="name">
                        <IonCol size="2">Name</IonCol>
                        <IonCol>{functionName}</IonCol>
                    </IonRow>
                    <IonRow key="language">
                        <IonCol size="2">Language</IonCol>
                        <IonCol>{functionLanguage}</IonCol>
                    </IonRow>
                    <IonRow key="arguments">
                        <IonCol size="2">Arguments</IonCol>
                        <IonCol>{functionArguments}</IonCol>
                    </IonRow>
                    <IonRow key="return_type">
                        <IonCol size="2">Return Type</IonCol>
                        <IonCol>{returnType}</IonCol>
                    </IonRow>
                    <IonRow key="security_definer">
                        <IonCol size="2">SecDef</IonCol>
                        <IonCol>{securityDefiner?'true':'false'}</IonCol>
                    </IonRow>
				</IonGrid>
                <Editor
								className='textarea'
								height="60vh"
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

			</IonContent>
		</IonPage>
	)
}

export default DatabaseFunction
