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
const utilsService = new UtilsService()

const DatabaseColumn: React.FC = () => {
	const { table_schema } = useParams<{ table_schema: string }>()
	const { table_name } = useParams<{ table_name: string }>()
	const { column_name } = useParams<{ column_name: string }>()
    const [attributes, setAttributes] = useState<any>({})

	const supabaseDataService = new SupabaseDataService()
	const loadColumn = async () => {
		const { data, error } = await supabaseDataService.getColumn(table_schema, table_name, column_name)
		if (error) {
			console.error(error)
		} else {
			setAttributes(data![0])
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

			<IonContent>
				<IonGrid>
					<IonRow key={utilsService.randomKey()}>
                        <IonCol size="2"><b>Attribute</b></IonCol>
                        <IonCol size="10"><b>Value</b></IonCol>
                    </IonRow>
                    {Object.keys(attributes).map((key, index) => {
                        return (
                            <IonRow key={utilsService.randomKey()}>
                                <IonCol size="2">{key}</IonCol>
                                <IonCol size="10">{attributes[key]}</IonCol>
                            </IonRow>
                        )
                    })}
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default DatabaseColumn
