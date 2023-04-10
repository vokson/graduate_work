<template>
  <div class="formhiddeninput"></div>
</template>

<script>
import { computed, watch } from "vue";
import { evaluate_pattern } from "../../logic/domain/model";

export default {
  name: "FormHiddenInput",
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    // ALLOWED CONTEXT EXPLANATION
    // 1. ATTRIBUTES
    //      Object (key, value), which can be user to generate VALUE
    context: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      required: false,
      default: "",
    },
  },

  emits: ["update"],

  setup(props, { emit }) {
    const pattern = computed(() => props.parameters["pattern"] || "");

    const evaluated_value = computed(() => {
      if (pattern.value || props.context["ATTRIBUTES"])
        try {
          return evaluate_pattern(pattern, props.context["ATTRIBUTES"], false);
        } catch (e) {
          console.log(
            `Error during evaluation of FormHiddenInput with ` +
              `pattern "${pattern.value}" and attributes "${props.context["ATTRIBUTES"]}"`
          );
        }

      return null;
    });

    if (evaluated_value.value && props.value != evaluated_value.value) {
      emit("update", evaluated_value.value);
    }

    watch(evaluated_value, (newValue) => {
      if (newValue && props.value != newValue) emit("update", newValue);
    });

    const default_value = props.parameters["default"] || "";
    // Эмитируем даже "", чтобы была возможность инициализировать атрибут
    // через скрытое поле
    if (!props.value && !evaluated_value.value) emit("update", default_value);

    return { pattern, evaluated_value, default_value };
  },
};
</script>