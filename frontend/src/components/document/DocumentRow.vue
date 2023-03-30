<template>
  <div
    class="documentrow"
    @drop.prevent="handle_drop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <document-buttons-row
      class="documentrow__documentbuttonsrow"
      v-if="is_edit_mode"
      :is_deleted="doc.is_deleted"
      @recover:doc="$emit('recover:doc')"
    />
    <document-attribute-row
      class="documentrow__documentattributerow"
      v-if="!doc.is_deleted"
      :id="doc.id"
      :search_schema="search_schema"
      :attributes="is_edit_mode === true ? doc.raw_attributes : doc.attributes"
      :is_selection_required="true"
      :is_selected="is_selected"
      :is_edit_mode="is_edit_mode"
      :is_highlighted="!doc.is_saved"
      :is_disabled="doc.is_blocked"
      :has_link="has_link"
      :link_route_obj="link_route_obj"
      @update:doc="$emit('update:doc', $event)"
      @select:doc="$emit('select:doc')"
      @click="handle_click_attributerow"
    />
    <document-files-row
      class="documentrow__documentfilesrow"
      v-if="is_files_shown && !doc.is_deleted"
      :files="doc.files"
      :can_be_deleted="is_edit_mode && !doc.is_blocked"
      :can_be_dragged="is_edit_mode && !doc.is_blocked"
      :is_blocked="doc.is_blocked"
      @delete:file="$emit('delete:file', $event)"
      @download:file="$emit('download:file', $event)"
      @copy_link_to:file="$emit('copy_link_to:file', $event)"
    />
    <document-errors-row
      class="documentrow__documenterrorsrow"
      v-if="is_edit_mode && !doc.is_deleted"
      :errors="doc.errors"
    />
  </div>
</template>

<script>
import DocumentAttributeRow from "./DocumentAttributeRow.vue";
import DocumentButtonsRow from "./DocumentButtonsRow.vue";
import DocumentErrorsRow from "./DocumentErrorsRow.vue";
import DocumentFilesRow from "./DocumentFilesRow.vue";
export default {
  name: "DocumentRow",
  components: {
    DocumentAttributeRow,
    DocumentButtonsRow,
    DocumentFilesRow,
    DocumentErrorsRow,
  },
  props: {
    doc: {
      type: Object,
      required: true,
    },
    search_schema: {
      type: Array,
      required: true,
    },
    is_selected: {
      type: Boolean,
      required: true,
    },
    is_edit_mode: {
      type: Boolean,
      required: true,
    },
    is_files_shown: {
      type: Boolean,
      required: true,
    },
    is_dragging: {
      type: Boolean,
      required: false,
      default: false,
    },
    has_link: {
      type: Boolean,
      required: true,
    },
    link_route_obj: {
      type: Object,
      required: true,
    },
  },
  emits: [
    "update:doc",
    "delete:doc",
    "duplicate:doc",
    "recover:doc",
    "select:doc",
    "delete:file",
    "attach:file",
    "download:file",
    "copy_link_to:file",
    "click:attributerow",
  ],
  setup(props, { emit }) {
    const handle_drop = (evt) => {
      const file_id = evt.dataTransfer.getData("text");
      emit("attach:file", file_id);
    };

    const handle_click_attributerow = () => {
      if (!props.is_edit_mode) emit("click:attributerow");
    };

    return { handle_drop, handle_click_attributerow };
  },
};
</script>

<style scoped>
.documentrow {
  display: flex;
  flex-direction: column;
}

.documentrow__dropzone {
  display: flex;
  min-height: 50px;
  border: 2px dashed lightcoral;
  align-items: stretch;
}

.documentrow__dropzonetitle {
  flex-grow: 1;
  font-size: 24px;
  text-align: center;
}
</style>