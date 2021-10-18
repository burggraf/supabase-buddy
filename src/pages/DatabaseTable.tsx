import {
    IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonRow,
	IonSegment,
	IonSegmentButton,
	IonTitle,
	IonToolbar,
	useIonToast,
} from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { debounce } from 'ts-debounce'
import ColumnType from '../components/ColumnType'
import { SupabaseDataService } from '../services/supabase.data.service'
import { UtilsService } from '../services/utils.service'
import './DatabaseTable.css'
const utilsService = new UtilsService()

const DatabaseTable: React.FC = () => {
    const history = useHistory();
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const [name, setName] = useState(table_name === 'NEW-TABLE' ? '' : table_name)
	const [columns, setColumns] = useState<any[]>([])
	const [rows, setRows] = useState<any[]>([])
	const [indexes, setIndexes] = useState<any[]>([])
	const [grants, setGrants] = useState<any[]>([])
	const [policies, setPolicies] = useState<any[]>([])
	const [ mode, setMode ] = useState<'schema' | 'data' | 'tls' | 'rls' | 'indexes'>('schema')
	const supabaseDataService = new SupabaseDataService()
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
			loadData();
			loadIndexes();
			loadGrants();
			loadPolicies();	
		}
	}, [])
	const save = async () => {
		toast('not implemented yet', 'danger');
	}
	const updateColumnType = (index: any, e: any) => {
		let newColumnsArray = [...columns]; // copying the old array
		newColumnsArray[index].data_type = e;
		setColumns(newColumnsArray);	
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
							onIonChange={debounce((e) => setName(e.detail.value!), 750)}
							type='text'
							style={{ border: '1px solid' }}
						/>
						</IonCol>
					</IonRow>
				</IonGrid>
			}
			{ !(table_schema === 'public' && table_name === 'NEW-TABLE') &&
				<IonSegment value={mode} onIonChange={e => {
					if (e.detail.value === 'data' || 
						e.detail.value === 'schema' ||
						e.detail.value === 'tls' ||
						e.detail.value === 'rls' ||
						e.detail.value === 'indexes') {
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
				</IonSegment>
			}

			{ ((mode === 'schema') || (table_schema === 'public' && table_name === 'NEW-TABLE')) &&
				<IonGrid>
				<IonRow className="header">
					<IonCol>Name</IonCol>
					<IonCol>Type</IonCol>
					<IonCol>Default</IonCol>
					<IonCol>Key</IonCol>
					<IonCol>Null</IonCol>
				</IonRow>
				{columns.map((column: any, index) => {
					return (
						<IonRow key={utilsService.randomKey()}>

							<IonCol className="breakItUp" onClick={() => history.push(`/database-column/${table_schema}/${table_name}/${column.column_name}`)}>{column.column_name}</IonCol>
							<IonCol className="breakItUp">
								<ColumnType 
									stateVariable={column.data_type} 									
									stateFunction={ (e: any) => {updateColumnType(index, e)} } 
									initialValue={column.data_type}
								/>
							</IonCol>
							<IonCol className="breakItUp">{column.column_default}</IonCol>
							<IonCol className="breakItUp">???</IonCol>
							<IonCol className="breakItUp">{column.is_nullable}</IonCol>
						</IonRow>
					)
				})}
			</IonGrid>
			} 
			{ mode === 'data' && rows?.length > 0 &&
				<IonGrid>
					<IonRow key="header.row" className="header">
						{Object.keys(rows[0]).map((key, index) => {
							return (
									<IonCol className="breakItUp" key={utilsService.randomKey()}>{key}</IonCol>
							)
						})}
					</IonRow>
					{rows.map((row: any) => {
						return (
							<IonRow key={utilsService.randomKey()}>
								{Object.keys(row).map((key, index) => {
									if (typeof row[key] === 'object') {
										return (
											<IonCol className="breakItUp" key={utilsService.randomKey()}>{JSON.stringify(row[key])}</IonCol>
										)	
									} else {
										return (
											<IonCol className="breakItUp" key={utilsService.randomKey()}>{row[key]}</IonCol>
										)	
									}
								})}
							</IonRow>
						)
					})}
				</IonGrid>
			}
			{ mode === 'tls' &&
				<IonGrid>
				<IonRow className="header">
					{Object.keys(grants[0]).map((key, index) => {
						return (
								<IonCol className="breakItUp" key={utilsService.randomKey()}>{key}</IonCol>
						)
					})}
				</IonRow>
				{grants.map((grant: any) => {
					return (
						<IonRow key={utilsService.randomKey()}>
							{Object.keys(grant).map((key, index) => {
								return (
									<IonCol className="breakItUp" key={utilsService.randomKey()}>{grant[key]}</IonCol>
								)
							})}
						</IonRow>
					)
				})}
			</IonGrid>
		}
			{ mode === 'rls' && policies?.length > 0 &&
				<IonGrid>
				<IonRow className="header">
					{Object.keys(policies[0]).map((key, index) => {
						return (
								<IonCol className="breakItUp" key={utilsService.randomKey()}>{key}</IonCol>
						)
					})}
				</IonRow>
				{policies.map((policy: any) => {
					return (
						<IonRow key={utilsService.randomKey()}>
							{Object.keys(policy).map((key, index) => {
								return (
									<IonCol className="breakItUp" key={utilsService.randomKey()}>{policy[key]}</IonCol>
								)
							})}
						</IonRow>
					)
				})}
			</IonGrid>
			}
			{ mode === 'indexes' && indexes?.length > 0 &&
				<IonGrid>
					<IonRow key={utilsService.randomKey()} className="header">
						{Object.keys(indexes[0]).map((key, index) => {
							return (
									<IonCol className="breakItUp" key={utilsService.randomKey()}>{key}</IonCol>
							)
						})}
					</IonRow>
					{indexes.map((idx: any) => {
						return (
							<IonRow key={utilsService.randomKey()}>
								{Object.keys(idx).map((key, index) => {
									return (
										<IonCol className="breakItUp" key={utilsService.randomKey()}>{idx[key]}</IonCol>
									)
								})}
							</IonRow>
						)
					})}
				</IonGrid>
			}
			</IonContent>
		</IonPage>
	)
}

export default DatabaseTable
