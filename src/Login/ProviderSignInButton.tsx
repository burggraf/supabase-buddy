import { IonButton, IonIcon } from '@ionic/react';
import { Provider } from '@supabase/supabase-js';
import { addIcons } from 'ionicons';
import { logoApple, logoBitbucket, logoDiscord, logoFacebook, logoGithub, logoGitlab, logoGoogle, logoSlack, logoTwitch, logoTwitter } from 'ionicons/icons';
import logoSpotify from '../Login/auth-provider-icons/spotify.svg';
import SupabaseAuthService from '../services/supabase.auth.service';
import './ProviderSignInButton.css';



interface ContainerProps {
  name: string;
}

const supabaseAuthService = SupabaseAuthService.getInstance();
const signInWithProvider = async (provider: Provider) => {
    console.log('signInWithProvider', provider)
    const { user, session, error } = 
        await supabaseAuthService.signInWithProvider(provider);
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    return { user, session, error };
}
addIcons({
    'apple': logoApple,
    'bitbucket': logoBitbucket,
    'discord': logoDiscord,
    'facebook': logoFacebook,
    'github': logoGithub,
    'gitlab': logoGitlab,
    'google': logoGoogle,
    'twitch': logoTwitch,
    'twitter': logoTwitter,
    'slack': logoSlack,
    'spotify': logoSpotify
});

const ProviderSignInButton: React.FC<ContainerProps> = ({ name }) => {
    const nameProperCase = name.charAt(0).toUpperCase() + name.slice(1);
  return (
      <div className="flex-child ion-text-center" onClick={()=>{signInWithProvider((name as Provider))}}>
        <IonButton>
        <IonIcon icon={name} size="large" />
        </IonButton><br/>                  
        <b>{nameProperCase}</b>
      </div>
  );
};

export default ProviderSignInButton;
