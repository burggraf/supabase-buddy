import { createClient, Provider, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

//import { ProjectsService } from '../services/keys.service';
import { ProjectsService } from '../services/projects.service';

const projectsService: ProjectsService = new ProjectsService();

let supabase: SupabaseClient;// = createClient('URL', 'ANON-KEY');

export class SupabaseAuthService {

  public user = new BehaviorSubject<User | null>(null);
  private _user: User | null = null;
  public isConnected = false;

  constructor() {
    this.connect();
    // Try to recover our user session
    if (this.isConnected)
      this.loadUser();
  }

  private authStateSubscription: any;

  public connect() {
    const url = ProjectsService.project.url;
    const apikey = ProjectsService.project.apikey;
    if (url !== '' && apikey !== '') {
      supabase = createClient(url, apikey);
      this.isConnected = true;
      this.authStateSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          this._user = session.user;
          this.user.next(session.user);
        } else {
          this._user = null;
          this.user.next(null);
        }
      });  
    } else {
      // supabase = createClient('', '');
      this.isConnected = false;
      if (this.authStateSubscription) {
        this.authStateSubscription.unsubscribe();
      }
    }
  }

  // ************** auth ****************

  private async loadUser() {
    const user = supabase.auth.user();
    if (user) {
      this._user = user;
      this.user.next(user);
    } else {
      // no current user
    }
  };

  public signUpWithEmail = async (email: string, password: string) => {
    if (!this.isConnected) this.connect();
    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return { user, session, error };
  }

  public signInWithEmail = async (email: string, password: string) => {
    if (!this.isConnected) this.connect();
    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if (!error) {
      this._user = user;
      this.user.next(user);
    }
    return { user, session, error };
  }

  public signInWithProvider = async (provider: Provider) => {
    if (!this.isConnected) this.connect();
    const { user, session, error } = await supabase.auth.signIn({
      provider: provider
    }, {
      redirectTo: window.location.origin
    });
    if (!error) {
      this._user = user;
      this.user.next(user);
    }
    return { user, session, error };
  }

  public resetPassword = async (email: string) => {
    if (!this.isConnected) this.connect();
    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email,
      {
        redirectTo: window.location.origin
      });
    return { data, error };
  }

  public sendMagicLink = async (email: string) => {
    if (!this.isConnected) this.connect();
    const { user, session, error } = await supabase.auth.signIn({
      email: email
    }, {
      redirectTo: window.location.origin
    });
    return { user, session, error };
  }

  public updatePassword = async (access_token: string, new_password: string) => {
    if (!this.isConnected) this.connect();
    const { error, data } = await supabase.auth.api
      .updateUser(access_token, { password: new_password });
    return { error, data };
  }

  public signOut = async () => {
    if (!this.isConnected) this.connect();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      this._user = null;
      this.user.next(null);
    }
    return { error };
  }
}
