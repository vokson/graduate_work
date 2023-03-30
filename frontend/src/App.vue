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
    // provide("info", {});
    provide("users", {});
    provide("tokens", {});

    // provide("permissions", {});
    provide("files", {});
  },
};
</script>
