import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueToast from "vue-toast-notification";

// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import "vue-toast-notification/dist/theme-bootstrap.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import CoreuiVue from "@coreui/vue";
import CIcon from "@coreui/icons-vue";
import { iconsSet as icons } from "@/assets/icons";

library.add(fas);

const app = createApp(App);
app.use(store);
// Set up Axios and configure the base URL
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API + "",
});

app.config.globalProperties.$axios = axiosInstance;
// Use the router instance
app.use(router);
app.use(CoreuiVue);
app.use(VueToast, {
  // One of the options
  position: "top",
});
app.provide("icons", icons);
app.component("CIcon", CIcon);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
