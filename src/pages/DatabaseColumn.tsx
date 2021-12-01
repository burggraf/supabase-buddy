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
import { UtilsService } from '../services/utils.service'
import TableGrid from '../components/TableGrid'
const utilsService = new UtilsService()

const DatabaseColumn: React.FC = () => {
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const { column_name } = useParams<{ column_name: string }>()
	const [rows, setRows] = useState<any[]>([])

	const supabaseDataService = new SupabaseDataService()
	const loadColumn = async () => {
		const { data, error } = await supabaseDataService.getColumn(table_schema, table_name, column_name)
		if (error) {
			console.error(error)
		} else {
			const attributes = data![0];
			const newRows:any[] = [];
			Object.keys(attributes).map((key, index) => {
				newRows.push({'Attribue': key, 'Value': attributes[key]});
			});
			setRows(newRows);
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



			<IonContent className="ion-padding">

				<TableGrid rows={rows} rowClick={() => {}}/>

			</IonContent>
		</IonPage>
	)
}

export default DatabaseColumn
