import { IonButton, IonIcon } from '@ionic/react'
import { copyOutline } from 'ionicons/icons'
import CopyToClipboard from 'react-copy-to-clipboard'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
	atomOneDark as dark,
	docco,
	atomOneLight as light,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './CodeBlock.css'
import Copy from './Copy'

interface ContainerProps {
	code: string
	darkMode: boolean
    language?: string
}

const CodeBlock: React.FC<ContainerProps> = ({ code, darkMode, language='javascript' }) => {
    // remove leadind empty lines from code
    code = code.split('\n').filter(line => line.trim() !== '').join('\n')
    // get whitespace from first line of code
    const wh = code.split('\n')[0].match(/^\s*/);
    // remove wh from begining of each line
    const rx = new RegExp('^' + wh, '');
    // replace each line with wh removed
    code = code.split('\n').map(line => line.replace(rx, '')).join('\n')
    
	return (
<>
<Copy text={code} />
<SyntaxHighlighter wrapLongLines={true} language={language} style={darkMode ? dark : light}>
{code}
</SyntaxHighlighter>
</>
	)
}

export default CodeBlock
