import { Project } from '../../models/Project';
import { UtilsService } from './utils.service';

export class ProjectsService {
	private utilsService = new UtilsService();
	public static project: Project = {
		projectID: '',
		name: '',
		url: '',
		apikey: ''
	};
	public static projects: Project[] = [];
	public static currentProjectID = '';
	private init = async () => {
        ProjectsService.projects = JSON.parse(localStorage.getItem('projects') || '[]');
		ProjectsService.currentProjectID = localStorage.getItem('currentProjectID') || '';
		console.log('ProjectsService.currentProjectID', ProjectsService.currentProjectID);
		if (ProjectsService.projects && ProjectsService.currentProjectID) {
			const currentProject = ProjectsService.projects.find((p: Project) => p.projectID === ProjectsService.currentProjectID)
			console.log('found currentProject', currentProject)
			if (currentProject) {
				ProjectsService.project.url = currentProject.url;
				ProjectsService.project.apikey = currentProject.apikey;
				ProjectsService.project.projectID = currentProject.projectID;
				ProjectsService.project.name = currentProject.name;
			}
		}
		console.log('ProjectsService init: this.projects', ProjectsService.projects)
		console.log('ProjectsService init: this.project', ProjectsService.project)
	}
    constructor() {
		console.log('ProjectsService constructor() calling this.init()')
		this.init();
	}
	public selectProject(id: string) {
        const projectIndex = ProjectsService.projects.findIndex((p) => p.projectID === id)
        if (projectIndex > -1) {
			ProjectsService.project = ProjectsService.projects[projectIndex];
			ProjectsService.currentProjectID = id;
			localStorage.setItem('currentProjectID', id);
		}
		console.log('projectsService selectProject, this.project', ProjectsService.project);
		return ProjectsService.project;
	}
	public saveProjects() {
		localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))
		return ProjectsService.projects;
	}
	public projectExists(id: string) {
		return ProjectsService.projects.findIndex((p) => p.projectID === id) > -1;
	}
	public addProject(url: string, apikey: string, name: string): string {
		const newProject = {
			projectID: this.utilsService.uuidv4(),
			name: name,
			url: url,
			apikey: apikey
		};
		ProjectsService.projects.push(newProject);
		localStorage.setItem('projects', JSON.stringify(ProjectsService.projects))
		return newProject.projectID;
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