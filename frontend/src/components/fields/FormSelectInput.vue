<template>
    <select
      class="formselectinput"
      :disabled="is_disabled"
      :size="size.toString()"
      @input="handle_choose_value($event.target.value)"
    >
      <option
        v-for="(option, index) in parameters.options"
        :selected="value !== undefined && value !== null && option.value === value"
        :key="option.value"
        :value="index"
      >
        {{ option.name }}
      </option>
    </select>
</template>

<script>
import { computed } from "vue";

export default {
  name: "FormSelectInput",
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      required: false,
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const default_value = props.parameters["default"] || "";
    if ((props.value === undefined || props.value === null) && default_value) {
      emit("update", default_value);
    }


    const size = computed(() => props.parameters["size"] || 1);
    const is_disabled = computed(() => props.parameters["is_disabled"] || false);

    const handle_choose_value = (str_index) => {
      emit('update', props.parameters.options[parseInt(str_index)].value)
    }

    return { size, is_disabled, handle_choose_value };
  },
};
</script>

<style scoped>
.formselectinput {
  width: 100%;
}
</style>