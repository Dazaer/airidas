import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* PRIME VUE */
import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css';
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons
//import "primevue/resources/themes/bootstrap4-dark-blue/theme.css" //theme
import "./assets/_theme.scss"
import Button from 'primevue/button';
import Menubar from 'primevue/menubar'
/* PRIME VUE */


export const vueApp = createApp(App)
.use(PrimeVue)
.component("p-button", Button)
.component("p-menubar", Menubar)
.use(router)
.mount("#app");
