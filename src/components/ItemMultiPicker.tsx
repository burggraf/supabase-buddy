import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { checkmarkOutline, closeOutline } from 'ionicons/icons'
import { useState } from 'react'

import './ItemMultiPicker.css'

interface Option {
	value: string
	text: string
	checked: boolean
}
interface ContainerProps {
	stateVariable: string //object
	stateFunction: Function
	initialValue: string
	options: Option[]
	title: string
}

const ItemMultiPicker: React.FC<ContainerProps> = ({
	stateVariable,
	stateFunction,
	initialValue,
	options,
	title,
}) => {
	const [showModal, setShowModal] = useState({ isOpen: false })
	const [o, setO] = useState(options)
	const chooseValue = (e: any) => {
		console.log('chooseValue', e)
		setShowModal({ isOpen: false })
		setTimeout(() => {
			stateFunction(e)
		}, 1000)
	}
	return (
		<>
			<IonModal
				isOpen={showModal.isOpen}
				animated={true}
				// onDidDismiss={() => setShowModal({ isOpen: false })}
				className='my-custom-class'>
				<IonHeader>
					<IonToolbar>
						<IonTitle>{title}</IonTitle>
						<IonButtons slot='end'>
							<IonButton color='primary' onClick={() => setShowModal({ isOpen: false })}>
								<IonIcon size='large' icon={closeOutline}></IonIcon>
							</IonButton>
							<IonButton color='primary' onClick={() => setShowModal({ isOpen: false })}>
								<IonIcon size='large' icon={checkmarkOutline}></IonIcon>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						{options.map((option, index) => {
							return (
								<IonItem key={option.value}>
									<IonCheckbox
										color='medium'
										checked={o[index].checked}
										onIonChange={(e) => {
											console.log('**************************************');
											console.log('ionChange', (e.target as any).checked);
											console.log('option', option);
											console.log('options', options); 
											console.log('o1', o); 

											let newArr = [...o]; // copying the old datas array
											console.log('newArr[index]', newArr[index]);
											newArr[index].checked = (e.target as any).checked; // replace e.target.value with whatever you want to change it to
											console.log('newArr[index]', newArr[index]);
											setO(newArr);
											console.log('o2', o); 
											console.log('newArr', newArr); 
											//option.checked = e.detail.checked;
											console.log('**************************************');
										}}
									/>&nbsp;&nbsp;
									<IonLabel
										className={o[index].checked ? 'chosenLabel' : 'unchosenLabel'}>
										{o[index].text} {o[index].checked ? '✓' : ''}										
									</IonLabel>
								</IonItem>
								
							)
						})}
					</IonList>
					<pre>
					{ JSON.stringify(o,null,2)}
					</pre>
					<br />
					<br />
					<br />
					{/* <IonButton onClick={() => setShowModal({ isOpen: false })}>{stateVariable}</IonButton> */}
				</IonContent>
			</IonModal>
			<IonButton
				strong
				expand='block'
				color='medium'
				onClick={() => setShowModal({ isOpen: true })}>
				{stateVariable}
			</IonButton>
		</>
	)
}

export default ItemMultiPicker
