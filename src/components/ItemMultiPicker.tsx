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
	stateFunction: Function
	options: Option[]
	title: string
}

const ItemMultiPicker: React.FC<ContainerProps> = ({
	stateFunction,
	options,
	title,
}) => {
	const [showModal, setShowModal] = useState({ isOpen: false })
	const [o, setO] = useState(options)
	const chooseValue = (e: any) => {
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
											let newArr = [...o]; // copying the old datas array
											newArr[index].checked = (e.target as any).checked; // replace e.target.value with whatever you want to change it to
											setO(newArr);
											stateFunction(newArr);
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
					<br />
					<br />
					<br />
				</IonContent>
			</IonModal>
			<div style={{height: '100%', width: '100%'}} onClick={() => setShowModal({ isOpen: true })}>
			<IonLabel><b>{
				o.filter(item => item.checked).map(item => item.text).join(', ')}</b></IonLabel>
			</div>
			{/* <IonButton
				strong
				expand='block'
				color='medium'
				onClick={() => setShowModal({ isOpen: true })}>
				{'???'}
			</IonButton> */}
		</>
	)
}

export default ItemMultiPicker
