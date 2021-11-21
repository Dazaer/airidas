import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "./libraries/font-awesome";

/* PRIME VUE */
import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css'; //IMPORTANT: p-col and p-p-3 (grid, flex, spacing) has had the prefix of "p" removed: col and p-3
import "primevue/resources/primevue.min.css"                 //core css
//import "primeicons/primeicons.css"                           //icons -- not installed. Using fontawesome
//import "primevue/resources/themes/bootstrap4-dark-blue/theme.css" //theme
import "./assets/_theme.scss"
import Button from 'primevue/button';
import Menubar from 'primevue/menubar'
/* PRIME VUE */


export const vueApp = createApp(App)
.use(PrimeVue)
.component("p-button", Button)
.component("p-menubar", Menubar)
.component("fa", FontAwesomeIcon)
.use(router)
.mount("#app");
