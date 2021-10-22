import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as dark, docco, atomOneLight as light } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomDark, duotoneDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Column } from '../../models/Column'

import './TableApi.css'

interface ContainerProps {
	columns: Column[]
}

const TableApi: React.FC<ContainerProps> = ({ columns }) => {
    const table_name = columns[0].table_name;
	const [darkMode, setDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches)
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		setDarkMode(e.matches)
	});

    return (
        
		<>
    <SyntaxHighlighter language="javascript" style={darkMode ? dark : light}>
        {` 
            let { data: ${table_name}_data, error: ${table_name}_error } = await supabase
            .from('${table_name}')
            .select('*')
        `}
    </SyntaxHighlighter>
		</>
	)
}

export default TableApi
