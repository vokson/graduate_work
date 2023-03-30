<template>
  <div class="documentfilesrow">
    <form-text-field class="documentfilesrow__textfield" :value="value"/>
  </div>
</template>

<script>
import FormTextField from './fields/FormTextField.vue';

export default {
  components: { FormTextField },
  name: "ListMessageRow",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
.listmessagerow {
  display: flex;
}
</style>