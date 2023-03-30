<template>
  <div class="formhtmlfield" :style="{ height: height.toString() + 'px' }">
    <iframe class="formhtmlfield__iframe" :srcdoc="value"> </iframe>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormHtmlField",

  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      required: true,
    },
  },

  setup(props) {
    const height = computed(() => props.parameters["height"] || 500);
    return { height };
  },
};
</script>

<style>
.formhtmlfield {
  display: flex;
  width: 100%;
}

.formhtmlfield__iframe {
  flex-grow: 1;
  border: none;
}
</style>