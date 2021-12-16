import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { Sort, TableColumnSort } from 'ionic-react-tablegrid'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import SupabaseDataService from '../services/supabase.data.service'
import UtilsService from '../services/utils.service'
import './DatabaseSchemas.css'



const utilsService = UtilsService.getInstance();

const DatabaseSchemas: React.FC = () => {
    const history = useHistory();
	const supabaseDataService = SupabaseDataService.getInstance()
    // const { name } = useParams<{ name: string }>()
    const [schemas, setSchemas] = useState<any[]>([])
    const loadSchemas = async () => {
        const { data, error } = await supabaseDataService.getSchemas(sort.orderBy, sort.ascending);
        if (error) {
            console.error(error);
        } else {
            setSchemas(data!);
        }
    }
    const [sort, setSort] = useState<Sort>({orderBy: 'schema_name', ascending: true});
    const changeSort = async (newSort: Sort) => {
      setSort(newSort);
      loadSchemas();
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
						<IonCol>Schema&nbsp;&nbsp;<TableColumnSort sort={sort} columnName="schema_name" callback={changeSort}/></IonCol>
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
