import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonModal,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react'
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
	column: any
	showModal: any
	setShowModal: any
	updateColumn: Function
}

const DatabaseColumn: React.FC<ContainerProps> = ({
	column,
	showModal,
	setShowModal,
	updateColumn,
}) => {
	// const { schema } = useParams<{ schema: string }>()
	// const { table } = useParams<{ table: string }>()
	// const { column } = useParams<{ column: string }>()
	const [rows, setRows] = useState<any[]>([])
	// const [showModal, setShowModal] = useState({ isOpen: false })

	//const [data_type, set] = useState<string>("")
	const [data_type, setDataType] = useState<string>(column.data_type)

	const dataTypeOptions = [
		{
			value: 'text-items',
			text: 'Text Data Types',
			children: [
				{ value: 'text', text: 'text', description: 'unlimited length text string' },
				{ value: 'char', text: 'char', description: 'fixed length text string' },
				{ value: 'character varying', text: 'varchar', description: 'variable length text string' },
			],
		},
		{
			value: 'number-items',
			text: 'Numeric Data Types',
			children: [
				{ value: 'numeric', text: 'numeric' },
				{ value: 'smallint', text: 'smallint' },
				{ value: 'integer', text: 'integer' },
				{ value: 'bigint', text: 'bigint' },
			],
		},
		{
			value: 'increment-items',
			text: 'Auto Increment Types',
			children: [
				{ value: 'smallserial', text: 'smallserial' },
				{ value: 'serial', text: 'serial' },
				{ value: 'bigserial', text: 'bigserial' },
			],
		},
		{
			value: 'temporal-items',
			text: 'Time & Date Types',
			children: [
				{ value: 'date', text: 'date' },
				{ value: 'time', text: 'time' },
				{ value: 'timestamp', text: 'timestamp' },
				{ value: 'timestampz', text: 'timestampz' },
				{ value: 'interval', text: 'interval' },
			],
		},
		{
			value: 'other-items',
			text: 'Other Data Types',
			children: [
				{ value: 'boolean', text: 'boolean' },
				{ value: 'array', text: 'array' },
				{ value: 'json', text: 'json' },
				{ value: 'jsonb', text: 'jsonb' },
				{ value: 'uuid', text: 'uuid' },
			],
		},
	]
	const supabaseDataService = SupabaseDataService.getInstance()
	const loadColumn = async () => {
		console.log('loadColumn, data_type', column, data_type, column.data_type)
		if (column.column_name) {
			//const attributes: any = column; //data![0];
			const newRows: any[] = []
			Object.keys(column).map((key, index) => {
				if (key !== 'data_type') {
					newRows.push({ Attribue: key, Value: column[key] })
				}
			})
			setRows(newRows)
			setDataType(column.data_type)
		} else {
			console.log('no column yet, skipping...')
		}
	}
	useEffect(() => {
		console.log('useEffect: column', column)
		loadColumn()
	}, [column])
	// useEffect(() => {
	// 	console.log('useEffect: data_type', data_type, 'rows', rows)
	// 	// find attribute:data_type in rows
	// 	const index = rows.findIndex((row) => row.Attribue === 'data_type')
	// 	console.log('useEffect: index', index)
	// 	if (index > -1) {
	// 		rows[index].Value = data_type
	// 	}
	// }, [data_type])
	const save = async () => {
		console.log('save data here')
		const newColumn: any = {}
		rows.map((row) => {
			newColumn[row.Attribue] = row.Value
		})
		newColumn.data_type = data_type
		console.log('newColumn', newColumn)
		updateColumn(newColumn)
		setShowModal({ isOpen: false })
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
						{column.table_name}.{column.column_name}
					</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={save}>
							<IonIcon size='large' icon={checkmarkOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent className='ion-padding'>
				<table style={{width: '100%'}}>
					<tbody>
						<tr>
							<td style={{verticalAlign: 'middle', paddingLeft: '10px'}}>data_type</td>
							<td>
								<ItemPickerAccordion
									stateVariable={data_type}
									stateFunction={(e: any) => {
										setDataType(e!)
									}}
									initialValue={data_type}
									options={dataTypeOptions}
									title='Data Type'
									allowManualInput={true}
									manualInputTitle='Custom Type:'
								/>
							</td>
						</tr>
					</tbody>
				</table>
				{/* <IonItem>
                            <IonLabel slot='start'>{'Description:'}</IonLabel>
                            <IonInput type='text'
                                     value={manualInput}
                                     style={{border: '1px solid',paddingLeft:'5px'}}
                                     onIonChange={(e) => {setManualInput(e.detail.value! || '')}}></IonInput>
                            <IonButtons slot='end'>
                                <IonButton fill='clear' color='medium' onClick={() => {chooseValue(manualInput)}}>
                                    <IonIcon size='large' icon={checkmarkOutline}></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonItem> */}
				<TableGrid rows={rows} rowClick={() => {}} />
			</IonContent>
		</IonModal>
	)
}

export default DatabaseColumn
