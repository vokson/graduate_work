<template>
  <div class="userfoldersetting">
    <form-text-field
      class="userfoldersetting__folder"
      :value="obj.folder_id.toString()"
    />
    <form-text-field
      class="userfoldersetting__usergroup"
      :value="obj.usergroup_slug"
    />
    <form-text-field
      class="userfoldersetting__username"
      :value="obj.username"
    />
    <form-select-input
      class="userfoldersetting__role"
      :value="obj.role === null ? '__NULL__' : obj.role"
      :parameters="{
        options: role_options,
        is_disabled: !can_change,
      }"
      @update="
        $emit('save:role', {
          folder_id: obj.folder_id,
          username: obj.username,
          id: obj.id,
          role: $event === '__NULL__' ? null : $event,
        })
      "
    />
    <btn-component
      class="userfoldersetting__deletebutton"
      v-if="can_delete"
      caption="Удалить"
      type="danger"
      @click="
        $emit('delete:role', {
          folder_id: obj.folder_id,
          username: obj.username,
          id: obj.id,
        })
      "
    />
    <form-text-field
      class="userfoldersetting__searchschema"
      :value="obj.search_schema ? 'СХЕМА ЕСТЬ' : 'СХЕМЫ НЕТ'"
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
  name: "UserFolderSetting",
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
  emits: ["delete:role", "save:role"],

  setup(props) {
    const role_options = computed(() => {
      let arr = props.role_variants.map((e) => {
        return { name: e, value: e };
      });
      arr.push({ name: "Не установлена", value: "__NULL__" });
      return arr;
    });

    return { role_options };
  },
};
</script>

<style>
.userfoldersetting {
  display: flex;
  padding: 3px;
}

.userfoldersetting__folder,
.userfoldersetting__username,
.userfoldersetting__role,
.userfoldersetting__searchschema {
  margin: 1px 5px;
}

.userfoldersetting__folder {
  width: 100px;
}

.userfoldersetting__usergroup {
  width: 300px;
}

.userfoldersetting__username {
  width: 150px;
}

.userfoldersetting__role {
  width: 150px;
}

.userfoldersetting__searchschema {
  width: 50px;
  text-align: center;
}
</style>