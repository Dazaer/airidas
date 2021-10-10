import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  create as createNaiveUi,
  // components
  NButton,
	NConfigProvider,
	NMenu,
	NSpace
} from 'naive-ui'

const naive = createNaiveUi({
  components: [
		NConfigProvider,
		NMenu,
		NSpace,
		NButton,
	],
})

export const vueApp = createApp(App)
.use(naive)
.use(router)
.mount("#app");
