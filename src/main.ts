import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  create as createNaiveUi,
  // components
  NButton,
	NConfigProvider
} from 'naive-ui'

const naive = createNaiveUi({
  components: [
		NConfigProvider,
		NButton, 
	],
})

export const vueApp = createApp(App)
.use(naive)
.use(router)
.mount("#app");
