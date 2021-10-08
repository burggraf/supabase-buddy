import {
    IonBackButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonRow,
	IonSegment,
	IonSegmentButton,
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
	const [rows, setRows] = useState<any[]>([])
	const [indexes, setIndexes] = useState<any[]>([])
	const [grants, setGrants] = useState<any[]>([])
	const [ mode, setMode ] = useState<'schema' | 'data' | 'tls' | 'rls' | 'indexes'>('schema')
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
            console.log('loadColumns', data);
		}
	}
	const loadData = async () => {
        console.log('loadData');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
		const { data, error } = await supabaseDataService.getTableRows(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setRows(data!)
            console.log('loadData', data);
		}
	}
	const loadIndexes = async () => {
        console.log('loadIndexes');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
		const { data, error } = await supabaseDataService.getIndexes(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setIndexes(data!)
            console.log('loadIndexxes', data);
		}
	}
	const loadGrants = async () => {
        console.log('loadGrants');
        console.log('table_schema', table_schema);
        console.log('table_name', table_name);
		const { data, error } = await supabaseDataService.getGrants(table_schema, table_name)
		if (error) {
			console.error(error)
		} else {
			setGrants(data!)
            console.log('loadGrants', data);
		}
	}
	useEffect(() => {
		loadColumns();
		loadData();
		loadIndexes();
		loadGrants();
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
			{ mode === 'schema' &&
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
			} 
			{ mode === 'data' && rows?.length > 0 &&
				<IonGrid>
					<IonRow className="header">
						{Object.keys(rows[0]).map((key, index) => {
							return (
									<IonCol key={key}>{key}</IonCol>
							)
						})}
					</IonRow>
					{rows.map((row: any) => {
						return (
							<IonRow key={row.id}>
								{Object.keys(row).map((key, index) => {
									return (
										<IonCol key={key}>{row[key]}</IonCol>
									)
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
								<IonCol key={key}>{key}</IonCol>
						)
					})}
				</IonRow>
				{grants.map((grant: any) => {
					return (
						<IonRow key={grant.id}>
							{Object.keys(grant).map((key, index) => {
								return (
									<IonCol key={key}>{grant[key]}</IonCol>
								)
							})}
						</IonRow>
					)
				})}
			</IonGrid>
		}
			{ mode === 'rls' &&
				<IonGrid>
					<IonRow className="header">
						<IonCol>SHOW RLS</IonCol>
					</IonRow>
				</IonGrid>
			}
			{ mode === 'indexes' && indexes?.length > 0 &&
				<IonGrid>
					<IonRow className="header">
						{Object.keys(indexes[0]).map((key, index) => {
							return (
									<IonCol key={key}>{key}</IonCol>
							)
						})}
					</IonRow>
					{indexes.map((idx: any) => {
						return (
							<IonRow key={idx.id}>
								{Object.keys(idx).map((key, index) => {
									return (
										<IonCol key={key}>{idx[key]}</IonCol>
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
