import "./assets/main.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret, faDoorOpen, faUser } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faDoorOpen, faUser);

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(router).mount("#app");
