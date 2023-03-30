<template>
  <input
    class="formdateinput"
    type="date"
    :value="date_str"
    @input="handle_update_date($event)"
    :disabled="is_disabled"
  />
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormDateInput",
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: Number,
      required: false,
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const default_value = props.parameters["default"] || 0;

    if (props.value === undefined || props.value === null)
      emit("update", default_value);

    const is_disabled = props.parameters["is_disabled"] || false;

    const date_str = computed(() => {
      const date = new Date((props.value || default_value) * 1000);
      return date.toISOString().slice(0, 10);
    });

    const handle_update_date = (evt) =>
      emit("update", Math.floor(evt.target.valueAsNumber / 1000) || 0);

    return { date_str, is_disabled, handle_update_date };
  },
};
</script>
