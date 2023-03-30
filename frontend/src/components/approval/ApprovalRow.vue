<template>
  <div class="approvalrow">
    <div class="approvalrow__infoblock">
      <div
        class="approvalrow__state"
        :class="{
          approvalrow__state_approved: obj.state === 'APPROVED',
          approvalrow__state_rejected: obj.state === 'REJECTED',
          approvalrow__state_delegated: obj.state === 'DELEGATED',
          approvalrow__state_waiting: obj.state === 'NONE',
        }"
        title="Статус согласования"
      />
      <form-text-field
        class="approvalrow__user"
        :value="
          obj.to_last_name +
          ' ' +
          obj.to_first_name +
          ' (' +
          obj.to_username +
          ')'
        "
      />
      <form-text-field class="approvalrow__request" value="по запросу" />
      <form-text-field
        class="approvalrow__user"
        :value="
          obj.from_last_name +
          ' ' +
          obj.from_first_name +
          ' (' +
          obj.from_username +
          ')'
        "
      />
      <form-text-field
        class="approvalrow__date"
        :value="convertDateToDateTimeString(obj.updated_at)"
      />
      <div
        class="approvalrow__delete"
        :class="{
          approvalrow__delete_active: can_be_deleted === true,
          approvalrow__delete_passive: can_be_deleted === false,
        }"
        title="Удалить строку"
        @click="handle_delete_action()"
      />
    </div>
    <div class="approvalrow__fileblock">
      <file-block
        class="approvalrow__file"
        v-for="file in obj.files"
        :key="file.id"
        :file="file"
        :can_be_deleted="false"
        :can_be_dragged="false"
        @delete:file="$emit('delete:file', file.id)"
        @download:file="$emit('download:file', [file, $event])"
        @copy_link_to:file="$emit('copy_link_to:file', file)"
      />
    </div>
  </div>
</template>

<script>
import FormTextField from "../fields/FormTextField.vue";
import FileBlock from "../file/FileBlock.vue";
import { convertDateToDateTimeString } from "../../logic/service_layer/use_modules";
export default {
  components: { FormTextField, FileBlock },
  name: "ApprovalRow",
  props: {
    obj: {
      type: Object,
      required: true,
    },
    can_be_deleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "delete:approval",
    "delete:file",
    "download:file",
    "copy_link_to:file",
  ],
  setup(props, { emit }) {
    const handle_delete_action = () => {
      if (props.can_be_deleted === true) emit("delete:approval");
    };
    return { convertDateToDateTimeString, handle_delete_action };
  },
};
</script>
<style scoped>
.approvalrow {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
}

.approvalrow__infoblock {
  display: flex;
  min-height: 30px
}

.approvalrow__fileblock {
  display: flex;
  flex-wrap: wrap;
}

.approvalrow__file {
  padding: 1px;
}

.approvalrow__state,
.approvalrow__delete {
  min-width: 26px;
  min-height: 26px;
  max-width: 26px;
  max-height: 26px;
  margin: 3px;
  transition: all 0.25s;
}

.approvalrow__state_waiting {
  background: url("../../../public/question.png") top left/26px 26px no-repeat;
}

.approvalrow__state_approved {
  background: url("../../../public/check.png") top left/26px 26px no-repeat;
}

.approvalrow__state_rejected {
  background: url("../../../public/cancel.png") top left/26px 26px no-repeat;
}

.approvalrow__state_delegated {
  background: url("../../../public/right-arrow.png") top left/26px 26px no-repeat;
}

.approvalrow__delete_active:hover {
  transform: rotate(30deg);
}

.approvalrow__delete_active {
  cursor: pointer;
  background: url("../../../public/delete.png") top left/26px 26px no-repeat;
}

.approvalrow__delete_passive {
  background: url("../../../public/delete.png") top left/26px 26px no-repeat;
  filter: grayscale(100%);
}

.approvalrow__id {
  min-width: 50px;
  padding: 3px;
}

.approvalrow__user {
  flex-grow: 1;
  padding: 3px;
}

.approvalrow__request {
  min-width: 100px;
  padding: 3px;
}

.approvalrow__date {
  min-width: 100px;
  padding: 3px;
}
</style>