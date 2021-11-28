import { IonAccordion, IonAccordionGroup, IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { addIcons } from 'ionicons';
import { analytics, archiveOutline, archiveSharp, barChart, barChartOutline, barChartSharp, bookmarkOutline, code, documentText, fileTrayStacked, hammer, heartOutline, heartSharp, home, homeOutline, homeSharp, informationCircle, informationCircleOutline, informationCircleSharp, link, list, listCircleOutline, listCircleSharp, listOutline, listSharp, lockClosed, lockClosedOutline, lockClosedSharp, logIn, logInOutline, logInSharp, logoApple, logoBitbucket, logoDiscord, logoFacebook, logoGithub, logoGitlab, logoGoogle, logoTwitch, logoTwitter, logOut, logOutOutline, logOutSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, people, peopleOutline, peopleSharp, person, personOutline, personSharp, search, searchOutline, searchSharp, settings, settingsOutline, settingsSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { description, version } from '../../package.json';
import { SupabaseAuthService } from '../services/supabase.auth.service';
import { ProjectsService } from '../services/projects.service';

// const projectsService: ProjectsService = new ProjectsService();

import './Menu.css';

const supabaseAuthService = new SupabaseAuthService();

interface AppPage {
  title: string;
  url: string;
  icon?: string;
  iosIcon?: string;
  mdIcon?: string;
  children: AppChild[];
}
interface AppChild {
  title: string;
  url: string;
  icon: string;
}
addIcons({
  'home': home,
  'people': people,
  'settings': settings,
  'list': list,
  'file-tray-stacked': fileTrayStacked,
  'code': code,
  'analytics': analytics,
  'document-text': documentText,
  'link': link

});


const appPages: AppPage[] = [

  { title: 'Home', url: 'home', icon: 'home',
    children: [
      // { title: 'Welcome', url: 'welcome', icon: 'search' },
      { title: 'Dashboard', url: 'home-dashboard', icon: 'search' },
      { title: 'Security', url: 'home-security', icon: 'search' },
    ] 
  },
  { title: 'Database', url: 'database', icon: 'analytics',
    children: [
      { title: 'Schemas', url: 'database-schemas', icon: 'map' },
      { title: 'Tables', url: 'database-tables', icon: 'map' },
      { title: 'Views', url: 'database-views', icon: 'map' },
      { title: 'Functions', url: 'database-functions', icon: 'map' },
      { title: 'Triggers', url: 'database-triggers', icon: 'map' },
      { title: 'Extensions', url: 'database-extensions', icon: 'map' },
      { title: 'Snippets', url: 'sql-snippets', icon: 'map' },
    ] 
  },
  { title: 'Authentication', url: 'authentication', icon: 'people',
    children: [
      { title: 'Users', url: 'auth-users', icon: 'search' },
    ] 
  },
  { title: 'Storage', url: 'storage', icon: 'file-tray-stacked',
    children: [
      { title: 'All Buckets', url: 'storage-buckets', icon: 'search' },
      { title: 'Settings', url: 'storage-settings', icon: 'list' },
      { title: 'Policies', url: 'storage-policies', icon: 'business' },
      { title: 'Usage', url: 'storage-usage', icon: 'list' },
    ] 
  },
  // { title: 'Reports', url: 'reports', icon: 'document-text',
  //   children: [
  //     { title: 'Dashboard', url: 'reports-dashboard', icon: 'map' },
  //     { title: 'Add/Remove', url: 'reports-add-remove', icon: 'map' },
  //   ]
  // },
  // { title: 'API', url: 'api', icon: 'link', 
  //   children: [
  //     { title: 'Introduction', url: 'api-intro', icon: 'map' },
  //     { title: 'Authentication', url: 'api-auth', icon: 'map' },
  //     { title: 'User Management', url: 'api-users', icon: 'map' },
  //     { title: 'Tables & Views', url: 'api-tables', icon: 'map' },
  //     { title: 'Functions', url: 'api-functions', icon: 'map' },
  //   ] 
  // },
  { title: 'Settings', url: 'settings', icon: 'settings', 
    children: [
      { title: 'Authorized Users', url:'settings-authorized-users', icon: 'map'},
      { title: 'Install Instructions', url:'installation', icon: 'map'},
    ] 
  },

];


const Menu: React.FC = () => {
  const initialMenuRef = useRef();
  const location = useLocation();
  let _user: User | null = null;
  const selectedAccordionItem = localStorage.getItem('selectedAccordionItem') || '';
  const selectedAccordion = localStorage.getItem('selectedAccordion') || '';
  const [avatar, setAvatar] = useState('./assets/img/profile160x160.png');
  const [email, setEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState(selectedAccordionItem);

  function clickHandler(e: any) {
    document.getElementById(selectedItem)?.classList.remove('selected');
    e.target.classList.add('selected');
    setSelectedItem(e.target.id);
    localStorage.setItem('selectedAccordionItem', e.target.id);  
    localStorage.setItem('selectedAccordion', e.target.parentElement.parentElement.parentElement.value);  
  }
  function renderMenuChildren(list: AppChild[]) {
    return list
      //.filter(route => !!route.path)
      .map((appChild, index) => (
        <IonMenuToggle autoHide={false} key={'AppChild' + index}>
          <IonItem id={appChild.url} onClick={clickHandler} routerLink={'/' + appChild.url} lines="none" detail={false} routerDirection="root" className="appPageChildItem">
            <IonIcon slot="start" ios="" md=""></IonIcon>
            <IonLabel>{appChild.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }
  function renderMenuItems(list: AppPage[]) {
    return list
      //.filter(route => !!route.path)
      .map((appPage, index) => (
  
        <IonAccordion key={'MenuPage' + index} value={appPage.url}>
        <IonItem slot="header">
          <IonLabel>{appPage.title}</IonLabel>
          <IonIcon slot="start" icon={appPage.icon}></IonIcon>
        </IonItem>
        <IonList slot="content" className="appPageChildList">
          {renderMenuChildren(appPage.children)}
        </IonList>
        </IonAccordion>  
  
      ));
  }
  
  const signOut = async () => {
    const { error } = await supabaseAuthService.signOut();
    if (error) {
      console.error('Error signing out', error);
    } else {
      localStorage.removeItem('supabase.auth.token');
    }
  }
  const loadImage = () =>{
    console.log('loadImage() not implemented');
  }
  const selectImage = ($event: any) => {
    console.log('selectImage() not implemented');
  }
  const getPhotoURL = () => {
    return _user?.user_metadata?.avatar_url || './assets/img/profile160x160.png';
  }


  useEffect(()=>{
    // Only run this one time!  No multiple subscriptions!
    supabaseAuthService.user.subscribe((user: User | null) => {
      _user = user;
      if (_user?.email) {
        setEmail(_user.email);
        setAvatar(_user?.user_metadata?.avatar_url || './assets/img/profile160x160.png')
      } else {
        setEmail('');
      }
    });
    // setTimeout(() => {
    //   document.getElementById(selectedAccordionItem)?.click();
    // } , 1000);
  }, []) // <-- empty dependency array

  return (
    <IonMenu contentId="main" type="overlay">

      <IonHeader className="menuHeader">
        <div style={{paddingLeft: "20px"}}>
          <h4>
            { email &&
              <>
                <img onClick={loadImage} style={{height: '35px', borderRadius: '50%', objectFit: 'cover'}}
                  src={avatar}
                />
                <input type="file" hidden id="fileInput" onChange={selectImage} accept=".jpg, .jpeg, .png" />
                <span style={{position: 'relative', top: '-8px'}}>&nbsp;&nbsp; { email || ''  }</span>
              </>
            }
            { !email && 
              <>
                <IonIcon src="/assets/supabase-logo-icon.svg" size="large"></IonIcon>
                <span style={{position: 'relative', top: '-8px'}}>&nbsp;&nbsp; <strong>Supabase Buddy</strong></span>
              </>
            }
          </h4>
        </div>
      </IonHeader>

      <IonContent>

        <IonAccordionGroup id="page-list" value={selectedAccordion}>
          {renderMenuItems(appPages)}
        </IonAccordionGroup>

      </IonContent>
      <IonFooter>
      <IonList id="inbox-list">
          {/* <IonListHeader>menu header</IonListHeader>
          { email && <IonNote><strong>{email || ''}</strong></IonNote>} */}
          {/* <IonMenuToggle autoHide={false}> */}
            { email &&
              <IonItem href='' onClick={signOut} lines="none" detail={false}>
                <IonIcon slot="start" ios={logOutOutline} md={logOutSharp}></IonIcon>
                <IonLabel><strong>Sign Out</strong></IonLabel>
              </IonItem>
            }    
          {/* </IonMenuToggle> */}
        </IonList>

        <div className="ion-text-center">
          { ProjectsService.project.name }
        </div>
        <div className="ion-text-center">
          { description } v{ version }
        </div>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
