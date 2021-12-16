import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact, useIonViewWillEnter } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'

import Menu from './components/Menu'
import Login from './Login/Login'
import ResetPassword from './Login/ResetPassword'
import AuthUser from './pages/AuthUser'
import AuthUsers from './pages/AuthUsers'
import DatabaseColumn from './pages/DatabaseColumn'
import DatabaseExtensions from './pages/DatabaseExtensions'
import DatabaseFunction from './pages/DatabaseFunction'
import DatabaseFunctions from './pages/DatabaseFunctions'
import DatabaseSchemas from './pages/DatabaseSchemas'
import DatabaseTable from './pages/DatabaseTable'
import DatabaseTables from './pages/DatabaseTables'
import DatabaseView from './pages/DatabaseView'
import DatabaseViews from './pages/DatabaseViews'
import Home from './pages/Home'
import HomeDashboard from './pages/HomeDashboard'
import Installation from './pages/Installation'
import Page from './pages/Page'
import PageNotFound from './pages/PageNotFound'
import SettingsAuthorizedUsers from './pages/SettingsAuthorizedUsers'
import SettingsGeneral from './pages/SettingsGeneral'
import SqlEditor from './pages/SqlEditor'
import SqlSnippets from './pages/SqlSnippets'
import Welcome from './pages/Welcome'
import StartupService from './services/startup.service'
import SupabaseAuthService from './services/supabase.auth.service'

/* Theme variables */
import './theme/variables.css'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/typography.css'

setupIonicReact();

const startupService = StartupService.getInstance();
const startupRoute = startupService.getStartupRoute();
const supabaseAuthService = SupabaseAuthService.getInstance();

const App: React.FC = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null)

	useEffect(() => {
		// Only run this one time!  No multiple subscriptions!
		supabaseAuthService.user.subscribe((user: User | null) => {
			setCurrentUser(user)
		})
	}, []) // <-- empty dependency array

	return (
		<>
			{currentUser === null && (
				<IonApp>
					<IonReactRouter>
						<IonRouterOutlet id='main'>
							<Route path='/welcome' component={Welcome} />
							<Route path='/resetpassword/:token' component={ResetPassword} />
							<Route path='/' exact={true}>
								<Redirect to={'/welcome'} />
							</Route>
							<Route component={PageNotFound} />
						</IonRouterOutlet>
					</IonReactRouter>
				</IonApp>
			)}
			{currentUser !== null && (
				<IonApp>
					<IonReactRouter>
						<IonSplitPane when={false} contentId='main'>
							<Menu />
							<IonRouterOutlet id='main'>
								<Route path='/editor-tables' exact={true}>
									<Redirect to='/home' />
								</Route>
								<Route path='/settings-general' component={SettingsGeneral} />
								<Route path='/home' component={Home} />
								<Route path='/installation' component={Installation} />
								<Route path='/welcome' component={Welcome} />
								<Route path='/home-dashboard' component={HomeDashboard} />
								<Route path='/database-extensions' component={DatabaseExtensions} />
								<Route path='/database-functions' component={DatabaseFunctions} />
								<Route
									path='/database-function/:function_schema/:function_name'
									component={DatabaseFunction}
								/>
								<Route path='/database-tables' component={DatabaseTables} />
								<Route path='/database-table/:table_schema/:table_name' component={DatabaseTable} />
								<Route
									path='/database-column/:table_schema/:table_name/:column_name'
									component={DatabaseColumn}
								/>
								<Route path='/database-views' component={DatabaseViews} />
								<Route path='/database-view/:table_schema/:table_name' component={DatabaseView} />
								<Route path='/database-schemas' component={DatabaseSchemas} />
								<Route path='/auth-users' component={AuthUsers} />
								<Route path='/settings-authorized-users' component={SettingsAuthorizedUsers} />
								<Route path='/auth-user/:id' component={AuthUser} />
								<Route path='/sql-editor/:id' component={SqlEditor} />
								<Route path='/sql-snippets' component={SqlSnippets} />
								<Route path='/login' component={Login} />
								<Route path='/resetpassword/:token' component={ResetPassword} />
								<Route path='/' exact={true}>
									<Redirect to={startupRoute || '/welcome'} />
								</Route>
								<Route path='/page/:name' exact={true}>
									<Page />
								</Route>
								<Route component={PageNotFound} />
							</IonRouterOutlet>
						</IonSplitPane>
					</IonReactRouter>
				</IonApp>
			)}
		</>
	)
}

export default App
