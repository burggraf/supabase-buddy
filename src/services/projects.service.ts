import { Project } from '../../models/Project';
import { UtilsService } from './utils.service';

export class ProjectsService {
	private utilsService = new UtilsService();
	private static initialized = false;
	public static project: Project = {
		projectID: '',
		name: '',
		url: '',
		apikey: ''
	};
	public static projects: Project[] = [];
	private init = async () => {
		if (ProjectsService.initialized) {
			return;
		}
		try {
			console.log('*** 1');
			ProjectsService.projects = JSON.parse(localStorage.getItem('projects') || '[]');
			console.log('*** 2');
			ProjectsService.project = JSON.parse(localStorage.getItem('project') || '{projectID:"",name:"",url:"",apikey:""}');
			console.log('*** 3');
			console.log('ProjectsService init: this.projects', ProjectsService.projects)
			console.log('ProjectsService init: this.project', ProjectsService.project)	
			ProjectsService.initialized = true;
		} catch (error) {
			console.error('*** ProjectsService init: error', error)
			console.log('projects has', localStorage.getItem('projects'))
			console.log('project has', localStorage.getItem('project'))
			console.log('ProjectsService init: this.projects', ProjectsService.projects)
			console.log('ProjectsService init: this.project', ProjectsService.project)	
		}
	}
    constructor() {
		console.log('ProjectsService constructor() calling this.init()')
		this.init();
	}
	public selectProject(project: Project) {
		ProjectsService.project = project;
		localStorage.setItem('project', JSON.stringify(project));
		return ProjectsService.project;
	}
	public saveProjects() {
		localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))
		return ProjectsService.projects;
	}
	public projectExists(id: string) {
		return ProjectsService.projects.findIndex((p) => p.projectID === id) > -1;
	}
	public addProject(url: string, apikey: string, name: string): Project {
		const newProject = {
			projectID: this.utilsService.uuidv4(),
			name: name,
			url: url,
			apikey: apikey
		};
		ProjectsService.projects.push(newProject);
		localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))		
		return newProject;
	}
	public deleteProject = (id: string) => {
        const projectIndex = ProjectsService.projects.findIndex((p) => p.projectID === id)
        if (projectIndex > -1) {
            ProjectsService.projects.splice(projectIndex, 1)
            localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))
        }
		return ProjectsService.projects;
	}

		
}