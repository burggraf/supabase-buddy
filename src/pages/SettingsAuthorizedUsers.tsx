import {
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon, IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonPopover,
	IonRow,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonToast,
	useIonViewDidEnter
} from '@ionic/react'
import { add, closeOutline, removeCircleOutline, trashBin } from 'ionicons/icons'
import Moment from 'moment'
import { useEffect, useState } from 'react'
import SupabaseDataService from '../services/supabase.data.service'
import './SettingsAuthorizedUsers.css'

const supabaseDataService = SupabaseDataService.getInstance()
// const supabaseAuthService = SupabaseAuthService.getInstance()
const SettingsAuthorizedUsers: React.FC = () => {
	// const history = useHistory()
    const [presentAlert] = useIonAlert();

	const [users, setUsers] = useState<any[]>([])
	const [allUsers, setAllUsers] = useState<any[]>([])

	const [inviteEmail, setInviteEmail] = useState('')
	const [showPopover, setShowPopover] = useState<{
		open: boolean
		event: Event | undefined
		user: any | undefined
	}>({
		open: false,
		event: undefined,
		user: undefined,
	})
	const [showInvite, setShowInvite] = useState<{ open: boolean; event: Event | undefined }>({
		open: false,
		event: undefined,
	})
	const loadUsers = async () => {
		const { data, error } = await supabaseDataService.getAuthorizedUsers()
		if (error) {
			console.error('getAuthorizedUsers error', error)
		} else {
			setUsers(data!)
		}
    }
    const loadAll = async () => {
        const { data, error } = await supabaseDataService.getUsers()
        if (error) {
            console.error('getUsers error', error)
        } else {
            setAllUsers(data!)
        }
    }
    const deleteUser = async (id: string, email: string) => {
        setShowPopover({ open: false, event: undefined, user: undefined })
        console.log('delete user', id)
        presentAlert({
            cssClass: 'my-css',
            header: 'Un-authorize user',
            message: `<b>Are you sure you want to un-authorize ${email} - (${id})?</b>`,
            buttons: [
              'Cancel',
              { text: 'YES', 
                handler: async (d) => {
                    console.log('delete user here...')
                    const { data, error } = await supabaseDataService.deleteAuthorizedUser(id);
                    if (error) {
                        toast(error.message, 'danger');
                    } else {
                        loadUsers()
                        loadAll()                
                    }
                }},
            ],
            //onDidDismiss: (e) => console.log('did dismiss'),
          })

    }
	const addUser = async (id: string) => {
		console.log('add user')
        const { data, error } = await supabaseDataService.addAuthorizedUser(id);
        if (error) {
            toast(error.message, 'danger');
        } else {
            loadUsers()
            loadAll()    
        }
	}
	useIonViewDidEnter(() => {
		loadUsers()
		loadAll()
	})
	//useEffect(() => {
		//loadUsers()
	//}, [])
	const [presentToast, dismissToast] = useIonToast()
	const toast = (message: string, color: string = 'danger') => {
		presentToast({
			color: color,
			message: message,
			cssClass: 'toast',
			buttons: [{ icon: 'close', handler: () => dismissToast() }],
			duration: 6000,
			//onDidDismiss: () => console.log('dismissed'),
			//onWillDismiss: () => console.log('will dismiss'),
		})
	}
	// const { name } = useParams<{ name: string }>()

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot='start'>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>
						Authorized Users ({users.length} of {allUsers.length})
					</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<p className='ion-padding'>
					<b>This is a list of users who have been authorized to use this app.</b>
				</p>
				<IonGrid>
					<IonRow className='header'>
						<IonCol size='4' className='breakItUp'>
							<IonLabel>Email</IonLabel>
						</IonCol>
						<IonCol size='3' className='breakItUp'>
							<IonLabel>Phone</IonLabel>
						</IonCol>
						<IonCol size='3' className='breakItUp'>
							<IonLabel>Last Sign In</IonLabel>
						</IonCol>
						<IonCol size='2' className='breakItUp ion-text-center'>
							Remove
						</IonCol>
						{/* <IonCol>
                    <IonLabel>User UID</IonLabel>
               </IonCol> */}
					</IonRow>
					{users.map((user: any) => (
						<IonRow key={user.id}>
							<IonCol size='4' className='breakItUp'>
								<IonLabel>{user.email || '<no email>'}</IonLabel>
							</IonCol>
							<IonCol size='3' className='breakItUp'>
								<IonLabel>{user.phone || '-'}</IonLabel>
							</IonCol>
							<IonCol size='3' className='breakItUp'>
								<IonLabel>
									{user.last_sign_in_at
										? Moment(user.last_sign_in_at).format('YYYY-MM-DD hh:mmA')
										: 'never'}
								</IonLabel>
							</IonCol>
							<IonCol size='2' className='ion-text-center breakItUp'>
                                <IonButton
                                    strong
                                    fill='outline'
                                    onClick={() => {
                                        deleteUser(user.id, user.email)
                                    }}
                                    color='danger'><IonIcon color="danger" size='large' icon={removeCircleOutline}></IonIcon></IonButton>
							</IonCol>
							{/* <IonCol>
                            <IonLabel>{user.id}</IonLabel>
                    </IonCol> */}
						</IonRow>
					))}
				</IonGrid>
				<IonPopover
					isOpen={showPopover.open}
					event={showPopover.event}
					backdropDismiss={true}
					keyboardClose={true}
					showBackdrop={true}
					onDidDismiss={(e) => setShowPopover({ open: false, event: undefined, user: undefined })}>
					<IonList>
						<IonListHeader>
							<IonLabel className='ion-text-center'>{showPopover.user?.email}</IonLabel>
						</IonListHeader>

						<IonItem>
							<IonButton
								strong
								fill='clear'
								onClick={() => {
									deleteUser(showPopover.user?.id, showPopover.user?.email)
								}}
								color='danger'>
								<IonIcon slot='start' size='small' icon={trashBin}></IonIcon>
								Un-authorize User
							</IonButton>
						</IonItem>

						<IonItem>
							<IonButton
								strong
								fill='clear'
								onClick={() => {
									setShowPopover({ open: false, event: undefined, user: undefined })
								}}
								color='dark'>
								<IonIcon slot='start' size='small' icon={closeOutline}></IonIcon>
								Cancel
							</IonButton>
						</IonItem>
					</IonList>
				</IonPopover>

                <IonList>
                    <IonListHeader><IonLabel><b>Add a new authorized user:</b></IonLabel></IonListHeader>
				{allUsers.filter(u => !users.find(uu => uu.id === u.id)).map((user: any) => (               
                    <IonItem key={user.id}>
                        <IonButton
                        strong
                        fill='outline'
                        onClick={() => {
                            presentAlert({
                                cssClass: 'my-css',
                                header: 'Authorize user',
                                message: `<b>Are you sure you want to authorize ${user.email} - (${user.id})?</b>`,
                                buttons: [
                                  'Cancel',
                                  { text: 'YES', 
                                    handler: (d) => {
                                        console.log('add user here...')
                                        addUser(user.id);
                                    } },
                                ],
                                //onDidDismiss: (e) => console.log('did dismiss'),
                              })                    
                        }}
                        color='dark'><IonIcon color="dark" size='medium' icon={add}></IonIcon></IonButton>
                    &nbsp;{user.email}</IonItem>
				))}
                </IonList>
			</IonContent>
		</IonPage>
	)
}

export default SettingsAuthorizedUsers
