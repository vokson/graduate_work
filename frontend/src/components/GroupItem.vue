<template>
  <div class="groupitem">
    <form-text-field
      class="groupitem__description"
      :value="description"
    />
    <btn-component
      class="groupitem__button"
      v-if="can_add"
      caption="Добавить"
      type="success"
      @click="$emit('add')"
    />
    <btn-component
      class="groupitem__button"
      v-if="can_delete"
      caption="Удалить"
      type="danger"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
import FormTextField from "./fields/FormTextField.vue";
import BtnComponent from "./buttons/BtnComponent.vue";
export default {
  components: { FormTextField, BtnComponent },
  name: "GroupItem",
  props: {
    description: {
      type: String,
      required: true,
    },
    can_delete: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_add: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["delete", "add"],
};
</script>

<style>
.groupitem {
  display: flex;
  align-items: center;
  padding: 3px;
}

.groupitem__button {
  margin: 1px 5px;
}

.groupitem__description {
  margin: 1px 5px;
  width: 260px;
}
</style>