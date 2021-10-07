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

const DatabaseFunctions: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [functions, setFunctions] = useState<any[]>([])
    const loadFunctions = async () => {
        const { data, error } = await supabaseDataService.getFunctions();
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            setFunctions(data!);
        }
    }
	useIonViewDidEnter(() => {
		console.log('useIonViewDidEnter...')
        loadFunctions()
	})
    useEffect(() => {
        //loadFunctions();
    },[]);
    
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
				<IonGrid>
					<IonRow>
                        <IonCol>Schema</IonCol>
						<IonCol>Name</IonCol>
						<IonCol>Language</IonCol>
						<IonCol>Arguments</IonCol>
						<IonCol>Return Type</IonCol>
					</IonRow>

                    {functions.map((f: any) => {
                        return (
                            <IonRow key={f.function_schema + '.' + f.function_name} onClick={() => history.push(`/database-function/${f.function_schema}/${f.function_name}`)}>
                                <IonCol>{f.function_schema}</IonCol>
                                <IonCol>{f.function_name}</IonCol>
                                <IonCol>{f.function_language}</IonCol>
                                <IonCol>{f.function_arguments}</IonCol>
                                <IonCol>{f.return_type}</IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseFunctions
