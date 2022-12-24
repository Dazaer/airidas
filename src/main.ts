import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { FontAwesomeIcon } from "./libraries/font-awesome"
import { FontAwesomeLayers } from "@fortawesome/vue-fontawesome"
import { appWithPrimeVue } from "./libraries/prime-vue"

/* Dayjs */
/*
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);
*/
/* Dayjs */

function assembleVueApp() {
	let app = createApp(App)
		.use(router)
		.component("fa", FontAwesomeIcon)
		.component("fa-layers", FontAwesomeLayers)

	app = appWithPrimeVue(app)
	return app.mount("#app")
}
export const vueApp = assembleVueApp()