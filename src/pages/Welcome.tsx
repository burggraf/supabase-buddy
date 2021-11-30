import { IonButton, IonButtons, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert, useIonToast, useIonViewDidEnter } from '@ionic/react'
import { add, link, logIn, refreshCircle } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router';

//import { Project } from 'react-router'

import { Project } from '../../models/Project';
import ProviderSignInButton from '../Login/ProviderSignInButton';
import { ProjectsService } from '../services/projects.service';
import { SupabaseAuthService } from '../services/supabase.auth.service'

// import { UtilsService } from '../services/utils.service'

import './Welcome.css'

const supabaseAuthService: SupabaseAuthService = new SupabaseAuthService();
const projectsService: ProjectsService = new ProjectsService();
const Welcome: React.FC = () => {
    console.log('welcome, main loop fired');
	const history = useHistory();

    const [presentAlert] = useIonAlert()
    const [presentToast, dismissToast] = useIonToast()
	const [project, setProject] = useState<Project>({ projectID: '', name: '', url: '', apikey: '' });
    const [projects, setProjects] = useState<Project[]>([])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
    
    const loadSettings = async () => {
        setProjects(JSON.parse(localStorage.getItem('projects') || '[]'));
		const projectText = localStorage.getItem('project');
		if (projectText) {
			setProject(JSON.parse(projectText));
		} else {
			setProject({projectID:"",name:"",url:"",apikey:""});
		}
	}
	useIonViewDidEnter(async () => {    
		await loadSettings()
		projectsService.listProjectsToConsole();
		projectsService.listProjectToConsole();
		setTimeout(() => {
			if (supabaseAuthService.getCurrentUser()) {
				console.log('supabaseAuthService.user', supabaseAuthService.getCurrentUser());
				history.replace('/home-dashboard');
			}
		},100);
	})
    // useEffect(() => {
    // }, [project]);

	const saveChanges = () => {
		setProject(projectsService.selectProject(project));
    }
	const signInWithEmail = async () => {
		saveChanges()
		const { user, session, error } = await supabaseAuthService.signInWithEmail(email, password)
		if (error) {
			console.error(error)
			toast(error.message)
		} else {
			// localStorage.setItem('currentProjectID', currentProjectID)
			window.location.href = '/home-dashboard'
		}
	}
	const resetPassword = async () => {
		saveChanges()
		const { data, error } = await supabaseAuthService.resetPassword(email)
		if (error) {
			toast(error.message)
		} else {
			toast('Please check your email for a password reset link', 'success')
		}
	}
	const sendMagicLink = async () => {
		saveChanges()
		const { user, session, error } = await supabaseAuthService.sendMagicLink(email)
		if (error) {
			toast(error.message)
		}
	}
	const validateEmail = (email: string) => {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return re.test(String(email).toLowerCase())
	}
	const newProject = () => {
		setProject({ projectID: '', name: '', url: '', apikey: '' })
	}
	const deleteProject = () => {
		projectsService.deleteProject(project.projectID);
		setProject({ projectID: '', name: '', url: '', apikey: '' })
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Supabase Buddy</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={newProject}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent class="ion-padding">
                { projects && 
					<><IonLabel style={{paddingLeft: '18px'}}><b>Projects: </b></IonLabel>
                        { projects.map((p: Project) => {
                            return (
                            <IonChip key={p.projectID} onClick={() => setProject(p)}>
                                <IonLabel style={{fontWeight: project.name===p.name ? 'bold' : 'normal'}}>{p.name}</IonLabel>
                            </IonChip>
                        )})}
					</>
                }
				<IonGrid class='ion-padding'>
					<IonRow>
						<IonCol>
							<IonLabel>
								<b>Project Name</b>
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonInput
								id='name'
								name='name'
								onIonChange={(e) => setProject(oldProject => ({...oldProject, name:e.detail.value!}))}
								debounce={750}
								className='input'
								value={project.name}
							/>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonLabel>
								<b>API URL</b>
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonInput
								id='url'
								name='url'
								onIonChange={(e) => setProject(oldProject => ({...oldProject, url:e.detail.value!}))}
								debounce={750}
								className='input'
								value={project.url}
							/>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonLabel>
								<b>API Key</b>
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonInput
								id='apikey'
								name='apikey'
								onIonChange={(e) => setProject(oldProject => ({...oldProject, apikey:e.detail.value!}))}
								debounce={750}
								className='input'
								value={project.apikey}
							/>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol>
							<IonLabel>
								<b>Email</b>
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonInput
								type='email'
								placeholder='Enter your email'
								onIonChange={(e) => setEmail(e.detail.value!)}
								value={email}
								class='inputBox'
							/>
						</IonCol>
					</IonRow>
					{!validateEmail(email) && email.length > 0 && (
						<IonRow>
							<IonCol>
								<IonLabel color='danger'>
									<b>Invalid email format</b>
								</IonLabel>
							</IonCol>
						</IonRow>
					)}
					<IonRow>
						<IonCol>
							<IonLabel>
								<b>Password</b>
							</IonLabel>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonInput
								type='password'
								placeholder='Enter your password'
								onIonChange={(e) => setPassword(e.detail.value!)}
								value={password}
								class='inputBox'
							/>
						</IonCol>
					</IonRow>
					{password.length > 0 && password.length < 6 && (
						<IonRow>
							<IonCol>
								<IonLabel color='danger'>
									<b>Password too short</b>
								</IonLabel>
							</IonCol>
						</IonRow>
					)}
					<IonRow>
						<IonCol>
							<IonButton
								expand='block'
								disabled={!validateEmail(email) || password.length < 6}
								onClick={signInWithEmail}>
								<IonIcon icon={logIn} size='large' />
								&nbsp;&nbsp;
								<b>Sign in with email</b>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonButton
								expand='block'
								disabled={!validateEmail(email) || password.length > 0}
								onClick={resetPassword}>
								<IonIcon icon={refreshCircle} size='large' />
								&nbsp;&nbsp;
								<b>Reset Password</b>
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>
							<IonButton
								expand='block'
								disabled={!validateEmail(email) || password.length > 0}
								onClick={sendMagicLink}>
								<IonIcon icon={link} size='large' />
								&nbsp;&nbsp;
								<b>Send Sign In Link</b>
							</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>

				<div className="ion-text-center">
					<IonLabel><b>Sign in with:</b></IonLabel>
				</div>
				<div className="flex-container">

						<ProviderSignInButton name="google" />
						<ProviderSignInButton name="facebook" />
						<ProviderSignInButton name="twitter" />
						<ProviderSignInButton name="apple" />
						<ProviderSignInButton name="spotify" />
						<ProviderSignInButton name="slack" />
						<ProviderSignInButton name="twitch" />
						<ProviderSignInButton name="discord" />
						<ProviderSignInButton name="github" />
						<ProviderSignInButton name="bitbucket" />
						<ProviderSignInButton name="gitlab" />

				</div>


			</IonContent>
			{(project?.projectID?.length > 0) && 
				<IonFooter>
					<IonToolbar>
						<IonButtons slot='start'>
							<IonButton
								color='danger'
								fill='outline'
								onClick={() =>
									presentAlert({
										cssClass: 'my-css',
										header: 'Delete',
										message: 'Are you sure?',
										buttons: ['Cancel', { text: 'OK', handler: (d) => deleteProject() }],
										onDidDismiss: (e) => console.log('did dismiss'),
									})
								}>
								<strong>DELETE</strong>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonFooter>
			}
		</IonPage>
	)
}

export default Welcome
