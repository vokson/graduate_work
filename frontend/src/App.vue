<template>
  <base-page />
</template>

<script>
import { provide } from "vue";
import BasePage from "./views/BasePage.vue";

export default {
  components: { BasePage },
  name: "App",
  setup() {
    provide("download_progress", {});
    provide("users", {});
    provide("tokens", {});

    provide("cdn_servers", {});
    provide("user_actions", {});
    provide("files", {});
  },
};
</script>
