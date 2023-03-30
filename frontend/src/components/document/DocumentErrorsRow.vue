<template>
  <div class="documenterrorsrow">
    <form-text-field
      class="documenterrorsrow__text"
      v-for="(error, index) in errors"
      :key="index"
      :value="(index+1).toString() + ') ' + error"
    />
  </div>
</template>

<script>
import FormTextField from "../fields/FormTextField.vue";

export default {
  components: { FormTextField },
  name: "DocumentErrorsRow",
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.documenterrorsrow {
  display: flex;
  flex-direction: column;
  color: red;
  padding: 3px;
}
</style>