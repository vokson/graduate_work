// Стили для уведомлений
import "noty/lib/noty.css";
import "noty/lib/themes/relax.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App)
  .use(router)
  .mount(".app");
