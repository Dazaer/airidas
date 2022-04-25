
enum ProjectEnvironments {
	Production,
	Development,
}
export class ProjectConfig {
	public static readonly currentEnvironment: ProjectEnvironments = ProjectEnvironments.Production
	public static isProductionEnv: boolean = ProjectConfig.currentEnvironment === ProjectEnvironments.Production
	public static isDebugging: boolean = true
}