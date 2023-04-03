<template>
  <div v-if="file.progress === 100" class="fileblock">
    <span
      v-if="can_be_deleted"
      class="fileblock__deletebutton"
      @click="$emit('delete:file')"
      >(X)
    </span>

    <form-text-input
      v-if="is_rename_active"
      class="fileblock__input"
      :value="filename"
      @update="filename = $event"
    />
    <a
      v-else
      class="fileblock__link"
      href="#"
      :draggable="can_be_dragged"
      @dragstart="handle_drag_start($event)"
      @dragend="$emit('dragend:file')"
      @click="
        if (is_uploaded === true) {
          $emit('download:file', false);
        }
      "
    >
      {{ file.name }} ({{ file.formatted_size() }})</a
    >

    <span class="fileblock__linkbutton" @click="$emit('copy_link_to:file')"
      >&#128279;
    </span>

    <toggle-text-button
      v-if="can_be_renamed && filename.length > 0"
      class="fileblock__renamebutton"
      :class="{fileblock__renamebutton_red: is_rename_active}"
      activeTitle="Сохранить"
      passiveTitle="Переименовать"
      :isActive="is_rename_active"
      @click="handle_click_on_rename_button()"
    />
  </div>
  <span v-else class="fileblock__title"
    >{{ file.name }} ({{ file.formatted_size() }}){{ progress_str }}</span
  >
</template>

<script>
import { watch, ref, computed } from "vue";
import ToggleTextButton from "../buttons/ToggleTextButton.vue";
import FormTextInput from "../fields/FormTextInput.vue";
import { get_extension_of_file } from "../../logic/service_layer/utils/filename";

export default {
  name: "FileBlock",
  components: { ToggleTextButton, FormTextInput },
  props: {
    file: {
      type: Object,
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
    can_be_renamed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: [
    "delete:file",
    "dragstart:file",
    "dragend:file",
    "download:file",
    "copy_link_to:file",
    "rename:file",
    "rename:activated",
  ],

  setup(props, { emit }) {
    const progress_str = ref("");
    watch(
      () => props.file.progress,
      (newValue) => {
        progress_str.value = newValue < 100 ? ` (${newValue}%)` : "";
      }
    );

    const handle_drag_start = (evt) => {
      evt.dataTransfer.setData("text/plain", props.file.id);
      emit("dragstart:file");
    };

    const is_uploaded = computed(() => props.file.progress === 100);

    const ext = get_extension_of_file(props.file.name);
    const basename = ext
      ? props.file.name.substring(0, props.file.name.length - ext.length - 1)
      : props.file.name;

    const is_rename_active = ref(false);
    const filename = ref(basename);

    const handle_click_on_rename_button = () => {
      if (is_rename_active.value) {
        emit("rename:file", filename.value + (ext ? "." + ext : ""));
      } else {
        emit("rename:activated");
      }
      is_rename_active.value = !is_rename_active.value;
    };

    return {
      progress_str,
      handle_drag_start,
      is_uploaded,
      is_rename_active,
      filename,
      handle_click_on_rename_button,
    };
  },
};
</script>

<style>
.fileblock {
  display: flex;
  align-items: center;
}

.fileblock__deletebutton,
.fileblock__linkbutton {
  user-select: none;
  cursor: pointer;
}

.fileblock__linkbutton_rename {
  font-size: 20px;
}

.fileblock__renamebutton_red {
  color: red;
}

.fileblock__renamebutton_red:hover {
  color: red;
}
</style>