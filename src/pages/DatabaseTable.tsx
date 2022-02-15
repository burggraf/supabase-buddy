import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonReorder, IonReorderGroup, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar, ItemReorderEventDetail, useIonToast, useIonViewWillEnter } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { addCircleSharp, addOutline, checkmark } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import DisplayDetail from '../components/DisplayDetail'
import ItemPicker from '../components/ItemPicker'
import TableApi from '../components/TableApi'
import DatabaseColumn from '../components/DatabaseColumn'
import SupabaseDataService from '../services/supabase.data.service'
import UtilsService from '../services/utils.service'

import './DatabaseTable.css'

const utilsService = UtilsService.getInstance()
const supabaseDataService = SupabaseDataService.getInstance();
// const columnOptions = [
// 	{ value: "text", text: "text - variable unlimited length text" },
// 	{ value: "numeric", text: "numeric - any numeric entry" },
// 	{ value: "int2", text: "int2 - signed two-byte integer" },
// 	{ value: "int4", text: "int4 - signed four-byte integer" },
// 	{ value: "int8", text: "int8 - signed eight-byte integer" },
// 	{ value: "float4", text: "float4 - single precision floating point number 4-bytes" },
// 	{ value: "float8", text: "float8 - double precision floating point number 8-bytes" },
// 	{ value: "json", text: "json - textual JSON data" },
// 	{ value: "jsonb", text: "jsonb - binary JSON data, decomposed" },
// 	{ value: "varchar", text: "varchar - variable length character string" },
// 	{ value: "uuid", text: "uuid - universally unique identifier" },
// 	{ value: "date", text: "date - calendar date (year, month, day)" },
// 	{ value: "time", text: "time - time of day (no time zone)" },
// 	{ value: "timetz", text: "timetz - time of day (including time zone)" },
// 	{ value: "timestamp", text: "timestamp - date and time (no time zone)" },
// 	{ value: "timestamptz", text: "timestamptz - date and time (including time zone)" },
// 	{ value: "bool", text: "bool - logical boolean (true/false)" }, 
//   ];
const DatabaseTable: React.FC = () => {
    const history = useHistory();
	const [showColumnModal, setShowColumnModal] = useState({ isOpen: false })
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const [ table, setTable ] = useState(table_schema === 'NEW' && table_name === 'TABLE' ? '' : table_name);
	const [ schema, setSchema ] = useState(table_schema === 'NEW' ? 'public' : table_schema);
	const [ column, setColumn ] = useState<any>({});
	const [ schemas, setSchemas ] = useState<any[]>([]);
	const [createTableStatement, setCreateTableStatement] = useState<string>("")
	const [name, setName] = useState(table_schema === 'NEW' && table_name === 'TABLE' ? '' : table_name)
	const [columns, setColumns] = useState<any[]>([])
	const [detailCollection, setDetailCollection] = useState<any[]>([])
	const [rows, setRows] = useState<any[]>([])
	const [currentIndex, setCurrentIndex] = useState(1)
	const [indexes, setIndexes] = useState<any[]>([])
	const [grants, setGrants] = useState<any[]>([])
	const [primaryKeys, setPrimaryKeys] = useState<any[]>([])
	const [policies, setPolicies] = useState<any[]>([])
	const [ mode, setMode ] = useState<'schema' | 'data' | 'tls' | 'rls' | 'indexes' | 'api'>('schema')

	const [detailTrigger, setDetailTrigger] = useState({action: ''})
	const [record, setRecord] = useState({});
	const [editMode, setEditMode] = useState({ editMode: false });

	const [keys, setKeys] = useState<string[]>([]);
	const [gridWidth, setGridWidth] = useState(0);
	const [columnWidths, setColumnWidths] = useState<any[]>([]);

	useIonViewWillEnter(() => {
		console.log('ionViewWillEnter event fired');
	  });

	const loadSchemas = async () => {
		const { data, error } = await supabaseDataService.getSchemas()
		if (error) {
			console.error(error)
		} else {
			const newSchemas: any[] = [];
			data.forEach((schema: any) => {
				newSchemas.push({ value: schema.schema_name, text: schema.schema_name })
			});
			setSchemas(newSchemas)
		}
	}

	const loadColumns = async () => {
		const { data, error } = await supabaseDataService.getColumns(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			data.map((column: any, index: number) => {
				if (column.column_default === null) column.column_default = '';	
				if (column.description === null) column.description = '';			
			});
			setColumns(data!)
		}
	}	
	const loadData = async () => {
		const { data, error } = await supabaseDataService.getTableRows(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			rows.map((row, index) => (
				keys.map((key, index) => {
					// if (!Array.isArray(row[key])) {
					if (typeof row[key] === 'object') {
						row[key] = JSON.stringify(row[key]);
					}
				})
			))
			setRows(data!)
		}
	}
	const loadIndexes = async () => {
		const { data, error } = await supabaseDataService.getIndexes(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setIndexes(data!)
		}
	}
	const loadPrimaryKeys = async () => {
		const { data, error } = await supabaseDataService.getPrimaryKeys(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setPrimaryKeys(data!)
		}
	}
	const loadGrants = async () => {
		const { data, error } = await supabaseDataService.getGrants(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setGrants(data!)
		}
	}
	const loadPolicies = async () => {
		const { data, error } = await supabaseDataService.getRLSPolicies(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setPolicies(data!)
		}
	}
	const loadCreateTableStatement = async () => {
		const { data, error } = await supabaseDataService.getCreateTableStatement(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			if (data && data.length) {
				setCreateTableStatement(data[0].create_table_statement)
			}
		}
	}
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
	useEffect(() => {
		console.log('useEffect: empty columns->', columns)
		if (table_schema === 'NEW' && table_name === 'TABLE') {
			loadSchemas();
			const newColumns: any[] = [
				// {
				// 	column_name: "id",
				// 	data_type: "uuid",
				// 	ordinal_position: "1",
				// 	column_default: "",
				// 	description: ""
				// }
			];
			setColumns(newColumns);
		} else {
			loadColumns();
			loadPrimaryKeys();
			loadData();
			loadIndexes();
			loadGrants();
			loadPolicies();	
			loadCreateTableStatement();
		}
	}, [])
	useEffect(() => {
		console.log('useEffect: table');
		generateNewCreateTableStatement();
	}, [table,schema]);
	const save = async () => {
		toast('not implemented yet', 'danger');
	}
	const saveDetailRecord = async (record: any) => {
		console.log('saveDetailRecord', record);
		const { data, error } = await supabaseDataService.upsertRecord(table_schema, table_name, record)
		if (error) {
			toast(error.message, 'danger');
		} else {
			toast('record saved', 'success');
			setRecord(record);
			setEditMode({ editMode: false });
			loadData();
		}
	}
	// const updateColumnType = (index: any, e: any) => {
	// 	let newColumnsArray = [...columns]; // copying the old array
	// 	newColumnsArray[index].data_type = e;
	// 	setColumns(newColumnsArray);	
	// }
	const clickColumn = (column: any) => {
		console.log('clickColumn', column);
		setColumn(column);
		setShowColumnModal({ isOpen: true })
	}
	const clickTLS = (row: any, index: number) => {
		setDetailCollection(grants);setCurrentIndex(index + 1);setRecord(row);setDetailTrigger({action:'open'})
	}
	const clickRLS = (row: any, index: number) => {
		setDetailCollection(policies);setCurrentIndex(index + 1);setRecord(row);setDetailTrigger({action:'open'})		
	}
	const clickIndex = (row: any, index: number) => {
		setDetailCollection(indexes);setCurrentIndex(index + 1);setRecord(row);setDetailTrigger({action:'open'})		
	}
	const clickDataRow = (row: any, index: number) => {
		setDetailCollection(rows);setCurrentIndex(index + 1);setRecord(row);setDetailTrigger({action:'open'})
	}
	const generateNewCreateTableStatement = () => {
		const newStatement = 
		`CREATE TABLE IF NOT EXISTS ${schema}.${table} (
		);`;
		setCreateTableStatement(newStatement);
	}
	const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
		// The `from` and `to` properties contain the index of the item
		// when the drag started and ended, respectively
		console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
	  
		// Finish the reorder and position the item in the DOM based on
		// where the gesture ended. This method can also be called directly
		// by the reorder group
		event.detail.complete();
	  }
	const updateColumn = async (column: any) => {
		console.log('updateColumn', column);	
		const newColumns = [...columns];
		const column_name = column.column_name;
		// find the index of the column
		const index = newColumns.findIndex(x => x.column_name === column_name);
		if (index > -1) {
			newColumns[index] = column;
		}
		console.log('newColumns', newColumns);
		setColumns(newColumns);
	}
	const addColumn = async () => {
		console.log('addColumn');
		const newColumn: any = supabaseDataService.newColumn();
		newColumn.table_name = table;
		newColumn.column_name = "new_column";
		newColumn.ordinal_position = columns.length + 1;
		newColumn.data_type = "text";  
		const newColumns = [...columns];
		newColumns.push(newColumn);
		setColumns(newColumns);
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref="/database-tables" />
					</IonButtons>
					<IonTitle>
						{ (table_schema === 'NEW' && table_name === 'TABLE') ? 'New Table' : `${table_schema}.${table_name}` }
					</IonTitle>
					{ (table_schema === 'NEW' && table_name === 'TABLE') &&
                    	<IonButtons slot="end">
							<IonButton color="primary" onClick={save}>
								<IonIcon size="large" icon={checkmark}></IonIcon>
							</IonButton>
						</IonButtons>
					}
				</IonToolbar>
			</IonHeader>

			<IonContent>
			{ (table_schema === 'NEW' && table_name === 'TABLE') &&
				<IonGrid>
					<IonRow key="name-header" className="header">
						<IonCol>
							Schema:
							<ItemPicker 
							stateVariable={schema} 									
							stateFunction={ (e: any) => {setSchema(e!)} } 
							initialValue={'public'}
							options={schemas}
							title="Schema"
							/>

						</IonCol>
						<IonCol>
						Table Name:{' '}
						<IonInput
							value={table}
							placeholder="Enter table name"
							debounce={750}
							onIonChange={(e) => setTable(e.detail.value!)}
							type='text'
							style={{ border: '1px solid', paddingLeft: '5px' }}
						/>
						</IonCol>
					</IonRow>
				</IonGrid>
			}
			{ !(table_schema === 'NEW' && table_name === 'TABLE') &&
				<IonSegment mode="ios" scrollable={true} value={mode} onIonChange={e => {
					if (e.detail.value === 'data' || 
						e.detail.value === 'schema' ||
						e.detail.value === 'tls' ||
						e.detail.value === 'rls' ||
						e.detail.value === 'indexes' || 
						e.detail.value === 'api') {
						if (e.detail.value === 'data' && rows && rows.length > 0) { 
							const keys = Object.keys(rows[0])
							const { gridWidth, columnWidths } = utilsService.getGridWidths(rows);
							setKeys(keys);
							setGridWidth(gridWidth);
							setColumnWidths(columnWidths);			
						}
						setMode(e.detail.value)
					}
				}}>
					<IonSegmentButton value="schema">
						<IonLabel>Schema</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="data">
						<IonLabel>Data</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="tls">
						<IonLabel>TLS</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="rls">
						<IonLabel>RLS</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="indexes">
						<IonLabel>Indexes</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value="api">
						<IonLabel>API</IonLabel>
					</IonSegmentButton>
				</IonSegment>
			}

			{ ((mode === 'schema') || (table_schema === 'NEW' && table_name === 'TABLE')) &&
				<>
				{/* <TableGrid rows={columns} rowClick={clickSchema} setRows={setColumns} /> */}
				<IonList lines='full'>
				<IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
				<IonItem color="light">
					<IonReorder slot="start" style={{color: 'transparent'}} />
					<IonGrid>
						<IonRow>							
							<IonCol>
								Name
							</IonCol>
							<IonCol>
								Type
							</IonCol>
							<IonCol>
								Default
							</IonCol>
							<IonCol>
								Description
							</IonCol>
						</IonRow>
					</IonGrid>
    			</IonItem>
					{columns.map((column: any, index: number) => (
						<IonItem onClick={() => clickColumn(column)}>
							<IonReorder slot="start" />
							<IonGrid>
								<IonRow>
									<IonCol>
									 {column.column_name}
									</IonCol>
									<IonCol>
										{column.data_type}
									</IonCol>
									<IonCol>
										{column.column_default}
									</IonCol>
									<IonCol>
										{column.description}
									</IonCol>
								</IonRow>
							</IonGrid>
						</IonItem>
					))}
					<IonItem onClick={addColumn}>
						<IonButton color="primary" fill="clear">
								<IonIcon size="large" icon={addOutline}></IonIcon>
						</IonButton>
						<IonGrid>
							<IonRow>
								<IonCol>
									add column
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonItem>

				</IonReorderGroup>
				</IonList>
				<pre className="ion-padding">{createTableStatement}
				{indexes && indexes.length > 0 &&
					indexes.map((index: any, indexNumber: number) => {
						return ('\n' + index["indexdef^"] + ';');
					})
				}</pre>
				</>
			} 
			{ mode === 'data' && rows?.length > 0 &&

				<TableGrid rows={rows} rowClick={clickDataRow} setRows={setRows}/>

			}
			{ mode === 'tls' &&
			
				<TableGrid rows={grants} rowClick={clickTLS} setRows={setGrants}/>

			}
			{ mode === 'rls' && policies?.length > 0 &&

				<TableGrid rows={policies} rowClick={clickRLS} setRows={setPolicies}/>

			}
			{ mode === 'indexes' && indexes?.length > 0 &&
				<TableGrid rows={indexes} rowClick={clickIndex} setRows={setIndexes} />
			}
			{ mode === 'api' &&
				<div>
					<TableApi columns={columns} />
				</div>
			}
			<DisplayDetail 
				rec={record} 
				trigger={detailTrigger}  
				current={currentIndex} 
				total={detailCollection.length}
				onBack={()=>{		
					const newIndex = currentIndex - 1;
					setCurrentIndex(newIndex);
					setRecord(detailCollection[newIndex-1]);
				}}
				onForward={()=>{
					const newIndex = currentIndex + 1;
					setCurrentIndex(newIndex);
					setRecord(detailCollection[newIndex-1]);					
				}}
				title={`${table_schema}.${table_name} ${mode} Detail`}
				onSave={mode === 'data' && primaryKeys.length > 0 ? saveDetailRecord : null}
			/>
			<DatabaseColumn 
				column={column}
				updateColumn={updateColumn}
				showModal={showColumnModal}
				setShowModal={setShowColumnModal} />

							<pre>{JSON.stringify(columns,null,2)}</pre>

			</IonContent>
		</IonPage>
	)
}

export default DatabaseTable
