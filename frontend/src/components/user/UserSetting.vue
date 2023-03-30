<template>
  <div class="usersetting">
    <form-text-field class="usersetting__lastname" :value="obj.last_name" />
    <form-text-field class="usersetting__firstname" :value="obj.first_name" />
    <form-text-field class="usersetting__username" :value="obj.username" />
    <form-select-input
      class="usersetting__role"
      :value="obj.role"
      :parameters="{
        options: role_options,
        is_disabled: !can_change,
      }"
      @update="
        $emit('save:user', {
          username: obj.username,
          is_active: obj.is_active,
          role: $event,
          role_inside_group: obj.role_inside_group,
          role_outside_group: obj.role_outside_group,
        })
      "
    />
    <form-select-input
      class="usersetting__role"
      :value="obj.role_inside_group"
      :parameters="{
        options: role_options,
        is_disabled: !can_change,
      }"
      @update="
        $emit('save:user', {
          username: obj.username,
          is_active: obj.is_active,
          role: obj.role,
          role_inside_group: $event,
          role_outside_group: obj.role_outside_group,
        })
      "
    />
    <form-select-input
      class="usersetting__role"
      :value="obj.role_outside_group"
      :parameters="{
        options: role_options,
        is_disabled: !can_change,
      }"
      @update="
        $emit('save:user', {
          username: obj.username,
          is_active: obj.is_active,
          role: obj.role,
          role_inside_group: obj.role_inside_group,
          role_outside_group: $event,
        })
      "
    />
    <input
      type="checkbox"
      class="usersetting__isactive"
      :checked="obj.is_active"
      :disabled="!can_change"
      @change="
        $emit('save:user', {
          username: obj.username,
          is_active: $event.target.checked,
          role: obj.role,
          role_inside_group: obj.role_inside_group,
          role_outside_group: obj.role_outside_group,
        })
      "
    />
    <btn-component
      class="usersetting__deletebutton"
      v-if="can_delete"
      caption="Удалить"
      type="danger"
      @click="
        $emit('delete:user', {
          username: obj.username,
        })
      "
    />
  </div>
</template>

<script>
import { computed } from "vue";
import FormSelectInput from "../fields/FormSelectInput.vue";
import FormTextField from "../fields/FormTextField.vue";
import BtnComponent from "../buttons/BtnComponent.vue";
export default {
  components: { FormTextField, FormSelectInput, BtnComponent },
  name: "UserSetting",
  props: {
    obj: {
      type: Object,
      required: true,
    },
    role_variants: {
      type: Array,
      required: true,
    },
    can_delete: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_change: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["delete:user", "save:user"],

  setup(props) {
    const role_options = computed(() =>
      props.role_variants.map((e) => {
        return { name: e, value: e };
      })
    );

    return { role_options };
  },
};
</script>

<style>
.usersetting {
  display: flex;
  align-items: center;
  padding: 3px;
}

.usersetting__firstname,
.usersetting__lastname,
.usersetting__username,
.usersetting__role {
  margin: 1px 5px;
}

.usersetting__username,
.usersetting__firstname,
.usersetting__lastname {
  width: 150px;
}

.usersetting__role {
  width: 150px;
}

.usersetting__isactive {
  width: 50px;
}
</style>