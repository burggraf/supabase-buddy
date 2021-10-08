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
import { useParams } from 'react-router'
import { SupabaseDataService } from '../services/supabase.data.service'
import './DatabaseColumn.css'

const DatabaseColumn: React.FC = () => {
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const { column_name } = useParams<{ column_name: string }>()
    const [attributes, setAttributes] = useState<any>({})

	const supabaseDataService = new SupabaseDataService()
	const loadColumn = async () => {
        console.log('loadColumn');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
        console.log('column_name', column_name);
		const { data, error } = await supabaseDataService.getColumn(table_schema, table_name, column_name)
		if (error) {
			console.error(error)
		} else {
			setAttributes(data![0])
            console.log('attributes', data![0]);
		}
	}
	useEffect(() => {
		loadColumn()
	}, [])
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref="/database-tables" />
					</IonButtons>
					<IonTitle>
						{table_schema}.{table_name}.{column_name}
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
                    {Object.keys(attributes).map((key, index) => {
                        return (
                            <IonRow key={key}>
                                <IonCol>{key}</IonCol>
                                <IonCol>{attributes[key]}</IonCol>
                            </IonRow>
                        )
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseColumn
