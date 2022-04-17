import { ProjectConfig } from './../../project.config';
export default class Debugger {
	static readonly isEnabled: boolean = ProjectConfig.isDebugging && !ProjectConfig.isProductionEnv

	static Log(log: any) {
		if (this.isEnabled) {
			console.log("--- " + JSON.stringify(log))
		}
	}

	static Warn(log: any) {
		if (this.isEnabled) {
			console.warn("--- " + JSON.stringify(log))
		}
	}

	static Error(log: any) {
		if (this.isEnabled) {
			console.error("--- " + JSON.stringify(log))
		}
	}
}