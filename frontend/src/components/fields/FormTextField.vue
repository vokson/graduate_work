<template>
  <div
    class="formtextfield"
    :style="{ 'text-align': align, 'font-weight': font_weight }"
    :title="hint"
  >
    {{ value }}
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormTextField",

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
    const align = computed(() => props.parameters["align"] || "left");
    const font_weight = computed(
      () => props.parameters["font_weight"] || "normal"
    );
    const hint = computed(() => props.parameters["hint"] || "");

    return { align, font_weight, hint };
  },
};
</script>

<style>
.formtextfield {
  display: block;
}
</style>