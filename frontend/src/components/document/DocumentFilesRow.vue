<template>
  <div class="documentfilesrow">
    <div
      class="documentfilesrow__fileblock"
      v-for="file in files"
      :key="file.id"
    >
      <file-block
        class="documentfilesrow__file"
        :file="file"
        :can_be_deleted="can_be_deleted"
        :can_be_dragged="can_be_dragged"
        @delete:file="$emit('delete:file', file.id)"
        @download:file="$emit('download:file', [file, $event])"
        @copy_link_to:file="$emit('copy_link_to:file', file)"
      />
    </div>
  </div>
</template>

<script>
import FileBlock from "../file/FileBlock.vue";

export default {
  components: { FileBlock },
  name: "DocumentFilesRow",
  props: {
    files: {
      type: Array,
      required: true,
    },
    can_be_deleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_be_dragged: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["delete:file", "download:file", "copy_link_to:file"],
};
</script>
<style scoped>
.documentfilesrow {
  display: flex;
  flex-wrap: wrap;
}
.documentfilesrow__fileblock {
  padding: 5px;
}
</style>