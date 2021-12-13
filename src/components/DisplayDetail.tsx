import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonPage, IonRow, IonTitle, IonToolbar, useIonModal } from '@ionic/react'
import { arrowBackOutline, arrowForwardOutline, checkmarkOutline, closeOutline, createOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'

import { UtilsService } from '../services/utils.service'

import './DisplayDetail.css'

const utilsService = new UtilsService()
interface Trigger {
	action: string
}
interface ContainerProps {
	rec: any
	trigger: Trigger
	current?: number | null
	total?: number | null
    onBack?: Function | null
    onForward?: Function | null
    title?: string | null
    onSave? : Function | null
}

const DisplayDetail: React.FC<ContainerProps> = ({ rec, trigger, current, total, onBack, onForward, title, onSave }) => {
	const [record, setRecord] = useState<any>({})
	const [editMode, setEditMode] = useState({ editMode: false })

	useEffect(() => {
		setRecord(rec)
	}, [rec])

	useEffect(() => {
		console.log('action: ' + trigger.action)
		if (trigger.action === 'open') {
			presentDetail({
                onDidDismiss: () => { setEditMode({editMode: false}); }
            })
		} else if (trigger.action === 'close') {
            setEditMode({ editMode: false })
			dismissDetail()
		}
	}, [trigger])

	// useEffect(() => {
	// 	console.log('useEffect inside DisplayDetail...')
	// }, [])

	const DetailBody: React.FC<{
		record: any
	}> = ({ record }) => {
		// create a copy of the record
		const recordCopy = { ...record }
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>
							{title || 'Record Details'} <b>{editMode.editMode ? '**' : ''}</b>
						</IonTitle>
						<IonButtons slot='end'>
                            { onSave && !editMode.editMode &&
    							<IonButton color='primary' onClick={() => setEditMode({editMode: true})}>
                                    <IonIcon size='large' icon={createOutline}></IonIcon>
                               </IonButton>                    
                            }
                            { editMode.editMode && onSave &&
    							<IonButton color='primary' onClick={() => {
                                    onSave(recordCopy);
                                    setEditMode({editMode: false});
                                }}>
                                    <IonIcon size='large' icon={checkmarkOutline}></IonIcon>
                               </IonButton>                    
                            }
							<IonButton color='primary' onClick={() => {
                                if (editMode.editMode)
                                    setEditMode({editMode: false});
                                else
                                    dismissDetail();
                            }}>
								<IonIcon size='large' icon={closeOutline}></IonIcon>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					<IonGrid key={utilsService.randomKey()}>
						{Object.keys(recordCopy as any).map((key, index) => {
							const theItem = recordCopy[key]
							const isText = typeof theItem === 'string' || theItem instanceof String
							return (
								<IonRow key={utilsService.randomKey()}>
									<IonCol key={utilsService.randomKey()} size='3' className='breakItUp'>
										{key}
									</IonCol>
									{editMode.editMode && (
										<IonCol key={utilsService.randomKey()} size='9'>
											<IonInput
												className='inputBox'
												key={utilsService.randomKey()}
												value={isText ? recordCopy[key] : JSON.stringify(recordCopy[key])}
												debounce={750}
												onIonChange={(e) => {
													recordCopy[key] = e.detail.value
												}}
											/>
										</IonCol>
									)}
									{!editMode.editMode && isText && (
										<IonCol key={utilsService.randomKey()} size='9' className='breakItUp'>
											{theItem}
										</IonCol>
									)}
									{!editMode.editMode && !isText && (
										<IonCol key={utilsService.randomKey()} size='9' className='breakItUp'>
											{JSON.stringify(theItem)}
										</IonCol>
									)}
								</IonRow>
							)
						})}
					</IonGrid>
				</IonContent>
				{current && (
					<IonFooter>
						<IonToolbar>
							<IonButtons slot='start'>
								<IonButton
									color='primary'
									fill='clear'
									disabled={current === 1}
									onClick={() => {
										console.log('back')
                                        if (onBack) {
                                            onBack();
                                        }
									}}>
									<IonIcon size='large' icon={arrowBackOutline}></IonIcon>
								</IonButton>
							</IonButtons>
							<IonTitle className='ion-text-center'>
								{current ? current + ' of ' + total : ''}
							</IonTitle>
							<IonButtons slot='end'>
								<IonButton
									color='primary'
									fill='clear'
									disabled={current === total}
									onClick={() => {
										console.log('forward')
                                        if (onForward) {
                                            onForward();
                                        }
									}}>
									<IonIcon size='large' icon={arrowForwardOutline}></IonIcon>
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonFooter>
				)}
			</IonPage>
		)
	}
	const [presentDetail, dismissDetail] = useIonModal(DetailBody, {
		record
	})

	return <></>
}

export default DisplayDetail
