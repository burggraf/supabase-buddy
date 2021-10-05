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
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { SupabaseDataService } from '../services/supabase.data.service'
import './DatabaseFunction.css'

const DatabaseFunction: React.FC = () => {
    const history = useHistory();
	const { function_schema } = useParams<{ function_schema: string }>()
	const { function_name } = useParams<{ function_name: string }>()
	const [f, setF] = useState<any>({})
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
			setF(data![0])
		}
	}
	useEffect(() => {
		loadFunction()
	}, [])
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
					<IonRow>
						<IonCol>name</IonCol>
						<IonCol>type</IonCol>
					</IonRow>
                    {Object.keys(f).map((attribute, index) => {
                        return (
                            <IonRow key={attribute}>
                                <IonCol>{attribute}</IonCol>
                                <IonCol>{typeof f[attribute] !== 'object' ? f[attribute]:JSON.stringify(f[attribute])}</IonCol>
                            </IonRow>
                        )
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseFunction
