import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
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

const App: React.FC = () => {
  return (
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
            <Route path="/home-dashboard" component={HomeDashboard} />
            <Route path="/auth-users" component={AuthUsers} />
            <Route path="/sql-editor" component={SqlEditor} />
            <Route path="/login" component={Login} />
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>
            <Route path="/page/:name" exact={true}>
              <Page />
            </Route>
            <Route component={PageNotFound} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
