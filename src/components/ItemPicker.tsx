import {
	IonButton,
	IonModal,
	IonList,
	IonItem,
	IonLabel,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonIcon,
	IonTitle,
} from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import { useState } from 'react'
import './ItemPicker.css'

interface Option {
	value: string
	text: string
}
interface ContainerProps {
	stateVariable: object
	stateFunction: Function
	initialValue: string
	options: Option[]
	title: string
}

const ItemPicker: React.FC<ContainerProps> = ({
	stateVariable,
	stateFunction,
	initialValue,
	options,
	title,
}) => {
	const [showModal, setShowModal] = useState({ isOpen: false })
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
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						{options.map((option) => {
							return (
								<IonItem key={option.value} onClick={() => chooseValue(option.value)}>
									<IonLabel
										className={option.value === initialValue ? 'chosenLabel' : 'unchosenLabel'}>
										{option.text}
									</IonLabel>
								</IonItem>
							)
						})}
					</IonList>
					<IonButton onClick={() => setShowModal({ isOpen: false })}>{stateVariable}</IonButton>
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

export default ItemPicker
