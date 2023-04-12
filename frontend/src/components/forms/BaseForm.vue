<template>
    <div
      class="baseform"
      :style="{width: form_width.toString() + 'px'}"
    >
      <div class="baseform-header" v-if="is_header_required">
        <div class="baseform-header__pagenum">{{ page_index + 1 }}.</div>
        <div class="baseform-header__name">{{ page_name }}</div>
        <div
          class="baseform-header__button baseform-header__button_left"
          title="Предыдущая страница"
          v-if="page_index > 0"
          @click="page_index = Math.max(0, page_index - 1)"
        />
        <div
          class="baseform-header__button baseform-header__button_right"
          title="Следующая страница"
          v-if="page_index < page_count - 1"
          @click="page_index = Math.min(page_index + 1, page_count - 1)"
        />
        <div
          class="baseform-header__button baseform-header__button_apply"
          title="Сохранить"
          @click="$emit('apply')"
        />
        <div
          class="baseform-header__button baseform-header__button_close"
          title="Закрыть"
          @click="$emit('close')"
        />
      </div>
      <div class="baseform-body">
        <component
          class="baseform-body__field"
          v-for="(field, index) in page_fields"
          :is="field.type"
          :key="page_index.toString() + '|' + field.type + '|' + index.toString()"
          :parameters="field.parameters"
          :context="make_field_context(field)"
          :value="field.value ? field.value : attributes[field.bind]"
          @update="
            if (field.bind) {
              $emit('update', { name: field.bind, value: $event });
            }
          "
        >
          {{ attributes }}
        </component>
      </div>
    </div>
</template>

<script>
import { ref, computed } from "vue";

import FormTextField from "../fields/FormTextField.vue";
import FormBooleanInput from "../fields/FormBooleanInput.vue";
import FormTextInput from "../fields/FormTextInput.vue";

export default {
  name: "BaseForm",
  components: {
    FormTextField,
    FormBooleanInput,
    FormTextInput,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
    context: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    attributes: {
      type: Object,
      required: true,
    },
    is_header_required: {
      type:Boolean,
      required: false,
      default: true
    }
  },
  emits: ["apply", "close", "update"],

  setup(props) {
    // PAGE
    const page_index = ref(0);
    const page_count = computed(() => props.settings.length);

    const page_settings = computed(
      () => props.settings[page_index.value]
    );

    // GEOMETRY
    const form_width = computed(
      () => page_settings.value["size"] || "w500"
    );
    const page_name = computed(
      () => page_settings.value["name"] || ""
    );

    // FIELDS
    const page_fields = computed(() => page_settings.value["fields"] || []);

    // CONTEXT
    const make_field_context = (field) => {
      if (!field.bind_context) return {};

      let result = {};
      Object.keys(field.bind_context).forEach(
        (key) => (result[key] = props.context[field.bind_context[key]])
      );

      return result;
    };

    return {
      // PAGE
      page_settings,
      page_index,
      page_count,
      page_name,

      // GEOMETRY
      form_width,

      // FIELDS
      page_fields,

      // CONTEXT
      make_field_context,
    };
  },
};
</script>

<style scoped>
.baseform {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.baseform-header {
  display: flex;
  height: 33px;
  border-bottom: 1px solid black;
  align-items: center;
}

.baseform-header__pagenum {
  font-size: 20px;
  padding: 3px;
}

.baseform-header__name {
  font-size: 20px;
  padding: 3px;
  flex-grow: 1;
}

.baseform-header__button {
  min-width: 30px;
  min-height: 30px;
  padding: 3px;
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  color: lightcoral;
}

.baseform-header__button:hover {
  mask-image: linear-gradient(rgba(0, 0, 0, 1), transparent, rgba(0, 0, 0, 1));
}

.baseform-header__button_left {
  background: url("../../../public/left.png") center center/24px 24px no-repeat;
}

.baseform-header__button_right {
  background: url("../../../public/right.png") center center/24px 24px no-repeat;
}

.baseform-header__button_apply {
  background: url("../../../public/check.png") center center/24px 24px
    no-repeat;
}

.baseform-header__button_close {
  background: url("../../../public/cancel.png") center center/24px 24px
    no-repeat;
}

.baseform-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.baseform-body__field {
  margin: 3px 0px;
}
</style>