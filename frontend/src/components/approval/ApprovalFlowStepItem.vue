<template>
  <div
    class="approvalflowstepitem"
    :draggable="can_be_dragged"
    @dragstart="handle_drag_start($event)"
    @dragend="$emit('dragend')"
    @click="handle_delete()"
  >
    <div
      v-if="state"
      class="approvalflowstepitem__state"
      :class="{
        approvalflowstepitem__state_approved: state === 'APPROVED',
        approvalflowstepitem__state_rejected: state === 'REJECTED',
        approvalflowstepitem__state_waiting: state === 'NONE',
      }"
      title="Статус согласования"
    />
    <div class="approvalflowstepitem__text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "ApprovalFlowStepItem",
  props: {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      validator: (value) => ["APPROVED", "REJECTED", "NONE"].includes(value),
    },
    can_be_deleted: {
      type: Boolean,
      required: true,
    },
    can_be_dragged: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["delete", "dragstart", "dragend"],
  setup(props, { emit }) {
    const handle_drag_start = (evt) => {
      evt.dataTransfer.setData("text/plain", props.id);
      emit("dragstart");
    };

    const handle_delete = () => {
      if (!props.can_be_deleted) return;
      emit("delete");
    };

    return { handle_drag_start, handle_delete };
  },
};
</script>

<style scoped>
.approvalflowstepitem {
  display: flex;
  padding: 3px;
  border: 1px solid black;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  user-select: none;
}

.approvalflowstepitem__state {
  min-width: 26px;
  min-height: 26px;
  max-width: 26px;
  max-height: 26px;
  margin: 3px;
  transition: all 0.25s;
}

.approvalflowstepitem__text {
  flex-grow: 1;
}

.approvalflowstepitem__state_waiting {
  background: url("../../../public/question.png") top left/26px 26px no-repeat;
}

.approvalflowstepitem__state_approved {
  background: url("../../../public/check.png") top left/26px 26px no-repeat;
}

.approvalflowstepitem__state_rejected {
  background: url("../../../public/cancel.png") top left/26px 26px no-repeat;
}
</style>