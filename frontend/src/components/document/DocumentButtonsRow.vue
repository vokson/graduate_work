<template>
  <div class="documentbuttonsrow" v-if="is_deleted">
    <text-button
      class="documentbuttonsrow__button"
      title="Восстановить"
      @click="$emit('recover:doc')"
    />
    <form-text-field
      class="documentbuttonsrow__deletedmessage"
      value="ДОКУМЕНТ УДАЛЕН"
    />
  </div>
</template>

<script>
import FormTextField from "../fields/FormTextField.vue";
import TextButton from "../buttons/TextButton.vue";

export default {
  name: "DocumentButtonsRow",
  components: { FormTextField, TextButton },
  props: {
    is_deleted: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["recover:doc"],
};
</script>
<style scoped>
.documentbuttonsrow {
  display: flex;
}

.documentbuttonsrow__button {
  user-select: none;
}

.documentbuttonsrow__deletedmessage {
  user-select: none;
  color: red;
}
</style>