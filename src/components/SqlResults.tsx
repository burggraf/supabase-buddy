import { IonCol, IonGrid, IonLabel, IonRow } from '@ionic/react'
import { useState } from 'react'

import { UtilsService } from '../services/utils.service'
import DisplayDetail from './DisplayDetail'

import './SqlResults.css'

const utilsService = new UtilsService()
interface ContainerProps {
	results: any[]
}

const SqlResults: React.FC<ContainerProps> = ({ results }) => {
	const [record, setRecord] = useState({})
    const [resultSet, setResultSet] = useState(0)
	const [detailTrigger, setDetailTrigger] = useState({ action: '' })
	const [currentIndex, setCurrentIndex] = useState(1)

	const outputArray = []
    const resultSetArray: any[] = []
	for (let i = 0; i < results.length; i++) {
		const result = results[i]
		let resultJson
		try {
			resultJson = JSON.parse(result)
		} catch (err) {
			// console.error(`could not parse result #${i+1}`, result);
			resultJson = result
		}
		// test if resultJson is an array
		if (resultJson && Array.isArray(resultJson)) {  
            resultSetArray.push(resultJson)
            if (resultJson.length > 0) {
				// get keys and values of first element
				const keys = Object.keys(resultJson[0])
				outputArray.push(
					<div key={utilsService.randomKey()}>
						<IonLabel key={utilsService.randomKey()} className='resultHeader'>
							<strong>Result #{i + 1}</strong>
						</IonLabel>
						<IonGrid key={utilsService.randomKey()}>
							<IonRow key={utilsService.randomKey()}>
								{keys.map((key, index) => (
									<IonCol className='breakItUp' key={utilsService.randomKey()}>
										<strong>{key}</strong>
									</IonCol>
								))}
							</IonRow>
							{resultJson.map((row, index) => (
								<IonRow
									key={utilsService.randomKey()}
									onClick={() => {
										console.log('onclick fired')
                                        setResultSet(i)
                                        setCurrentIndex(index+1)
										setRecord(row)
										setDetailTrigger({ action: 'open' })
									}}>
									{keys.map((key, index) => {
										if (!Array.isArray(row[key])) {
											return (
												<IonCol className='breakItUp boxed' key={utilsService.randomKey()}>
													{row[key]}
												</IonCol>
											)
										} else {
											return (
												<IonCol className='breakItUp boxed' key={utilsService.randomKey()}>
													{JSON.stringify(row[key])}
												</IonCol>
											)
										}
									})}
								</IonRow>
							))}
						</IonGrid>
					</div>
				)
				// resultJson[0]
			}
		} else {
			outputArray.push(
				<IonGrid key={utilsService.randomKey()}>
					<IonRow className='resultHeader' key={utilsService.randomKey()}>
						<IonCol key={utilsService.randomKey()}>
							<strong>Result #{i + 1}</strong>
						</IonCol>
					</IonRow>
					<IonRow key={utilsService.randomKey()}>
						<IonCol key={utilsService.randomKey()}>
							<IonLabel
								key={utilsService.randomKey()}
								className='error'
								color={parseInt(resultJson) === resultJson ? 'dark' : 'danger'}>
								{resultJson}
							</IonLabel>
						</IonCol>
					</IonRow>
				</IonGrid>
			)
		}
	}
	return <>{outputArray}
			<DisplayDetail 
				rec={record} 
				trigger={detailTrigger}  
				current={currentIndex} 
				total={resultSetArray[resultSet] ? resultSetArray[resultSet].length : null}
				onBack={()=>{		
					const newIndex = currentIndex - 1;
					setCurrentIndex(newIndex);
					setRecord(resultSetArray[resultSet][newIndex-1]);
				}}
				onForward={()=>{
					const newIndex = currentIndex + 1;
					setCurrentIndex(newIndex);
					setRecord(resultSetArray[resultSet][newIndex-1]);					
				}}
			/>
    </>
}

export default SqlResults
