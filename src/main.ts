import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { FontAwesomeIcon } from "./libraries/font-awesome"
import { FontAwesomeLayers } from "@fortawesome/vue-fontawesome"

/* Dayjs */
/*
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc);
*/
/* Dayjs */

/* PRIME VUE */
import ConfirmationService from "primevue/confirmationservice"
import PrimeVue from "primevue/config"
import ToastService from "primevue/toastservice"
import "primeflex/primeflex.css" //IMPORTANT: p-col and p-p-3 (grid, flex, spacing) has had the prefix of "p" removed: col and p-3  || jc == justify-content
import "primevue/resources/primevue.min.css"                 //core css
import "primeicons/primeicons.css"                           //icons -- using font-awesome but still need these icons for primevue to work
import "./assets/_theme.scss"
import AutoComplete from "primevue/autocomplete"
import Button from "primevue/button"
import Chip from "primevue/chip"
import Column from "primevue/column"
import ConfirmPopup from "primevue/confirmpopup"
import DataTable from "primevue/datatable"
import DataView from "primevue/dataview"
import Dialog from "primevue/dialog"
import Dropdown from "primevue/dropdown"
import InputText from "primevue/inputtext"
import Menubar from "primevue/menubar"
import Password from "primevue/password"
import ProgressBar from "primevue/progressbar"
import Textarea from "primevue/textarea"
import Toast from "primevue/toast"
import Toolbar from "primevue/toolbar"
import Tooltip from "primevue/tooltip"
/* PRIME VUE */

export const vueApp = createApp(App)
	.use(PrimeVue)
	.use(ConfirmationService)
	.use(ToastService)
	.use(router)
	.component("p-auto-complete", AutoComplete)
	.component("p-button", Button)
	.component("p-chip", Chip)
	.component("p-column", Column)
	.component("p-confirm-popup", ConfirmPopup)
	.component("p-data-table", DataTable)
	.component("p-data-view", DataView)
	.component("p-dialog", Dialog)
	.component("p-dropdown", Dropdown)
	.component("p-input-text", InputText)
	.component("p-menubar", Menubar)
	.component("p-password", Password)
	.component("p-progress-bar", ProgressBar)
	.component("p-textarea", Textarea)
	.component("p-toast", Toast)
	.component("p-toolbar", Toolbar)
	.component("fa", FontAwesomeIcon)
	.component("fa-layers", FontAwesomeLayers)
	.directive("tooltip", Tooltip)
	.mount("#app")