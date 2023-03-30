<template>
  <div class="formfilteredselectinput">
    <form-select-input
      class="formfilteredselectinput__target"
      :parameters="{
        options: parameters.options,
        is_disabled: is_disabled,
      }"
      :value="value"
      @mousedown="handle_click_on_target($event)"
    />
    <form-text-input
      v-if="!is_selected"
      class="formfilteredselectinput__search"
      :parameters="{
        placeholder: placeholder,
        height: 30
      }"
      :value="query"
      @update="query = $event"
    />
    <form-select-input
      v-if="!is_selected"
      class="formfilteredselectinput__list"
      :parameters="{
        options: filtered_options,
        size: size,
      }"
      :value="value"
      @update="
        $emit('update', $event);
        is_selected = !is_selected;
      "
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";

import FormTextInput from "./FormTextInput.vue";
import FormSelectInput from "./FormSelectInput.vue";

export default {
  name: "FormFilteredSelectInput",
  components: {
    FormTextInput,
    FormSelectInput,
  },
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

    const size = computed(() => props.parameters["size"] || 3);
    const is_disabled = computed(
      () => props.parameters["is_disabled"] || false
    );
    const placeholder = computed(() => props.parameters["placeholder"] || "");

    const is_selected = ref(true);
    const query = ref("");

    const filtered_options = computed(() =>
      props.parameters.options.filter((obj) =>
        obj.name.toUpperCase().includes(query.value.toUpperCase())
      )
    );

    const handle_click_on_target = (e) => {
      e.preventDefault();
      if (is_disabled.value === true) return;
      is_selected.value = !is_selected.value;
    };

    return {
      size,
      is_disabled,
      placeholder,
      is_selected,
      query,
      filtered_options,
      handle_click_on_target,
    };
  },
};
</script>

<style scoped>
.formfilteredselectinput {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>