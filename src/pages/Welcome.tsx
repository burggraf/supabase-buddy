import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert, useIonToast, useIonViewDidEnter } from '@ionic/react'
import { add, link, logIn, personAdd, refreshCircle } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { Project } from '../../models/Project';
import { ProjectsService } from '../services/projects.service';
import { SupabaseAuthService } from '../services/supabase.auth.service'

// import { UtilsService } from '../services/utils.service'

import './Welcome.css'

const supabaseAuthService: SupabaseAuthService = new SupabaseAuthService();
const projectsService: ProjectsService = new ProjectsService();

const Welcome: React.FC = () => {
    console.log('welcome, main loop fired');

    const [presentAlert] = useIonAlert()
    const [presentToast, dismissToast] = useIonToast()
    // const history = useHistory()
    const [url, setUrl] = useState('')
    const [apikey, setApikey] = useState('')
    const [name, setName] = useState('')
    const [projects, setProjects] = useState<Project[]>([])
    const [currentProjectID, setCurrentProjectID] = useState('')
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
        setProjects(ProjectsService.projects);
        setCurrentProjectID(ProjectsService.currentProjectID);    
	}
	useIonViewDidEnter(async () => {    
		await loadSettings()
	})
    useEffect(() => {
        console.log('currentProjectID changed', currentProjectID, 'projectsService is', projectsService);
        if (projectsService) {
            const selectedProject: Project = projectsService.selectProject(currentProjectID);
            if (selectedProject) {
                setUrl(selectedProject.url)
                setApikey(selectedProject.apikey)
                setName(selectedProject.name)
            }    
        }
    }, [currentProjectID]);

	const saveChanges = () => {
		console.log('saveChanges, currentProjectID', currentProjectID)
        if (!currentProjectID) {
            console.log('saveChanges is calling projectsService.addProject');
            const newProjectID: string = projectsService.addProject(url, apikey, name);
            setProjects(ProjectsService.projects);
            setCurrentProjectID(newProjectID);
        } else {
            projectsService.selectProject(currentProjectID);
            console.log('saveChanges isn\'t doing anthing');
            console.log('projectsService project is', ProjectsService.project);
        }
    }
	const signInWithEmail = async () => {
		saveChanges()
		const { user, session, error } = await supabaseAuthService.signInWithEmail(email, password)
		if (error) {
			console.error(error)
			toast(error.message)
		} else {
			// localStorage.setItem('currentProjectID', currentProjectID)
            console.log('signInWithEmail returned user', user);
			window.location.href = '/'
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
    const loadProject = (id: string) => {
        console.log('loadProject', id)
        const project = projects.find((p) => p.projectID === id)
        console.log('found project', project)
        if (project) {
            setUrl(project.url)
            setApikey(project.apikey)
            setName(project.name)
            setCurrentProjectID(project.projectID)
        }
    }

	const addProject = () => {
        setUrl('')
        setApikey('')
        setName('')
        setCurrentProjectID('')
	}
	const deleteProject = () => {
        setProjects(projectsService.deleteProject(currentProjectID));
	}
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Supabase Buddy</IonTitle>
					<IonButtons slot='end'>
						<IonButton color='primary' onClick={addProject}>
							<IonIcon size='large' icon={add}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent>
                { projects && 
                    <IonList>
                        <IonListHeader>
                            <IonLabel><b>Projects</b></IonLabel>
                        </IonListHeader>
                        { projects.map((project: Project) => {
                            return (
                            <IonItem key={project.projectID} onClick={() => setCurrentProjectID(project.projectID)}>
                                <IonLabel>{project.name}</IonLabel>
                            </IonItem>
                        )})}
                    </IonList>
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
								onIonChange={(e) => setName(e.detail.value!)}
								debounce={750}
								className='input'
								value={name}
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
								onIonChange={(e) => setUrl(e.detail.value!)}
								debounce={750}
								className='input'
								value={url}
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
								onIonChange={(e) => setApikey(e.detail.value!)}
								debounce={750}
								className='input'
								value={apikey}
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
			</IonContent>
			{(currentProjectID || true) && 
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
