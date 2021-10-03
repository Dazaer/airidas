import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

export const vueApp = createApp(App).use(router).mount("#app");
