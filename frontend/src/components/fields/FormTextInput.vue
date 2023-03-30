<template>
  <div class="formtextinput">
    <input
      class="textinput"
      :style="style"
      :type="secure === true ? 'password' : 'text'"
      :value="value"
      :placeholder="placeholder"
      :disabled="is_disabled"
      @input="$emit('update', $event.target.value)"
    />
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormTextInput",
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: String,
      required: false,
      // default: "",
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const default_value = props.parameters["default"] || "";
    if (props.value === undefined || props.value === null)
      emit("update", default_value);

    const height = computed(() => props.parameters["height"] || 0);
    const style = computed(() =>
      height.value == 0
        ? { color: color.value }
        : {
            color: color.value,
            "min-height": height.value.toString() + "px",
            "max-height": height.value.toString() + "px",
          }
    );

    const placeholder = computed(() => props.parameters["placeholder"] || "");
    const secure = computed(() => props.parameters["secure"] || false);
    const is_disabled = computed(
      () => props.parameters["is_disabled"] || false
    );
    const color = computed(() => props.parameters["color"] || "black");

    return { placeholder, secure, is_disabled, color, style };
  },
};
</script>

<style scoped>
.formtextinput {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.textinput {
  box-sizing: border-box;
}
</style>
