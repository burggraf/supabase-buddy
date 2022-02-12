import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonNote, IonTitle, IonToolbar } from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import { useState } from 'react'

import './ItemPickerAccordion.css'

interface OptionChild {
    value: string;
    text: string;
    description?: string;
}
interface Option {
	value: string
	text: string
    children: OptionChild[]
}
interface ContainerProps {
	stateVariable: string //object
	stateFunction: Function
	initialValue: string
	options: Option[]
	title: string
}

const ItemPickerAccordion: React.FC<ContainerProps> = ({
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
			console.log('calling stateFunction with', e, typeof e)
			stateFunction(e)
		}, 1000)
	}
    console.log('ItemPickerAccordion', options)
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
                <IonAccordionGroup>
                    {options.map((option) => {
                        return (
                        <IonAccordion value={option.value}>
                            <IonItem slot="header" color="medium">
                                <IonLabel>{option.text}</IonLabel>
                            </IonItem>
                            <IonList slot="content">
                                {option.children.map((child) => {
                                    return (
                                    <IonItem lines='full' className={initialValue === child.value ? 'chosenItem' : 'unchosenItem'} 
                                        onClick={() => chooseValue(child.value)}>
                                        <IonLabel slot="start">{child.text}</IonLabel>
                                        { child.description &&
                                            <IonLabel slot="end">{child.description!}</IonLabel>
                                        }
                                    </IonItem>   
                                    )                     
                                })}
                            </IonList>
                        </IonAccordion>
                        )
                    })}
                </IonAccordionGroup>
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

export default ItemPickerAccordion
