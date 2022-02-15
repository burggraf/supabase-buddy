import {
	IonAlert,
	IonBackButton,
	IonButton,
	IonButtons,
	IonCheckbox,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonLabel,
	IonModal,
	IonPage,
	IonTitle,
	IonToolbar,
	useIonToast,
} from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

//import ItemPicker from '../components/ItemPicker'
import ItemPickerAccordion from './ItemPickerAccordion'
import SupabaseDataService from '../services/supabase.data.service'

import './DatabaseColumn.css'
import { arrowBackOutline, checkmarkOutline, closeOutline, trashBin, trashBinOutline } from 'ionicons/icons'

// const utilsService = UtilsService.getInstance();
interface ContainerProps {
	schema: string
	isNewColumn: boolean
	column: any
	showModal: any
	setShowModal: any
	updateColumn: Function
}

const DatabaseColumn: React.FC<ContainerProps> = ({
	schema,
	isNewColumn,
	column,
	showModal,
	setShowModal,
	updateColumn,
}) => {
	// const { schema } = useParams<{ schema: string }>()
	// const { table } = useParams<{ table: string }>()
	// const { column } = useParams<{ column: string }>()
	const [rows, setRows] = useState<any[]>([])
	const [sql, setSql] = useState<string>('')
	// const [showModal, setShowModal] = useState({ isOpen: false })

	//const [data_type, set] = useState<string>("")
	const [data_type, setDataType] = useState<string>(column.data_type)

	const [localCol, setLocalCol] = useState<any>(column);
	const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
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
				{ value: 'timestamp', text: 'timestamp', description: 'timestamp without time zone' },
				{ value: 'timestampz', text: 'timestampz', description: 'timestamp with time zone' },
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
	const [presentToast, dismissToast] = useIonToast();
    const toast = (message: string, color: string = 'danger') => {
        presentToast({
            color: color,
            message: message,
            cssClass: 'toast',
            buttons: [{ icon: 'close', handler: () => dismissToast() }],
            duration: 6000,
            //onDidDismiss: () => console.log('dismissed'),
            //onWillDismiss: () => console.log('will dismiss'),
          })
    }
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
		loadColumn() // unnecessary?
		setLocalCol(column);
		setDataType(column.data_type);
		// calculateSQL();
	}, [column])
	useEffect(() => {
		calculateSQL();
	},[localCol])
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
		console.log('save data here: localCol', localCol)
		if (isNewColumn) {
			const { data: createData, error: createError } = await supabaseDataService.createColumn(
				schema, 
				localCol.table_name, 
				localCol.column_name,
				data_type,
				localCol.is_nullable,
				localCol.column_default);
			if (createError) {
				console.error('create error', createError);
				toast(createError.message, 'danger');
			} else {
				const { data: descriptionData, error: descriptionError} = 
					await supabaseDataService.setColumnDescription(
						schema, 
						localCol.table_name, 
						localCol.column_name,
						localCol.description);
				if (descriptionError) {
					console.error('description error', descriptionError);
					toast(descriptionError.message, 'danger');	
				}
			}
		} else {
			console.log('column', column);
			console.log('localCol', localCol);
		}
		const newColumn = { ...localCol }
		// const newColumn: any = {}
		// rows.map((row) => {
		// 	newColumn[row.Attribue] = row.Value
		// })
		newColumn.data_type = data_type
		console.log('newColumn', newColumn)
		updateColumn(newColumn)
		setShowModal({ isOpen: false })
	}
	const changeHandler = (e: any) => {
		console.log('changehandler...');
		const fld = e.srcElement.itemID
		console.log('fld', fld);
		let newVal = e.detail.value!;
		if (fld === 'is_nullable') {
			console.log('*** is_nullable', newVal);
			console.log('e', e);
			newVal = e.detail.checked ? 'YES' : 'NO'
		}
		console.log('e.detail.value', e.detail.value);
		setLocalCol({ ...localCol, [fld]: newVal })
	}
	
	const deleteColumn = () => {
		console.log('not implemented yet');
		setShowDeleteButton(true);

	}
	const calculateSQL = () => {
		console.log('calculateSQL');
		let sql = '';
		if (column.column_name !== localCol.column_name) {
			sql += `ALTER TABLE ${localCol.table_name} RENAME COLUMN ${column.column_name} TO ${localCol.column_name};\n`
		}
		if (column.description !== localCol.description) {
			sql += `COMMENT ON COLUMN ${localCol.table_name}.${localCol.column_name} IS '${localCol.description?.replace(/'/g,"''")}';\n`
		}
		setSql(sql);
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
						{ !isNewColumn &&
						<IonButton color='danger' onClick={deleteColumn}>
							<IonIcon size='large' icon={trashBinOutline}></IonIcon>
						</IonButton>
						}
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
							<td style={{verticalAlign: 'middle', paddingLeft: '10px'}}>column_name</td>
							<td>
								<IonInput type='text'
										value={localCol.column_name}
										itemID='column_name'
										style={{border: '1px solid',paddingLeft:'5px'}}
										onIonChange={changeHandler}></IonInput>
							</td>
						</tr>
						<tr>
							<td style={{verticalAlign: 'middle', paddingLeft: '10px'}}>description</td>
							<td>
								<IonInput type='text'
										value={localCol.description}
										itemID='description'
										style={{border: '1px solid',paddingLeft:'5px'}}
										onIonChange={changeHandler}></IonInput>
							</td>
						</tr>
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
						<tr>
							<td style={{verticalAlign: 'middle', paddingLeft: '10px'}}>default</td>
							<td>
								<IonInput type='text'
										itemID='column_default'
										value={localCol.column_default}
										style={{border: '1px solid',paddingLeft:'5px'}}
										onIonChange={changeHandler}></IonInput>
							</td>
						</tr>
						<tr style={{height: '40px'}}>
							<td style={{verticalAlign: 'middle', paddingLeft: '10px'}}>is_nullable</td>
							<td style={{paddingLeft:'5px', paddingTop:'5px', verticalAlign: 'top'}}>
								<IonCheckbox 
										mode="ios"
										itemID='is_nullable'
										value={localCol.is_nullable}
										checked={localCol.is_nullable === 'YES'}
										onIonChange={changeHandler}></IonCheckbox>
								<IonLabel style={{paddingLeft: '10px'}}>{localCol.is_nullable}</IonLabel>
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
				SQL:
				<pre>{sql}</pre>
						{ isNewColumn &&
						<>
						<pre>ALTER TABLE {schema}.{localCol.table_name}{'\n'}
						{'  '}ADD COLUMN {localCol.column_name} {data_type}{'\n'}
						{'  '}{localCol.is_nullable==='YES' ? 'NULL' : 'NOT NULL'}
						{localCol.column_default ? `\n  DEFAULT ${localCol.column_default}` : ''};{'\n'}
						COMMENT ON COLUMN {schema}.{localCol.table_name}.{localCol.column_name}{'\n'} 
						{'  '}IS '{localCol.description?.replace(/'/g, "''")}';
						</pre>
						</>
						}

			    <pre>Schema: {schema}</pre>
				<pre>isNew: {isNewColumn?'YES':'NO'}</pre>
				<pre>
				{JSON.stringify(localCol, null, 2)}
				</pre>

				<IonAlert
          isOpen={showDeleteButton}
          // onDidDismiss={() => setShowAlert3(false)}
          cssClass='my-custom-class'
          header={'Confirm Delete'}
          message={`<strong>Delete this column - are you sure?</strong>\n
		  			<pre><strong>ALTER TABLE\n${schema}.${localCol.table_name}\n  DROP COLUMN ${localCol.column_name};</strong></pre>`}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              id: 'cancel-button',
              handler: blah => {
                console.log('canceled');
				setShowDeleteButton(false);
              }
            },
            {
              text: 'DELETE',
              id: 'confirm-button',
              handler: async () => {
                console.log('DELETE confirmed');
				const { data, error } = await supabaseDataService.dropColumn(schema, localCol.table_name, localCol.column_name);
				if (error) {
					toast(error.message, 'danger');
				}
				setShowDeleteButton(false);
				setShowModal({ isOpen: false })
              }
            }
          ]}
        />
				{/* <TableGrid rows={rows} rowClick={() => {}} /> */}
			</IonContent>
		</IonModal>
	)
}

export default DatabaseColumn
