import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "./libraries/font-awesome";

/* PRIME VUE */
import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css'; //IMPORTANT: p-col and p-p-3 (grid, flex, spacing) has had the prefix of "p" removed: col and p-3
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons -- using font-awesome but still need these icons for primevue to work
import "./assets/_theme.scss"
import Button from 'primevue/button';
import Menubar from 'primevue/menubar'
import Dialog from 'primevue/dialog'
/* PRIME VUE */


export const vueApp = createApp(App)
.use(PrimeVue)
.use(router)
.component("p-button", Button)
.component("p-menubar", Menubar)
.component("p-dialog", Dialog)
.component("fa", FontAwesomeIcon)
.mount("#app");
