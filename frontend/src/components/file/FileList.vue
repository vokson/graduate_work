<template>
  <div class="filelist">
    <file-block
      class="filelist__fileblock"
      v-for="file in files"
      :key="file.id"
      :file="file"
      :can_be_dragged="can_be_dragged"
      :can_be_deleted="can_be_deleted"
      :can_be_renamed="can_be_renamed"
      @dragstart:file="$emit('dragstart:file')"
      @dragend="$emit('dragend:file')"
      @download:file="$emit('download:file', [file, $event])"
      @delete:file="$emit('delete:file', file.id)"
      @rename:file="$emit('rename:file', [file.id, $event])"
      @rename:activated="$emit('rename:activated', file.id)"
      @copy_link_to:file="$emit('copy_link_to:file', file)"
      >{{ file.name }}
    </file-block>
  </div>
</template>

<script>
import FileBlock from "./FileBlock.vue";

export default {
  components: { FileBlock },
  name: "FileList",
  props: {
    files: {
      type: Array,
      required: true,
    },
    can_be_dragged: {
      type: Boolean,
      required: true,
    },
    can_be_deleted: {
      type: Boolean,
      required: true,
    },
    can_be_renamed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "dragstart:file",
    "dragend:file",
    "download:file",
    "delete:file",
    "rename:file",
    "rename:activated",
    "copy_link_to:file",
  ],
};
</script>
<style scoped>
.filelist {
  display: flex;
  flex-direction: column;
}
.filelist__fileblock {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>