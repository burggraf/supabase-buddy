import { IonCheckbox, IonCol, IonGrid, IonInput, IonLabel, IonRow, IonSegment, IonSegmentButton } from '@ionic/react'
import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as dark, docco, atomOneLight as light } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { atomDark, duotoneDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Column } from '../../models/Column'
import ItemMultiPicker from './ItemMultiPicker'
import ItemPicker from './ItemPicker'

import './TableApi.css'

interface Option {
	value: string
	text: string
	checked: boolean
}

interface ContainerProps {
	columns: Column[]
}

const TableApi: React.FC<ContainerProps> = ({ columns }) => {
	const table_name = columns[0].table_name
	const [darkMode, setDarkMode] = useState<boolean>(
		window.matchMedia('(prefers-color-scheme: dark)').matches
	)

	const [operation, setOperation] = useState<'select' | 'insert' | 'update' | 'delete' | 'subscribe'>('select')
	const [optArr, setOptArr] = useState<Option[]>([])
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		setDarkMode(e.matches)
	})

	const columnsArray: Option[] = []
	for (let i = 0; i < columns.length; i++) {
		columnsArray.push({
			value: columns[i].column_name,
			text: columns[i].column_name,
			checked: true,
		})
	}
    useEffect(() => {
        console.log('optArr', optArr);
        if (optArr.filter((opt) => opt.checked).length === 0) {
            console.log('nothing selected!')
        }
    }, [optArr]);

	return (
		<>
			<IonGrid class='ion-padding'>
                <IonRow>
                    <IonCol>
                        <IonLabel>Select an operation:</IonLabel><br/>
                        <IonSegment mode="ios" scrollable={true} value={operation} onIonChange={e => {
                        if (e.detail.value === 'select' || 
                            e.detail.value === 'insert' ||
                            e.detail.value === 'update' ||
                            e.detail.value === 'delete' ||
                            e.detail.value === 'subscribe') {
                            setOperation(e.detail.value)
                        }
                    }}>
                            <IonSegmentButton value="select">
                                <IonLabel>Select</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="insert">
                                <IonLabel>Insert</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="update">
                                <IonLabel>Update</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="delete">
                                <IonLabel>Delete</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="subscribe">
                                <IonLabel>Subscribe</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                    </IonCol>
                </IonRow>
				<IonRow>
					<IonCol size='12' className="ion-padding">
                        <IonLabel>Tap to select columns to include:</IonLabel><br/>
						<ItemMultiPicker
							stateFunction={(e: Option[]) => {
                                setOptArr(e)
							}}
                            willDismiss={(e: Option[]) => {
                                console.log('willDismiss from TableApi', e);
                                if (e.filter((opt) => opt.checked).length === 0) {
                                    let newArr = [...optArr]; // copying the old datas array
                                    newArr[0].checked = true;
                                    setOptArr(newArr);

                                }
                            }}
							//initialValue={operation}
							options={columnsArray}
							title='Select Columns'
						/>
					</IonCol>
				</IonRow>
			</IonGrid>

			<SyntaxHighlighter language='javascript' style={darkMode ? dark : light}>
			{ getTextHere(operation, columns, optArr) }
			</SyntaxHighlighter>
            <pre>{JSON.stringify(optArr,null,2)}</pre>
            <pre>{JSON.stringify(columns,null,2)}</pre>
		</>
	)
}
const getTextHere = (operation: 'select' | 'insert' | 'update' | 'delete' | 'subscribe', 
    columns: Column[], optArr: Option[]) => {
        const table_name = columns[0].table_name;
        const allColumnsSelected = (optArr.filter((item) => item.checked).length === optArr.length);
        const computedColumnsList = 
            allColumnsSelected ? '*' :
                optArr
                .filter((item) => item.checked)
                .map((item) => item.text)
                .join(', ');

        const insertColumnList = 
            columns
            .filter((item) => optArr.find((opt) => opt.value === item.column_name && opt.checked))
            .map((c) => {
                if (c.numeric_scale !== null)
                    return `${c.column_name}: ${c.data_type.replace(/ /g, '_')}Value`
                else return `${c.column_name}: '${c.data_type.replace(/ /g, '_')}Value'`
            })
            .join(',\n\t\t\t')
    

        switch (operation) {
            case 'select':
                return ` 
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                .from('${table_name}')
                .select('${computedColumnsList}')
    
    
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                .from('${table_name}')
                .select(\`
                some_column,
                other_table (
                    foreign_key
                )
                    \`)
    
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                .from('${table_name}')
                .select('${computedColumnsList}')
                .range(0, 9)
    
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                .from('${table_name}')
                .select("${computedColumnsList}")
                // Filters
                .eq('column', 'Equal to')
                .gt('column', 'Greater than')
                .lt('column', 'Less than')
                .gte('column', 'Greater than or equal to')
                .lte('column', 'Less than or equal to')
                .like('column', '%CaseSensitive%')
                .ilike('column', '%CaseInsensitive%')
                .is('column', null)
                .in('column', ['Array', 'Values'])
                .neq('column', 'Not equal to')
                // Arrays
                .cs('array_column', ['array', 'contains'])
                .cd('array_column', ['contained', 'by'])
                    `
            case 'insert':
                return `
                // INSERT A ROW
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                  .from('${table_name}')
                  .insert([
                    {                      
                    \t${insertColumnList}
                    },
                  ])
                // INSERT MANY ROWS
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                  .from('${table_name}')
                  .insert([
                    {                      
                    \t${insertColumnList}
                    },
                  ])
                // UPSERT MATCHING ROWS
                let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
                  .from('${table_name}')
                  .insert([
                    {                      
                    \t${insertColumnList}
                    },
                  ], { upsert: true })
                `    
                break;
            case 'update':
                return ''
                break;
            case 'delete':
                return ''
                break;
            case 'subscribe':
                return ''
                break;
        }
    }
export default TableApi

/*

            ` 
            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
            .from('${table_name}')
            .select('${computedColumnsList}')


            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
            .from('${table_name}')
            .select(\`
            some_column,
            other_table (
                foreign_key
            )
                \`)

            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
            .from('${table_name}')
            .select('${computedColumnsList}')
            .range(0, 9)

            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
            .from('${table_name}')
            .select("${computedColumnsList}")
            // Filters
            .eq('column', 'Equal to')
            .gt('column', 'Greater than')
            .lt('column', 'Less than')
            .gte('column', 'Greater than or equal to')
            .lte('column', 'Less than or equal to')
            .like('column', '%CaseSensitive%')
            .ilike('column', '%CaseInsensitive%')
            .is('column', null)
            .in('column', ['Array', 'Values'])
            .neq('column', 'Not equal to')
            // Arrays
            .cs('array_column', ['array', 'contains'])
            .cd('array_column', ['contained', 'by'])


            // INSERT A ROW
            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
              .from('${table_name}')
              .insert([
                {                      
                \t${insertColumnList}
                },
              ])
            // INSERT MANY ROWS
            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
              .from('${table_name}')
              .insert([
                { some_column: 'someValue' },
                { some_column: 'otherValue' },
              ])
            // UPSERT MATCHING ROWS
            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
              .from('${table_name}')
              .insert([{ some_column: 'someValue' }], { upsert: true })
        `


*/