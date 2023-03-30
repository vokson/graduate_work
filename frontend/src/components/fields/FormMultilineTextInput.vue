<template>
  <div class="form-multiline-text-input">
    <textarea
      class="multiline-text-input"
      :style="{ color: color, resize: resize}"
      :disabled="is_disabled"
      :rows="rows"
      v-model="text"
      @input="$emit('update', $event.target.value)"
      ></textarea
    >
  </div>
</template>

<script>
import { ref, watch, computed} from "vue";

export default {
  name: "FormMultilineTextInput",
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
    // if (!props.value) emit("update", default_value);
    if (props.value === undefined || props.value === null)
      emit("update", default_value);


    const rows = computed(() => props.parameters["rows"] || 10);
    const is_disabled = computed(() => props.parameters["is_disabled"] || false);
    const color = computed(() => props.parameters["color"] || 'black');
    const resize = computed(() => props.parameters["resize"] || 'none');

    const text = ref("")
    watch(() => props.value, (newValue) => text.value = newValue);

    return { rows, is_disabled, color, resize, text};
  },
};
</script>

<style scoped>
.form-multiline-text-input {
  display: flex;
  flex-direction: column;
  width: 100%;
}

</style>
