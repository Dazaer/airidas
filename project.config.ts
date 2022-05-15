
enum ProjectEnvironments {
	Production,
	Development,
}
export class ProjectConfig {
	/** IMPORTANT: Change the current environment using one of ProjectEnvironments depending on which one should be used. */
	public static readonly currentEnvironment: ProjectEnvironments = ProjectEnvironments.Production
	public static isProductionEnv: boolean = ProjectConfig.currentEnvironment === ProjectEnvironments.Production
	public static isDebugging: boolean = true
}