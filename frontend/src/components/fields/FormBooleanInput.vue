<template>
  <div class="formbooleaninput">
    <input
      class="booleaninput"
      :style="style"
      type="checkbox"
      :title="hint"
      :checked="value"
      :disabled="is_disabled"
      @change="$emit('update', $event.target.checked)"
    />
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormBooleanInput",
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const default_value = props.parameters["default"] || false;
    if (props.value === undefined || props.value === null)
      emit("update", default_value);

    const size = computed(() => props.parameters["size"] || 0);
    const style = computed(() =>
      size.value == 0
        ? {}
        : {
            "min-width": size.value.toString() + "px",
            "max-width": size.value.toString() + "px",
            "min-height": size.value.toString() + "px",
            "max-height": size.value.toString() + "px",
          }
    );

    const hint = computed(() => props.parameters["hint"] || "");
    const is_disabled = computed(
      () => props.parameters["is_disabled"] || false
    );

    return { size, hint, is_disabled, style };
  },
};
</script>

<style scoped>
.formbooleaninput {
  display: flex;
  flex-direction: column;
}

.booleaninput {
  margin: 0;
  /* min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%; */
  box-sizing: border-box;
}
</style>