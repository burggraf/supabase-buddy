import { IonCheckbox, IonCol, IonGrid, IonInput, IonLabel, IonRow } from '@ionic/react'
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
	const [statementType, setStatementType] = useState<string>('select')
    const [computedColumnsList, setComputedColumnsList] = useState<string>('')
    const [optArr, setOptArr] = useState<Option[]>([])
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		setDarkMode(e.matches)
	})

    useEffect(() => {
        if (optArr.filter(item => item.checked).length === optArr.length) {
            setComputedColumnsList('*')
        } else {
            setComputedColumnsList(optArr.filter(item => item.checked).map(item => item.text).join(', '))
        }
    },[optArr])

    const insertColumnList = columns.map((c) => { 
        if (c.numeric_scale !== null)
            return `${c.column_name}: ${c.data_type.replace(/ /g,'_')}Value`
        else
            return `${c.column_name}: '${c.data_type.replace(/ /g,'_')}Value'`
    }).join(',\n\t\t\t')
    const columnsArray = []
    for (let i = 0; i < columns.length; i++) {
        columnsArray.push({
            value: columns[i].column_name,
            text: columns[i].column_name,
            checked: true
        })
    }

	return (
		<>
			<IonGrid class='ion-padding'>
				<IonRow>
					<IonCol size='2'>Operation</IonCol>
					<IonCol size='10'>Columns</IonCol>
				</IonRow>
				<IonRow>
					<IonCol size='2'>
						<ItemPicker
							stateVariable={statementType}
							stateFunction={(e: any) => {
								setStatementType(e)
							}}
							initialValue={statementType}
							options={[
								{ value: 'select', text: 'Select' },
								{ value: 'insert', text: 'Insert' },
								{ value: 'update', text: 'Update' },
								{ value: 'delete', text: 'Delete' },
								{ value: 'subscribe', text: 'Subscribe / Realtime' },
							]}
							title='Statement Type'
						/>
					</IonCol>
					<IonCol size='10'>
                        <ItemMultiPicker
                            stateFunction={(e: any) => {
                                setOptArr(e);
                            }}
                            //initialValue={statementType}
                            options={columnsArray}
                            title='Select Columns'
                        />
					</IonCol>
				</IonRow>
			</IonGrid>

			<SyntaxHighlighter language='javascript' style={darkMode ? dark : light}>
				{` 
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


        `}
			</SyntaxHighlighter>
		</>
	)
}

export default TableApi
