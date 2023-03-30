<template>
  <div class="useritem">
    <form-text-field
      class="useritem__description"
      :value="obj.last_name + ' ' + obj.first_name + ' (' + obj.username + ')'"
    />
    <btn-component
      class="useritem__button"
      v-if="can_add"
      caption="Добавить"
      type="success"
      @click="$emit('add')"
    />
    <btn-component
      class="useritem__button"
      v-if="can_delete"
      caption="Удалить"
      type="danger"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
import FormTextField from "../fields/FormTextField.vue";
import BtnComponent from "../buttons/BtnComponent.vue";
export default {
  components: { FormTextField, BtnComponent },
  name: "UserItem",
  props: {
    obj: {
      type: Object,
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
.useritem {
  display: flex;
  align-items: center;
  padding: 3px;
}

.useritem__button {
  margin: 1px 5px;
}

.useritem__description {
  margin: 1px 5px;
  width: 260px;
}
</style>