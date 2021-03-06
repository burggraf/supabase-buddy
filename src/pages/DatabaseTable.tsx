import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonReorder, IonReorderGroup, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar, ItemReorderEventDetail, useIonToast, useIonViewWillEnter } from '@ionic/react'
import { TableGrid } from 'ionic-react-tablegrid'
import { addCircleSharp, addOutline, checkmark } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import DatabaseColumn from '../components/DatabaseColumn'
import DisplayDetail from '../components/DisplayDetail'
import ItemPicker from '../components/ItemPicker'
import TableApi from '../components/TableApi'
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
	const [ originalDescription, setOriginalDescription ] = useState('');
	const isNewTable = (table_schema === 'NEW' && table_name === 'TABLE');
	const [ table, setTable ] = useState(isNewTable ? '' : table_name);
	const [ schema, setSchema ] = useState(table_schema === 'NEW' ? 'public' : table_schema);
	const [ description, setDescription ] = useState('');
	const [ column, setColumn ] = useState<any>({});
	const [ isNewColumn, setIsNewColumn ] = useState(false);
	const [ columnIndex, setColumnIndex ] = useState(0);
	const [ schemas, setSchemas ] = useState<any[]>([]);
	const [createTableStatement, setCreateTableStatement] = useState<string>("")
	const [ modifyTableStatement, setModifyTableStatement] = useState<string>("")
	const [name, setName] = useState(isNewTable ? '' : table_name)
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
	const dropColumn = async (column: string) => {
		// delete column from columns array
		const newColumns = columns.filter((c: any) => c.column_name !== column);
		setColumns(newColumns);
	}
	const loadColumns = async () => {
		const { data, error } = await supabaseDataService.getColumns(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			data.map((column: any, index: number) => {
				column.data_type = utilsService.shortTypeName(column.data_type);
				if (column.column_default === null) column.column_default = '';	
				if (column.description === null) column.description = '';			
			});
			setColumns(data!)
		}
	}	
	const loadDescription = async () => {
		const { data, error } = await supabaseDataService.getTableDescription(table_schema, table_name);
		console.log('loadDescription', data, error);
		if (error) {
			console.error('loadDescription', error);
		} else {
			const newDescription = data[0]?.description! || '';
			setOriginalDescription(newDescription);
			setDescription(newDescription);
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
	// const loadCreateTableStatement = async () => {
	// 	const { data, error } = await supabaseDataService.getCreateTableStatement(table_schema, table_name)
	// 	if (error) {
	// 		console.error(error)
	// 	} else {
	// 		if (data && data.length) {
	// 			setCreateTableStatement(data[0].create_table_statement)
	// 		}
	// 	}
	// }
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
		if (isNewTable) {
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
			// setColumns(newColumns);
		} else {
			loadDescription();
			loadColumns();
			loadPrimaryKeys();
			loadData();
			loadIndexes();
			loadGrants();
			loadPolicies();	
			//loadCreateTableStatement();
		}
	}, [])
	useEffect(() => {
		console.log('useEffect: [columns, indexes, table, schema, description] changed!')
		console.log('columns', columns)
		console.log('indexes', indexes)
		generateCreateTableStatement();
	}, [columns, indexes, table, schema, description]);
	const save = async () => {
		let sql = '';
		if (isNewTable) {	
			sql = createTableStatement;
		} else {
			sql = modifyTableStatement;
		}
		const { data, error } = await supabaseDataService.runStatement(sql);
		if (error) {
			toast(error.message, 'danger');
			return;
		} else {
			// continue closing modal
			console.log('sql', sql);
			console.log('result', data);
			window.location.href = `/database-table/${schema}/${table}`;
		}
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
	const clickColumn = (column: any, index: number) => {
		console.log('clickColumn', column);
		setColumn(column);
		setColumnIndex(index);
		setIsNewColumn(false);
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
	const generateCreateTableStatement = () => {
		console.log('generateCreateTableStatement...');
		console.log('originalDescription', originalDescription);
		console.log('description', description);
		let s = `CREATE TABLE IF NOT EXISTS ${schema}.${table} (\n`;
		columns.forEach((column: any, index: number) => {
			if (index > 0) {
				s += ',\n';
			}
			s += `  ${column.column_name} ${column.data_type}`;
			if (column.column_default) {
				s += ` DEFAULT ${column.column_default}`;
			}
			if (column.is_nullable === 'NO') {
				s += ` NOT NULL`;
			} else {
				s += ` NULL`;
			}
			// if (column.description) {
			// 	s += ` COMMENT '${column.description}'`;
			// }
		});
		s += `);\n`;
		columns.forEach((column: any, index: number) => {
			if (column.description) {
				s += `COMMENT ON COLUMN ${schema}.${table}.${column.column_name}\n`;
				s += `  IS '${column.description?.replace(/'/g, "''")}';\n`;
			}
		});
		if (isNewTable) {
			if (description) {
				s += `COMMENT ON TABLE ${schema}.${table}\n`;
				s += `  IS '${description?.replace(/'/g, "''")}';\n`;
			}
		} else {
			if (description) {
				s += `COMMENT ON TABLE ${schema}.${table}\n`;
				s += `  IS '${description?.replace(/'/g, "''")}';\n`;
			} else {
				s += `COMMENT ON TABLE ${schema}.${table}\n`;
				s += `  IS NULL;\n`;
			}
		}

		setCreateTableStatement(s);
		let m = '';
		if (table_name !== table) {
			m += 'ALTER TABLE ' + schema + '.' + table_name + ' RENAME TO ' + table + ';\n';
		}
		if (originalDescription !== description) {
			if (description) {
				m += `COMMENT ON TABLE ${schema}.${table}\n`;
				m += `  IS '${description?.replace(/'/g, "''")}';\n`;
			} else {
				m += `COMMENT ON TABLE ${schema}.${table}\n`;
				m += `  IS NULL;\n`;
			}
		}

		setModifyTableStatement(m);
		console.log('createTableStatement', s);
		console.log('modifyTableStatement', m);
	}
	function move(array: Array<string>, from: number, to: number) {
		if( to === from ) return array;
	  
		var target = array[from];                         
		var increment = to < from ? -1 : 1;
	  
		for(var k = from; k != to; k += increment){
		  array[k] = array[k + increment];
		}
		array[to] = target;
		return array;
	  }
	const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
		// The `from` and `to` properties contain the index of the item
		// when the drag started and ended, respectively
		console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
	  
		// Finish the reorder and position the item in the DOM based on
		// where the gesture ended. This method can also be called directly
		// by the reorder group
		// move columns
		let newColumns = [...columns];
		newColumns = move(newColumns, event.detail.from-1, event.detail.to-1);
		console.log('newColumns', newColumns)
		event.detail.complete();
		setColumns(newColumns);
	  }
	const updateColumn = async (column: any) => {
		console.log('updateColumn', column);	
		const newColumns = [...columns];
		// const column_name = column.column_name;
		// find the index of the column
		newColumns[columnIndex] = column;
		console.log('newColumns', newColumns);
		setColumns(newColumns);
	}
	const addColumn = async () => {
		const newColumn: any = supabaseDataService.newColumn();
		newColumn.table_name = table;
		newColumn.column_name = "";
		newColumn.ordinal_position = columns.length + 1;
		newColumn.data_type = ""; 
		newColumn.is_nullable = "YES"; 
		const newColumns = [...columns];
		newColumns.push(newColumn);
		setIsNewColumn(true);
		setColumns(newColumns);
		setColumnIndex(newColumns.length - 1);
		setColumn(newColumns[newColumns.length - 1]);
		setShowColumnModal({ isOpen: true })	
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref="/database-tables" />
					</IonButtons>
					<IonTitle>
						{ (isNewTable) ? 'New Table' : `${table_schema}.${table_name}` }
					</IonTitle>
					{ (isNewTable || modifyTableStatement) &&
                    	<IonButtons slot="end">
							<IonButton color="primary" onClick={save}>
								<IonIcon size="large" icon={checkmark}></IonIcon>
							</IonButton>
						</IonButtons>
					}
				</IonToolbar>
			</IonHeader>

			<IonContent>
			{ (true || isNewTable) &&
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
						<IonCol>
						Description:{' '}
						<IonInput
							value={description}
							placeholder="Table description"
							debounce={750}
							onIonChange={(e) => setDescription(e.detail.value!)}
							type='text'
							style={{ border: '1px solid', paddingLeft: '5px' }}
						/>
						</IonCol>
					</IonRow>
				</IonGrid>
			}
			{ !(isNewTable) &&
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

			{ ((mode === 'schema') || (isNewTable)) &&
				<>
				{/* <TableGrid rows={columns} rowClick={clickSchema} setRows={setColumns} /> */}
				<IonList lines='full'>
				<IonReorderGroup disabled={!isNewTable} onIonItemReorder={doReorder}>
				<IonItem color="light">
					<IonReorder slot="start" style={{color: 'transparent'}} />
					<IonGrid>
						<IonRow>							
							<IonCol className='noBorder'>
								Name
							</IonCol>
							<IonCol className='noBorder'>
								Type
							</IonCol>
							<IonCol className='noBorder'>
								Default
							</IonCol>
							<IonCol className='noBorder'>
								Description
							</IonCol>
						</IonRow>
					</IonGrid>
    			</IonItem>
					{ columns.map((column: any, index: number) => (
						<IonItem onClick={() => clickColumn(column, index)}>
							<IonReorder slot="start" />
							<IonGrid>
								<IonRow>
								<IonCol className='noBorder'>
									 	{column.column_name}
									</IonCol>
									<IonCol className='noBorder'>
										{column.data_type}
									</IonCol>
									<IonCol className='noBorder'>
										{column.column_default}
									</IonCol>
									<IonCol className='noBorder'>
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
								<IonCol className='noBorder'>
									add column
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonItem>

				</IonReorderGroup>
				</IonList>

				{ (!isNewTable) && 	

					<>
					{ modifyTableStatement && 
						<>
						<div className="ion-padding" style={{marginTop:'20px', marginLeft:'20px', width: '50%', border: '1px solid'}}>
						<IonLabel><b>To modify this table:</b></IonLabel>
						</div>
						<pre className="ion-padding">{modifyTableStatement}</pre>
						</>
					}
					<div className="ion-padding" style={{marginTop:'20px', marginLeft:'20px', width: '50%', border: '1px solid'}}>
						<IonLabel><b>To recreate this table:</b></IonLabel>
					</div>
					</>
 				}

				<pre className="ion-padding">{createTableStatement}
				{indexes && indexes.length > 0 &&
					indexes.map((index: any, indexNumber: number) => {
						return ('\n' + index["indexdef^"] + ';');
					})
				}</pre>
				{/* {columns.map((column: any, index: number) => (
					<div>{column.column_name} - {index}</div>
				))} */}

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
				schema={schema}
				column={column}
				table={table}
				isNewTable={(isNewTable)}
				updateColumn={updateColumn}
				dropColumn={dropColumn}
				showModal={showColumnModal}
				isNewColumn={isNewColumn}
				setShowModal={setShowColumnModal} />

				{/* <pre>{JSON.stringify(columns,null,2)}</pre> */}

			</IonContent>
		</IonPage>
	)
}

export default DatabaseTable
