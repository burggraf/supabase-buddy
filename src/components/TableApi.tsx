import { IonCol, IonGrid, IonLabel, IonRow, IonSegment, IonSegmentButton } from '@ionic/react'
import { useState } from 'react'

import { Column } from '../../models/Column'
import CodeBlock from './CodeBlock'
import ItemMultiPicker from './ItemMultiPicker'

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
	// const table_name = columns[0].table_name
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
            { getTextHere(operation, columns, optArr, darkMode) }

			{/* <SyntaxHighlighter 
                wrapLongLines={true}
                language='javascript' 
                style={darkMode ? dark : light}>
			{ getTextHere(operation, columns, optArr) }
			</SyntaxHighlighter> */}
		</>
	)
}
const getTextHere = (operation: 'select' | 'insert' | 'update' | 'delete' | 'subscribe', 
    columns: Column[], optArr: Option[], darkMode: boolean) => {
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
                console.log('c', c);
                if (c.numeric_scale !== null)
                    return `${c.column_name}: ${c.data_type.replace(/ /g, '_')}Value`
                else return `${c.column_name}: '${c.data_type.replace(/ /g, '_')}Value'`
            })
            .join(',\n\t\t')
    

        switch (operation) {
            case 'select':
                return (
                    <>
                    <CodeBlock code={`
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .select('${computedColumnsList}')
                    `} darkMode={darkMode}/>
                    <CodeBlock code={`
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .select(\`
                            some_column,
                            other_table (
                                foreign_key
                            )
                                \`)
                    `} darkMode={darkMode}/>
                    <CodeBlock code={`
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .select('${computedColumnsList}')
                            .range(0, 9)
                    `} darkMode={darkMode}/>
                    <CodeBlock code={`
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
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
                    `} darkMode={darkMode}/>
                     </>
                    )
                    break;
            case 'insert':
                return (
                    <>
                    <CodeBlock code={`
                        // INSERT A ROW
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .insert([
                                {                      
                                    \t${insertColumnList}
                                },
                            ])
                    `} darkMode={darkMode}/>
                    <CodeBlock code={`
                        // INSERT MANY ROWS
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .insert([
                                {                      
                                    \t${insertColumnList}
                                },
                                {                      
                                    \t${insertColumnList}
                                },
                                {                      
                                    \t${insertColumnList}
                                },
                            ])
                     `} darkMode={darkMode}/>
                    <CodeBlock code={`
                        // UPSERT MATCHING ROWS
                        let { data: ${table_name}_data, error: ${table_name}_error } = 
                            await supabase
                            .from('${table_name}')
                            .insert([
                                {                      
                                    \t${insertColumnList}
                                },
                            ], { upsert: true })

                    `} darkMode={darkMode}/>
                    </>
                )
                break;
            case 'update':
                return (
                    <>
                    <CodeBlock code={`
                        // UPDATE MATCHING ROWS
                        const { data, error } = 
                            await supabase
                            .from('${table_name}')
                            .update(
                                {                      
                                    \t${insertColumnList}
                                }                                
                            )
                            .eq('some_column', 'someValue')
                    `} darkMode={darkMode}/>
                    </>
                )
                break;
            case 'delete':
                return (
                    <>
                    <CodeBlock code={`
                        // DELETE MATCHING ROWS
                        const { data, error } = 
                            await supabase
                            .from('${table_name}')
                            .delete()
                            .eq('some_column', 'someValue')
                    `} darkMode={darkMode}/>
                    </>
                )
                break;
            case 'subscribe':
                return (
                    <>
                    <CodeBlock code={`
                    // coming soon
                    `} darkMode={darkMode}/>
                    </>
                )
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