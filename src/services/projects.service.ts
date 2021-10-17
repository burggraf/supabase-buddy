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
			ProjectsService.projects = JSON.parse(localStorage.getItem('projects') || '[]');
			ProjectsService.project = JSON.parse(localStorage.getItem('project') || '{projectID:"",name:"",url:"",apikey:""}');
			ProjectsService.initialized = true;
		} catch (error) {
			console.error('*** ProjectsService init: error', error)
		}
	}
    constructor() {
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