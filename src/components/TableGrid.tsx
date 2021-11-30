import { Sort } from '../models/Sort'
import { UtilsService } from '../services/utils.service'
import TableColumnSort from './TableColumnSort'
import './TableGrid.css'

interface ContainerProps {
	rows: any[];
    rowClick: Function;
	sort?: Sort;
	changeSortCallback?: Function;
	sortableColumns?: string[];
}

const utilsService = new UtilsService()

const TableGrid: React.FC<ContainerProps> = ({ rows, rowClick, sort, changeSortCallback, sortableColumns }) => {
	const keys = Object.keys(rows[0] || [])
	const { gridWidth, columnWidths } = utilsService.getGridWidths(rows)
	return (
		<div style={{ height: '100%', overflow: 'scroll' }}>
			<table style={{ width: gridWidth + 'px' }} key={utilsService.randomKey()}>
				<tbody>
					<tr key={utilsService.randomKey()}>
						{keys.map((keyname, index) => (
							<td
								style={{ width: columnWidths[index] + 'px' }}
								className='breakItUp'
								key={utilsService.randomKey()}>
								<strong>{keyname}</strong>
								{sort && changeSortCallback && sortableColumns && (sortableColumns?.findIndex(col => col === keyname) > -1) && 						
									<TableColumnSort sort={sort} columnName={keyname} callback={changeSortCallback}/>
								}
							</td>
						))}
					</tr>
					{rows.map((row, index) => (
						<tr key={utilsService.randomKey()} onClick={() => {rowClick(row, index)}}>
							{keys.map((key, index) => {
								// if (!Array.isArray(row[key])) {
								if (typeof row[key] !== 'object') {
									return (
										<td
											style={{ width: columnWidths[index] + 'px' }}
											className='breakItUp boxed'
											key={utilsService.randomKey()}>
											{row[key]}
										</td>
									)
								} else {
									return (
										<td
											style={{ width: columnWidths[index] + 'px' }}
											className='breakItUp boxed'
											key={utilsService.randomKey()}>
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
	)
}

export default TableGrid
