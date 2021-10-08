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
import './DatabaseTable.css'

const DatabaseTable: React.FC = () => {
    const history = useHistory();
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const [columns, setColumns] = useState<any[]>([])
	const supabaseDataService = new SupabaseDataService()
	const loadColumns = async () => {
        console.log('loadColumns');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
		const { data, error } = await supabaseDataService.getColumns(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setColumns(data!)
            console.log('data', data);
		}
	}
	useEffect(() => {
		loadColumns()
	}, [])
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton />
					</IonButtons>
					<IonTitle>
						{table_schema}.{table_name}
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonGrid>
					<IonRow className="header">
						<IonCol>name</IonCol>
						<IonCol>type</IonCol>
					</IonRow>
					{columns.map((column: any) => {
                        return (
                            <IonRow key={column.column_name} onClick={() => history.push(`/database-column/${table_schema}/${table_name}/${column.column_name}`)}>
                                <IonCol>{column.column_name}</IonCol>
                                <IonCol>{column.data_type}</IonCol>
                            </IonRow>
                        )
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTable
