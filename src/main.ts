import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from 'primevue/config';
//import "bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons
//import "primevue/resources/themes/bootstrap4-dark-blue/theme.css" //theme
import "./assets/_theme.scss"

import Button from 'primevue/button';

import {
  create as createNaiveUi,
  // components
  NButton,
	NConfigProvider,
	NMenu,
	NSpace,
	NGrid,
	NGridItem,
} from 'naive-ui'

const naive = createNaiveUi({
  components: [
		NConfigProvider,
		NMenu,
		NSpace,
		NButton,
		NGrid,
		NGridItem,
	],
})

export const vueApp = createApp(App)
.use(naive)
.use(PrimeVue)
.component("Button", Button)
.use(router)
.mount("#app");
