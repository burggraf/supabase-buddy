import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonMenuButton, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonModal, useIonToast } from '@ionic/react'
import { arrowBackOutline, arrowForwardOutline, checkmark, checkmarkOutline, closeOutline, createOutline, keyOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import DisplayDetail from '../components/DisplayDetail'
import ItemPicker from '../components/ItemPicker'
import TableApi from '../components/TableApi'
import TableGrid from '../components/TableGrid'
import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'

import './DatabaseTable.css'

const utilsService = new UtilsService()
const supabaseDataService = new SupabaseDataService()

const columnOptions = [
	{ value: "text", text: "text - variable unlimited length text" },
	{ value: "numeric", text: "numeric - any numeric entry" },
	{ value: "int2", text: "int2 - signed two-byte integer" },
	{ value: "int4", text: "int4 - signed four-byte integer" },
	{ value: "int8", text: "int8 - signed eight-byte integer" },
	{ value: "float4", text: "float4 - single precision floating point number 4-bytes" },
	{ value: "float8", text: "float8 - double precision floating point number 8-bytes" },
	{ value: "json", text: "json - textual JSON data" },
	{ value: "jsonb", text: "jsonb - binary JSON data, decomposed" },
	{ value: "varchar", text: "varchar - variable length character string" },
	{ value: "uuid", text: "uuid - universally unique identifier" },
	{ value: "date", text: "date - calendar date (year, month, day)" },
	{ value: "time", text: "time - time of day (no time zone)" },
	{ value: "timetz", text: "timetz - time of day (including time zone)" },
	{ value: "timestamp", text: "timestamp - date and time (no time zone)" },
	{ value: "timestamptz", text: "timestamptz - date and time (including time zone)" },
	{ value: "bool", text: "bool - logical boolean (true/false)" }, 
  ];
const DatabaseTable: React.FC = () => {
    const history = useHistory();
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const [name, setName] = useState(table_name === 'NEW-TABLE' ? '' : table_name)
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

	const loadColumns = async () => {
		const { data, error } = await supabaseDataService.getColumns(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setColumns(data!)
		}
	}	
	const loadData = async () => {
		const { data, error } = await supabaseDataService.getTableRows(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
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
		if (table_schema === 'public' && table_name === 'NEW-TABLE') {
			const newColumns = [
				{
					character_maximum_length: null,
					character_octet_length: null,
					character_set_catalog: null,
					character_set_name: null,
					character_set_schema: null,
					collation_catalog: null,
					collation_name: null,
					collation_schema: null,
					column_default: "uuid_generate_v4()",
					column_name: "id",
					data_type: "uuid",
					datetime_precision: null,
					domain_catalog: null,
					domain_name: null,
					domain_schema: null,
					dtd_identifier: "1",
					generation_expression: null,
					identity_cycle: "NO",
					identity_generation: null,
					identity_increment: null,
					identity_maximum: null,
					identity_minimum: null,
					identity_start: null,
					interval_precision: null,
					interval_type: null,
					is_generated: "NEVER",
					is_identity: "NO",
					is_nullable: "NO",
					is_self_referencing: "NO",
					is_updatable: "YES",
					maximum_cardinality: null,
					numeric_precision: null,
					numeric_precision_radix: null,
					numeric_scale: null,
					ordinal_position: "1",
					scope_catalog: null,
					scope_name: null,
					scope_schema: null,
					table_catalog: "postgres",
					table_name: "snippets",
					table_schema: "public",
					udt_catalog: "postgres",
					udt_name: "uuid",
					udt_schema: "pg_catalog"
					 }
			];
			setColumns(newColumns);
		} else {
			loadColumns();
			loadPrimaryKeys();
			loadData();
			loadIndexes();
			loadGrants();
			loadPolicies();	
		}
	}, [])
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
	const updateColumnType = (index: any, e: any) => {
		let newColumnsArray = [...columns]; // copying the old array
		newColumnsArray[index].data_type = e;
		setColumns(newColumnsArray);	
	}
	const clickSchema = (row: any, index: number) => {
		history.push(`/database-column/${table_schema}/${table_name}/${row.column_name}`);
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
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonBackButton defaultHref="/database-tables" />
					</IonButtons>
					<IonTitle>
						{table_schema}.{table_name}
					</IonTitle>
					{ table_name === 'NEW-TABLE' &&
                    	<IonButtons slot="end">
							<IonButton color="primary" onClick={save}>
								<IonIcon size="large" icon={checkmark}></IonIcon>
							</IonButton>
						</IonButtons>
					}
				</IonToolbar>
			</IonHeader>

			<IonContent>
			{ (table_schema === 'public' && table_name === 'NEW-TABLE') &&
				<IonGrid>
					<IonRow key="name-header" className="header">
						<IonCol>
						Table Name:{' '}
						<IonInput
							value={name}
							placeholder="Enter table name"
							debounce={750}
							onIonChange={(e) => setName(e.detail.value!)}
							type='text'
							style={{ border: '1px solid' }}
						/>
						</IonCol>
					</IonRow>
				</IonGrid>
			}
			{ !(table_schema === 'public' && table_name === 'NEW-TABLE') &&
				<IonSegment mode="ios" scrollable={true} value={mode} onIonChange={e => {
					if (e.detail.value === 'data' || 
						e.detail.value === 'schema' ||
						e.detail.value === 'tls' ||
						e.detail.value === 'rls' ||
						e.detail.value === 'indexes' || 
						e.detail.value === 'api') {
						if (e.detail.value === 'data') { 
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

			{ ((mode === 'schema') || (table_schema === 'public' && table_name === 'NEW-TABLE')) &&

				<TableGrid rows={columns} rowClick={clickSchema}/>

			} 
			{ mode === 'data' && rows?.length > 0 &&
				<div style={{ height: '100%', overflow: 'scroll'}}>
				<table style={{'width': gridWidth + 'px'}} key={utilsService.randomKey()}>
				<tbody>
				<tr key={utilsService.randomKey()}>
					{keys.map((key, index) => (
						<td style={{'width': columnWidths[index] + 'px'}} className='breakItUp' key={utilsService.randomKey()}>
							<strong>{key}</strong>
						</td>
					))}
				</tr>
				{rows.map((row, index) => (
					<tr
						key={utilsService.randomKey()}
						onClick={()=>{setDetailCollection(rows);setCurrentIndex(index + 1);setRecord(row);setDetailTrigger({action:'open'})}}
					>
						{keys.map((key, index) => {
							// if (!Array.isArray(row[key])) {
							if (typeof row[key] !== 'object') {
								return (
									<td style={{'width': columnWidths[index] + 'px'}} className='breakItUp boxed' key={utilsService.randomKey()}>
										{row[key]}
									</td>
								)
							} else {
								return (
									<td style={{'width': columnWidths[index] + 'px'}} className='breakItUp boxed' key={utilsService.randomKey()}>
										{JSON.stringify(row[key])}
									</td>
								)
							}
						})}
					</tr>
				))}
				</tbody>
				</table>
				</div>

			}
			{ mode === 'tls' &&
			
				<TableGrid rows={grants} rowClick={clickTLS}/>

			}
			{ mode === 'rls' && policies?.length > 0 &&

				<TableGrid rows={policies} rowClick={clickRLS}/>

			}
			{ mode === 'indexes' && indexes?.length > 0 &&
				<TableGrid rows={indexes} rowClick={clickIndex}/>
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
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTable
