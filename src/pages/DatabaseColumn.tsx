import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

//import ItemPicker from '../components/ItemPicker'
import ItemPickerAccordion from '../components/ItemPickerAccordion'
import SupabaseDataService from '../services/supabase.data.service'

import './DatabaseColumn.css'

// const utilsService = UtilsService.getInstance();

const DatabaseColumn: React.FC = () => {
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const { column_name } = useParams<{ column_name: string }>()
	const [rows, setRows] = useState<any[]>([])

	//const [data_type, set] = useState<string>("")
	const [data_type, setDataType] = useState<string>("")
	
	const dataTypeOptions = [
		{ value: "text-items", text: "Text",
			children:[
				{ value: "text", text: "text" },
				{ value: "char", text: "char" },	
				{ value: "varchar", text: "varchar" },			
			] },
		{ value: "number-items", text: "Number",
			children:[
				{ value: "numeric", text: "numeric" },
				{ value: "smallint", text: "smallint" },	
				{ value: "integer", text: "integer" },	
				{ value: "bigint", text: "bigint" },			
			] },
		{ value: "increment-items", text: "Auto Increment",
			children:[
				{ value: "smallserial", text: "smallserial" },	
				{ value: "serial", text: "serial" },
				{ value: "bigserial", text: "bigserial" },
			] },
		{ value: "temporal-items", text: "Time & Date",
			children:[
				{ value: "date", text: "date" },
				{ value: "time", text: "time" },
				{ value: "timestamp", text: "timestamp" },
				{ value: "timestampz", text: "timestampz" },
				{ value: "interval", text: "interval" },
			] },
		{ value: "other-items", text: "Others",
			children:[
				{ value: "boolean", text: "boolean" },
				{ value: "array", text: "array" },
				{ value: "json", text: "json" },
				{ value: "jsonb", text: "jsonb" },
				{ value: "uuid", text: "uuid" },
			] },
	]
	const supabaseDataService = SupabaseDataService.getInstance();
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
			setDataType(attributes.data_type);
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


				Name
				Description
				Type
				Default Value
				Allow Null
				Is Unique
				(Foreign Key)

				data_type : 
							<ItemPickerAccordion 
								stateVariable={data_type} 									
								stateFunction={ (e: any) => {setDataType(e!)} } 
								initialValue={data_type}
								options={dataTypeOptions}
								title="Data Type"
							/>


				<TableGrid rows={rows} rowClick={() => {}}/>

			</IonContent>
		</IonPage>
	)
}

export default DatabaseColumn
