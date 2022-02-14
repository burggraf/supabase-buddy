import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

//import ItemPicker from '../components/ItemPicker'
import ItemPickerAccordion from './ItemPickerAccordion'
import SupabaseDataService from '../services/supabase.data.service'

import './DatabaseColumn.css'
import { arrowBackOutline, checkmarkOutline, closeOutline } from 'ionicons/icons'

// const utilsService = UtilsService.getInstance();
interface ContainerProps {
	schema: string;
	table: string;
	column: string;
	showModal: any;
	setShowModal: any;
	updateColumn: Function;
}

const DatabaseColumn: React.FC<ContainerProps> = ({
	schema, table, column, showModal, setShowModal, updateColumn
}) => {
	// const { schema } = useParams<{ schema: string }>()
	// const { table } = useParams<{ table: string }>()
	// const { column } = useParams<{ column: string }>()
	const [rows, setRows] = useState<any[]>([])
	// const [showModal, setShowModal] = useState({ isOpen: false })

	//const [data_type, set] = useState<string>("")
	const [data_type, setDataType] = useState<string>("")
	
	const dataTypeOptions = [
		{ value: "text-items", text: "Text Data Types",
			children:[
				{ value: "text", text: "text", description: "unlimited length text string" },
				{ value: "char", text: "char", description: "fixed length text string" },	
				{ value: "character varying", text: "varchar", description: "variable length text string" },			
			] },
		{ value: "number-items", text: "Numeric Data Types",
			children:[
				{ value: "numeric", text: "numeric" },
				{ value: "smallint", text: "smallint" },	
				{ value: "integer", text: "integer" },	
				{ value: "bigint", text: "bigint" },			
			] },
		{ value: "increment-items", text: "Auto Increment Types",
			children:[
				{ value: "smallserial", text: "smallserial" },	
				{ value: "serial", text: "serial" },
				{ value: "bigserial", text: "bigserial" },
			] },
		{ value: "temporal-items", text: "Time & Date Types",
			children:[
				{ value: "date", text: "date" },
				{ value: "time", text: "time" },
				{ value: "timestamp", text: "timestamp" },
				{ value: "timestampz", text: "timestampz" },
				{ value: "interval", text: "interval" },
			] },
		{ value: "other-items", text: "Other Data Types",
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
		if (column) {
			const { data, error } = await supabaseDataService.getColumn(schema, table, column)
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
	}
	useEffect(() => {
		console.log('useEffect: column', column);
		loadColumn()
	}, [column])
	useEffect(() => {
		console.log('useEffect: data_type', data_type);
		// find attribute:data_type in rows
		const index = rows.findIndex(row => row.Attribue === 'data_type');
		if (index > -1) {
			rows[index].Value = data_type;
		}
	}, [data_type])
	const save = async () => {
		console.log('save data here');
		const newColumn: any = {};
		rows.map((row) => {
			newColumn[row.Attribue] = row.Value;
		})
		console.log('newColumn', newColumn);
		updateColumn(newColumn);
		setShowModal({ isOpen: false });
	}
	return (

		<IonModal
		isOpen={showModal.isOpen}
		animated={true}
		// onDidDismiss={() => setShowModal({ isOpen: false })}
		className='my-custom-class'>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonButton color='primary' onClick={() => setShowModal({ isOpen: false })}>
								<IonIcon size='large' icon={closeOutline}></IonIcon>
						</IonButton>
					</IonButtons>
					<IonTitle>
						{schema}.{table}.{column}
					</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={save}>
								<IonIcon size='large' icon={checkmarkOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent className="ion-padding">

				{/* Name
				Description
				Type
				Default Value
				Allow Null
				Is Unique
				(Foreign Key) */}

				data_type : 
							<ItemPickerAccordion 
								stateVariable={data_type} 									
								stateFunction={ (e: any) => {setDataType(e!)} } 
								initialValue={data_type}
								options={dataTypeOptions}
								title="Data Type"
								allowManualInput={true}
								manualInputTitle='Custom Type:'
							/>


				<TableGrid rows={rows} rowClick={() => {}}/>

			</IonContent>
		</IonModal>
	)
}

export default DatabaseColumn
