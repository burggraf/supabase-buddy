
export default class StartupService {
	static myInstance:any = null;

	static getInstance() {
		if (this.myInstance == null) {
		  this.myInstance = new this();
		}
		return this.myInstance;
	  }

    // constructor() {


    // }

    public getDefaultRoute(): string {
        return '/home-dashboard';
    }

    public getStartupRoute(): string {
        // handle password recovery links
        const hash = window.location.hash;
        if (hash && hash.substr(0,1) === '#') {
            const tokens = hash.substr(1).split('&');
            const entryPayload: any = {};
            tokens.map((token) => {
                const pair = (token + '=').split('=');
                entryPayload[pair[0]] = pair[1];
            });
            if (entryPayload?.type === 'recovery') { // password recovery link
                return `/resetpassword/${entryPayload.access_token}`;
                // router.navigateByUrl(`/resetpassword/${entryPayload.access_token}`);
            }
        }
        let path = window.location.pathname.replace(/\//, '');
        console.log('path 1', path);
        // remove querystring from path
        if (path.indexOf('?') > -1) {
            path = path.substr(0, path.indexOf('?'));
        }        
        console.log('path 2', path);
        console.log('localStorage.getItem("selectedPage"")', localStorage.getItem("selectedPage"));

        if (!path || path.length === 0 || path === '/') {
            path = localStorage.getItem('selectedPage') || this.getDefaultRoute();
        }
        if (path === 'undefined' || path === '/undefined') {
            path = this.getDefaultRoute();
        }

        console.log('path 3', path);

        return path;
    }
  


}
