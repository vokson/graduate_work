<template>
  <div
    class="documentattributerow"
    :class="{ documentattributerow_modified: is_highlighted }"
  >
    <sized-div
      v-if="is_selection_required"
      class="documentattributerow__sizedblock_center"
      size="w30"
    >
      <form-boolean-input
        class="documentattributerow__checkbox"
        :value="is_selected"
        :parameters="{ size: 20 }"
        @click="$emit('select:doc')"
      />
    </sized-div>
    <sized-div
      v-if="has_link"
      class="documentattributerow__sizedblock_center"
      size="w30"
    >
      <router-link class="documentattributerow__href" :to="link_route_obj">
        <form-text-field class="documentattributerow__textfield" value="@" />
      </router-link>
    </sized-div>

    <sized-div
      v-for="block in search_schema"
      :key="block.name"
      class="documentattributerow__sizedblock"
      :size="block.size"
      :grow="block.grow"
    >
      <form-text-input
        v-if="is_edit_mode && !block.name.toLowerCase().includes('date')"
        class="documentattributerow__textinput"
        :value="attributes[block.name]"
        :parameters="{
          is_disabled: get_bool_attribute(block.is_disabled) || is_disabled,
          default: block.default,
        }"
        @update="
          $emit('update:doc', { id: id, name: block.name, value: $event })
        "
      />
      <form-date-input
        v-if="is_edit_mode && block.name.toLowerCase().includes('date')"
        class="documentattributerow__dateinput"
        :value="attributes[block.name]"
        :parameters="{
          is_disabled: get_bool_attribute(block.is_disabled) || is_disabled,
          default:
            block.default === undefined || block.default === null
              ? Math.round(Date.now() / 1000)
              : block.default,
        }"
        @update="
          $emit('update:doc', { id: id, name: block.name, value: $event })
        "
      />
      <form-text-field
        v-if="!is_edit_mode"
        class="documentattributerow__textfield"
        :value="attributes[block.name]"
        :parameters="{
          align: block.align ? block.align : 'center',
          default: block.default,
        }"
      />
    </sized-div>
  </div>
</template>

<script>
import SizedDiv from "../SizedDiv.vue";
import FormTextField from "../fields/FormTextField.vue";
import FormTextInput from "../fields/FormTextInput.vue";
import FormDateInput from "../fields/FormDateInput.vue";
import FormBooleanInput from "../fields/FormBooleanInput.vue";

export default {
  components: {
    SizedDiv,
    FormTextField,
    FormTextInput,
    FormDateInput,
    FormBooleanInput,
  },
  name: "DocumentAttributeRow",
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
    is_selection_required: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_selected: {
      type: Boolean,
      required: false,
      default: false,
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
    has_link: {
      type: Boolean,
      required: false,
      default: false,
    },
    link_route_obj: {
      type: Object,
    },
  },
  emits: ["update:doc", "select:doc"],
  setup() {
    const get_bool_attribute = (value) => {
      return value === true ? true : false;
    };

    return {
      get_bool_attribute,
    };
  },
};
</script>
<style scoped>
.documentattributerow {
  display: flex;
}
.documentattributerow__sizedblock_center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.documentattributerow__checkbox {
  min-width: 20px;
  max-width: 20px;
  min-height: 20px;
  max-height: 20px;
}

.documentattributerow__textfield {
  flex-grow: 1;
  padding: 3px;
  box-sizing: border-box;
}

.documentattributerow__href {
  flex-grow: 1;
  text-decoration: none;
}

.documentattributerow__textinput,
.documentattributerow__dateinput {
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
  box-sizing: border-box;
}

.documentattributerow__textinput {
  padding: 3px;
}

.documentattributerow__dateinput {
  margin: 3px;
}

.documentattributerow_modified {
  border: 2px solid orange;
}

.documentattributerow_blocked {
  border: 2px solid red;
}
</style>