<template>
  <div
    class="filedropzone"
    @drop.prevent="handleDrop($event)"
    @dragover.prevent
    @dragenter.prevent="is_dragging = true"
    @dragleave.prevent="is_dragging = false"
  >
    <slot></slot>
  </div>
</template>

<script>
import { watch, ref } from "vue";

export default {
  name: "FileDropZone",
  props: {
    filename_pattern: {
      type: Object,
      required: false,
      default: () => /.*/,
    },
  },
  emits: ["add:file", "update:dragging", "wrong:filename"],

  setup(props, { emit }) {
    const is_dragging = ref(false);
    const regexp = new RegExp(props.filename_pattern);

    const handleDrop = (e) => {
      is_dragging.value = false;
      Array.prototype.forEach.call(e.dataTransfer.files, (file) => {
        if (file.name.toString().match(regexp))
          emit("add:file", file);
        else emit("wrong:filename", file.name.toString());
      });
    };

    watch(is_dragging, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        emit("update:dragging", newValue);
      }
    });

    return { handleDrop, is_dragging };
  },
};
</script>
