import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'

import './DatabaseSchemas.css'

const utilsService = new UtilsService()

const DatabaseSchemas: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = new SupabaseDataService()
	const { name } = useParams<{ name: string }>()
    const [schemas, setSchemas] = useState<any[]>([])
    const loadSchemas = async () => {
        const { data, error } = await supabaseDataService.getSchemas();
        if (error) {
            console.error(error);
        } else {
            setSchemas(data!);
        }
    }
	useIonViewDidEnter(() => {
        loadSchemas()
	})
    useEffect(() => {
        // loadTables();
    },[]);
    // const addView = () => {
    //     history.push(`/database-view/public/NEW-VIEW`);
    // }
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Database Schemas</IonTitle>
					{/* <IonButtons slot='end'>
						<IonButton color='primary' onClick={addView}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons> */}
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow className="header">
						<IonCol>Schema</IonCol>
					</IonRow>
                    {schemas.map((schema: any) => {
                        return (
                            <IonRow key={utilsService.randomKey()} onClick={() => history.push(`/database-schema/${schema.schema_name}`)}>
                                <IonCol>{schema.schema_name}</IonCol>
                            </IonRow>
                        );
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseSchemas
