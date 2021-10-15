import { IonApp, IonRouterOutlet, IonSplitPane, useIonViewWillEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Login from './Login/Login';
import Home from './pages/Home';
import AuthUsers from './pages/AuthUsers';
import PageNotFound from './pages/PageNotFound';
import SettingsGeneral from './pages/SettingsGeneral';
import HomeDashboard from './pages/HomeDashboard';
import SqlEditor from './pages/SqlEditor';
import SqlSnippets from './pages/SqlSnippets';
import DatabaseTables from './pages/DatabaseTables';
import DatabaseTable from './pages/DatabaseTable';
import DatabaseColumn from './pages/DatabaseColumn';
import AuthUser from './pages/AuthUser';
import DatabaseFunctions from './pages/DatabaseFunctions';
import DatabaseFunction from './pages/DatabaseFunction';
import ResetPassword from './Login/ResetPassword';
import { StartupService } from './services/startup.service';
import Welcome from './pages/Welcome';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

import { SupabaseAuthService } from './services/supabase.auth.service';
import DatabaseViews from './pages/DatabaseViews';
import DatabaseView from './pages/DatabaseView';

const startupService = new StartupService();
const startupRoute = startupService.getStartupRoute();
const supabaseAuthService = new SupabaseAuthService();

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  
  useEffect(()=>{
    // Only run this one time!  No multiple subscriptions!
    console.log('App setting up user subscription');
    supabaseAuthService.user.subscribe((user: User | null) => {
      console.log('App got new user', user);
      setCurrentUser(user);
    });
  }, []) // <-- empty dependency array

  return (
    <>
    { (currentUser === null) && 
      <IonApp>
      <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/welcome" component={Welcome} />
            <Route path="/resetpassword/:token" component={ResetPassword} />
            <Route path="/" exact={true}>
              <Redirect to={'/welcome'} />
            </Route>
            <Route component={PageNotFound} />
          </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    }
    { (currentUser !== null) && 
      <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/editor-tables" exact={true}>
              <Redirect to="/home" />
            </Route>
            <Route path="/settings-general" component={SettingsGeneral} />
            <Route path="/home" component={Home} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/home-dashboard" component={HomeDashboard} />
            <Route path="/database-functions" component={DatabaseFunctions} />
            <Route path="/database-function/:function_schema/:function_name" component={DatabaseFunction} />
            <Route path="/database-tables" component={DatabaseTables} />
            <Route path="/database-table/:table_schema/:table_name" component={DatabaseTable} />
            <Route path="/database-column/:table_schema/:table_name/:column_name" component={DatabaseColumn} />
            <Route path="/database-views" component={DatabaseViews} />
            <Route path="/database-view/:table_schema/:table_name" component={DatabaseView} />
            <Route path="/auth-users" component={AuthUsers} />
            <Route path="/auth-user/:id" component={AuthUser} />
            <Route path="/sql-editor/:id" component={SqlEditor} />
            <Route path="/sql-snippets" component={SqlSnippets} />
            <Route path="/login" component={Login} />
            <Route path="/resetpassword/:token" component={ResetPassword} />
            <Route path="/" exact={true}>
              <Redirect to={startupRoute || '/welcome'} />
            </Route>
            <Route path="/page/:name" exact={true}>
              <Page />
            </Route>
            <Route component={PageNotFound} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
    }
    </>
  );
};

export default App;
