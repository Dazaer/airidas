/* eslint-disable */
import { App, Plugin } from "vue";
declare const plugin: Plugin;
export default plugin;

//declare module 'vue-shave' {
declare module 'vue/types/vue' {
	interface Vue {
		$vueshave: VueShave
	}
}

interface VueShave {
	install: (vue: App, options: VueShaveConfig) => void;
}

interface VueShaveConfig {
		/** Throttle length in ms */
		throttle: number,
		/** Override default elipsis character */
		character: string,
		/** Spaces config (see shave documentation) */
		spaces: boolean,
		/** Default shave height (see shave documentation) */
		height: number
	}
	