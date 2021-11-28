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
			console.log('init got projects', ProjectsService.projects);
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
		// find this project in the list of projects
		if (project.projectID === '') {
			project.projectID = this.utilsService.uuidv4();
		}
		console.log('** selectProject', project);
		const index = ProjectsService.projects.findIndex((p) => p.projectID === project.projectID);
		console.log('index is', index);
		if (index === -1) {
			// add this project to the list of projects
			ProjectsService.projects.push(project);
			this.saveProjects();
		} else {
			// update the project in the list of projects
			ProjectsService.projects[index] = project;
			this.saveProjects();
		}
		this.listProjectsToConsole();
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
		console.log('ProjectsService.addProject');
		const newProject = {
			projectID: this.utilsService.uuidv4(),
			name: name,
			url: url,
			apikey: apikey
		};
		//ProjectsService.projects.push(newProject);
		//localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))	
		this.listProjectsToConsole();	
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

	public listProjectsToConsole() {
		console.log('ProjectsService.projects', ProjectsService.projects);
	}
	public listProjectToConsole() {
		console.log('ProjectsService.project', ProjectsService.project);
	}
	public clearProject() {
		ProjectsService.project = {
			projectID: '',
			name: '',
			url: '',
			apikey: ''
		};		
	}
		
}