<template>
  <div
    class="approvalflowstep"
    @drop.prevent="handle_drop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="approvalflowstep__row">
      <form-text-field class="approvalflowstep__index" :value="id.toString()" />
      <div class="approvalflowstep__container">
        <approval-flow-step-item
          class="approvalflowstep__item"
          v-for="(item, index) in items"
          :key="index"
          :id="item.id"
          :text="item.text"
          :can_be_deleted="can_be_modified"
          :can_be_dragged="false"
          :state="states[item.id]"
          @delete="$emit('delete:item', item.id)"
        />
        <div class="approvalflowstep__emptyblock" v-if="items.length == 0" />
      </div>
      <div
        v-if="can_be_modified"
        class="approvalflowstep__button approvalflowstep__button_delete"
        title="Удалить шаг потока"
        @click="$emit('delete:step')"
      />
    </div>
  </div>
</template>

<script>
import ApprovalFlowStepItem from "./ApprovalFlowStepItem.vue";
import FormTextField from "../fields/FormTextField.vue";
export default {
  components: { ApprovalFlowStepItem, FormTextField },
  name: "ApprovalFlowStep",
  props: {
    id: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    states: {
      type: Object,
      required: true,
    },
    can_be_modified: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["delete:step", "delete:item", "attach"],

  setup(props, { emit }) {
    const handle_drop = (evt) => {
      const id = evt.dataTransfer.getData("text");
      emit("attach", id);
    };

    return { handle_drop };
  },
};
</script>

<style scoped>
.approvalflowstep {
  display: flex;
  flex-direction: column;
}

.approvalflowstep__row {
  display: flex;
  min-height: 30px;
  border: 2px dashed grey;
  border-radius: 5px;
  align-items: center;
}

.approvalflowstep__container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.approvalflowstep__index {
  /* background-color: lightgreen; */
  padding: 5px 10px 5px 10px;
  font-weight: 500;
  font-size: 20px;
  min-width: 35px;
  /* border-right: 1px solid black; */
}

.approvalflowstep__emptyblock {
  flex-grow: 1;
}

.approvalflowstep__item {
  flex-grow: 1;
  margin: 3px;
}

.approvalflowstep__button {
  transition: all 0.25s;
  cursor: pointer;
  margin: 5px;
  min-height: 26px;
  min-width: 26px;
}

.approvalflowstep__button:hover {
  transform: rotate(30deg);
}

.approvalflowstep__button_delete {
  background: url("../../../public/delete.png") top left/26px 26px no-repeat;
}
</style>