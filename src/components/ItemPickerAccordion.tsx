import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonNote, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { checkboxOutline, checkmarkOutline, closeOutline } from 'ionicons/icons'
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
    openAccordion?: string
	stateVariable: string //object
	stateFunction: Function
	initialValue: string
	options: Option[]
	title: string
    allowManualInput?: boolean
    manualInputTitle?: string
}

const ItemPickerAccordion: React.FC<ContainerProps> = ({
    openAccordion,
	stateVariable,
	stateFunction,
	initialValue,
	options,
	title,
    allowManualInput,
    manualInputTitle
}) => {
    if (!openAccordion) {
        options.map((option) => {
            option.children.map((child) => {
                if (child.value === initialValue) {
                    openAccordion = option.value
                }
            });
        })
    }
	const [showModal, setShowModal] = useState({ isOpen: false })
    const [manualInput, setManualInput] = useState('')
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
                <IonAccordionGroup value={openAccordion}>
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
	
                    { allowManualInput &&
                        <IonItem>
                            <IonLabel slot='start'>{manualInputTitle || 'Other:'}</IonLabel>
                            <IonInput type='text'
                                     value={manualInput}
                                     style={{border: '1px solid',paddingLeft:'5px'}}
                                     onIonChange={(e) => {setManualInput(e.detail.value! || '')}}></IonInput>
                            <IonButtons slot='end'>
                                <IonButton fill='clear' color='medium' onClick={() => {chooseValue(manualInput)}}>
                                    <IonIcon size='large' icon={checkmarkOutline}></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonItem>
                }

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
