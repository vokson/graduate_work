<template>
  <div class="formemailaddressfield">
    <form-text-field
      v-if="to"
      class="formemailaddressfield__label"
      :parameters="{ font_weight: 'bold' }"
      value="Кому:"
    />
    <form-text-field
      v-if="to"
      class="formemailaddressfield__address"
      :value="convert(to)"
    />
    <form-text-field
      v-if="cc"
      class="formemailaddressfield__label"
      :parameters="{ font_weight: 'bold' }"
      value="Копия:"
    />
    <form-text-field
      v-if="cc"
      class="formemailaddressfield__address"
      :value="convert(cc)"
    />
    <form-text-field
      v-if="bcc"
      class="formemailaddressfield__label"
      :parameters="{ font_weight: 'bold' }"
      value="Скрытая копия:"
    />
    <form-text-field
      v-if="bcc"
      class="formemailaddressfield__address"
      :value="convert(bcc)"
    />
  </div>
</template>

<script>
import { computed } from "vue";
import FormTextField from "./FormTextField.vue";

export default {
  name: "FormEmailToAddressField",
  components: {
    FormTextField,
  },
  props: {
    parameters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    value: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const address = computed(() => props.value || { TO: "", CC: "", BCC: "" });
    const to = computed(() => address.value["TO"]);
    const cc = computed(() => address.value["CC"]);
    const bcc = computed(() => address.value["BCC"]);

    const convert = (text) => text.split(" ").join("; ");

    return {
      to,
      cc,
      bcc,
      convert,
    };
  },
};
</script>

<style scoped>
.formemailaddressfield {
  display: flex;
  flex-direction: column;
}
</style>
