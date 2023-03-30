<template>
  <div class="documentpagesearchrow">
    <sized-div
      v-if="is_selection_required"
      class="documentpagesearchrow__sizedblock"
      size="w30"
    >
      <form-boolean-input
        class="documentpagesearchrow__input"
        :value="is_all_selected"
        :parameters="{ size: 30 }"
        @update="$emit('selectall:docs')"
      />
    </sized-div>

    <sized-div
      class="documentpagesearchrow__sizedblock"
      size="w30"
      v-if="required_space_for_link"
    >
    </sized-div>

    <sized-div
      v-for="block in search_schema"
      :key="block.name"
      class="documentpagesearchrow__sizedblock"
      :size="block.size"
      :grow="block.grow"
    >
      <component
        class="documentpagesearchrow__input"
        v-for="field in block.fields"
        :key="field"
        :is="get_component_name(field)"
        :value="get_query_value(block, field)"
        :parameters="get_parameters(block, field)"
        @keyup.enter="emit_search_event()"
        @update="set_query_value(block, field, $event)"
      />

      <tuning-item
        class="documentpagesearchrow__tuningitem"
        v-if="is_tuning_mode"
        :size="block.size"
        :grow="block.grow"
        @change:size="$emit('change:size', { name: block.name, value: $event })"
        @change:grow="$emit('change:grow', { name: block.name, value: $event })"
        @delete:field="$emit('delete:field', block.name)"
      />
    </sized-div>
  </div>
</template>

<script>
import { reactive, watch, computed } from "vue";
import { useDataEncode } from "../../logic/service_layer/use_modules";
import SizedDiv from "../SizedDiv.vue";
import FormTextInput from "../fields/FormTextInput.vue";
import FormSelectInput from "../fields/FormSelectInput.vue";
import FormFilteredSelectInput from "../fields/FormFilteredSelectInput.vue";
import FormBooleanInput from "../fields/FormBooleanInput.vue";
import TuningItem from "./TuningItem.vue";
export default {
  name: "DocumentPageSearchRow",
  components: {
    SizedDiv,
    FormTextInput,
    FormSelectInput,
    FormFilteredSelectInput,
    TuningItem,
    FormBooleanInput,
  },
  props: {
    search_schema: {
      type: Object,
      required: true,
    },
    is_disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_clean_required: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_tuning_mode: {
      type: Boolean,
      required: false,
      default: false,
    },
    required_space_for_link: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_selection_required: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_all_selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    should_emit_search_event_on_any_keypress: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "search:docs",
    "selectall:docs",
    "clean:query",
    "change:size",
    "change:grow",
    "delete:field",
  ],

  setup(props, { emit }) {
    const query = reactive({});

    const get_query_key = (name, rule) => {
      return name + "__" + rule;
    };

    const encoded_query = computed(() => {
      const result = {};
      Object.keys(query).forEach((key) => {
        const property = query[key];
        const converter = property.converter ? property.converter : null;
        let value = property.value;

        // Проверяем правильность введенных данных на
        // на соответствие регулярному выражению
        if (property.re)
          if (is_pattern_valid(property.re, property.value) === false)
            value = "";

        result[key] =
          value === "" ? value : useDataEncode(value, property.rule, converter);
      });
      return result;
    });

    const get_initial_value = (type) => {
      if (type === "bool") return false;
      return "";
    };

    const reset_query = () => {
      // Заполняем объект запроса пустыми полями,
      // чтобы правильно работала реактивность валидации
      props.search_schema.forEach((block) => {
        block.fields.forEach((field) => {
          query[get_query_key(block.name, field.rule)] = {
            type: field.type,
            name: block.name,
            rule: field.rule,
            re: field.re,
            converter: field.converter,
            value: get_initial_value(field.type),
          };
        });
      });
    };

    const is_pattern_valid = (regexp_str, str) => {
      return String.prototype.match.call(str, new RegExp(regexp_str)) !== null;
    };

    watch(
      () => props.is_clean_required,
      (newValue) => {
        if (newValue === true) {
          reset_query();
          emit("clean:query");
        }
      }
    );

    reset_query();

    // SEACRH EVENT

    const emit_search_event = () => emit("search:docs", encoded_query.value);

    // COMPONENT
    const get_component_name = (field) => {
      if (field.type === "bool") return "FormBooleanInput";
      if (field.type === "select") return "FormSelectInput";
      if (field.type === "filtered_select") return "FormFilteredSelectInput";
      return "FormTextInput";
    };

    const get_query_item = (block, field) =>
      query[get_query_key(block.name, field.rule)];

    const get_query_value = (block, field) =>
      get_query_item(block, field)["value"];

    const set_query_value = (block, field, value) => {
      get_query_item(block, field)["value"] = value;
      if (props.should_emit_search_event_on_any_keypress) emit_search_event();
    };

    const get_parameters = (block, field) => {
      if (field.type === "bool") return boolean_input_parameters(field);

      if (["select", "filtered_select"].includes(field.type))
        return select_input_parameters(field);

      return text_input_parameters(block, field);
    };

    const text_input_parameters = (block, field) => {
      return {
        color: !is_pattern_valid(
          get_query_item(block, field)["re"],
          get_query_item(block, field)["value"]
        )
          ? "red"
          : "",

        placeholder: field.placeholder,
        is_disabled: props.is_disabled,
        height: 30,
      };
    };

    const boolean_input_parameters = (field) => {
      return {
        hint: field.placeholder,
        is_disabled: props.is_disabled,
        size: 28,
      };
    };

    const select_input_parameters = (field) => {
      return {
        hint: field.placeholder,
        is_disabled: props.is_disabled,
        options: field.options,
      };
    };

    return {
      query,
      encoded_query,
      get_query_key,
      is_pattern_valid,

      // GETTERS
      get_component_name,
      get_parameters,
      get_query_value,
      set_query_value,

      // EVENT
      emit_search_event,
    };
  },
};
</script>
<style scoped>
.documentpagesearchrow {
  display: flex;
}

.documentpagesearchrow__sizedblock {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.documentpagesearchrow__input {
  min-height: 30px;
  max-height: 30px;
  padding: 0px 1px;
  box-sizing: border-box;
}
</style>