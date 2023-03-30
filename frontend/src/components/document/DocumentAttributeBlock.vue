<template>
  <div
    class="documentattributeblock"
    :class="{ documentattributeblock_modified: is_highlighted }"
  >
    <div
      v-for="block in search_schema"
      :key="block.name"
      class="documentattributeblock__row"
    >
      <div class="documentattributeblock__labelcontainer">
        <form-text-field
          class="documentattributeblock__textfield"
          :value="block.description + ':'"
        />
      </div>
      <div class="documentattributeblock__valuecontainer">
        <form-text-input
          v-if="is_edit_mode && !block.name.toLowerCase().includes('date')"
          class="documentattributeblock__textinput"
          :value="get_str_attribute(attributes[block.name], block.default)"
          :parameters="{
            is_disabled: get_bool_attribute(block.is_disabled) || is_disabled,
          }"
          @update="
            $emit('update:doc', { id: id, name: block.name, value: $event })
          "
        />
        <form-date-input
          v-if="is_edit_mode && block.name.toLowerCase().includes('date')"
          class="documentattributeblock__dateinput"
          :parameters="{
            is_disabled: get_bool_attribute(block.is_disabled) || is_disabled,
          }"
          :value="attributes[block.name]"
          @update="
            $emit('update:doc', { id: id, name: block.name, value: $event })
          "
        />
        <form-text-field
          v-if="!is_edit_mode"
          class="documentattributeblock__textfield"
          :value="get_str_attribute(attributes[block.name], block.default)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormTextField from "../fields/FormTextField.vue";
import FormTextInput from "../fields/FormTextInput.vue";
import FormDateInput from "../fields/FormDateInput.vue";
export default {
  components: { FormTextField, FormTextInput, FormDateInput },
  name: "DocumentAttributeBlock",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    search_schema: {
      type: Array,
      required: true,
    },
    attributes: {
      type: Object,
      required: true,
    },
    is_edit_mode: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_highlighted: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:doc"],
  setup() {
    const get_str_attribute = (value, default_value) => {
      const str_default_value = default_value ? default_value : "";
      return value !== undefined && value !== null ? value : str_default_value;
    };

    const get_bool_attribute = (value) => {
      return value === true ? true : false;
    };
    return { get_str_attribute, get_bool_attribute };
  },
};
</script>
<style scoped>
.documentattributeblock {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.documentattributeblock__row {
  display: flex;
  padding: 1px;
}

.documentattributeblock__labelcontainer {
  display: flex;
  min-width: 150px;
  font-weight: 500;
}

.documentattributeblock__valuecontainer {
  display: flex;
  flex-grow: 1;
}

.documentattributeblock__textinput {
  width: 100%;
}
</style>