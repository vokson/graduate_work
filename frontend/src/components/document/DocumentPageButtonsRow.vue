<template>
  <div class="documentpagebuttonsrow">
    <text-button
      class="documentpagebuttonsrow__button"
      title="Очистить"
      @click="$emit('reset:search')"
    />
    <toggle-text-button
      class="documentpagebuttonsrow__button"
      v-if="can_view_file"
      activeTitle="Скрыть файлы"
      passiveTitle="Показать файлы"
      :isActive="is_files_shown"
      @click="$emit('toggle:shownfiles')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      title="XLSX"
      @click="$emit('download:excel')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      title="JSON"
      @click="$emit('download:json')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      title="ZIP"
      @click="$emit('download:files_archive')"
    />
    <toggle-text-button
      class="documentpagebuttonsrow__button"
      v-if="is_folder_saved && can_change_doc"
      activeTitle="Режим просмотра"
      passiveTitle="Режим редактирования"
      :isActive="is_edit_mode"
      @click="$emit('toggle:editmode')"
    />
    <toggle-text-button
      class="documentpagebuttonsrow__button"
      v-if="!is_edit_mode"
      activeTitle="Скрыть настройки"
      passiveTitle="Настройка"
      :isActive="is_tuning_mode"
      @click="$emit('toggle:tuningmode')"
    />
    <toggle-text-button
      class="documentpagebuttonsrow__button"
      v-if="!is_edit_mode && group_by_settings !== null"
      :activeTitle="group_by_active_title"
      :passiveTitle="group_by_passive_title"
      :isActive="is_group_by_mode"
      @click="$emit('toggle:groupbymode')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="!is_edit_mode"
      title="В корзину"
      @click="$emit('to:cart')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="is_tuning_mode"
      title="Сбросить"
      @click="$emit('reset:tuning')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="is_edit_mode && can_add_doc"
      title="Новый документ"
      @click="$emit('new:doc')"
    />
    <text-button
      class="documentpagebuttonsrow__button documentpagebuttonsrow__button_red"
      v-if="!is_folder_saved && can_change_doc"
      title="Сохранить изменения"
      @click="$emit('save:docs')"
    />
    <text-button
      class="documentpagebuttonsrow__button documentpagebuttonsrow__button_red"
      v-if="is_edit_mode && can_delete_doc"
      title="Удалить"
      @click="$emit('delete:docs')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="is_edit_mode"
      title="Дублировать"
      @click="$emit('duplicate:docs')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="is_edit_mode && is_folder_saved && can_delete_file"
      title="Очистить контейнер с файлами"
      @click="$emit('flush:filecontainer')"
    />
    <text-button
      class="documentpagebuttonsrow__button"
      v-if="is_edit_mode && can_add_file"
      title="Распределить файлы"
      @click="$emit('allocate:files')"
    />
  </div>
</template>

<script>
import ToggleTextButton from "../buttons/ToggleTextButton.vue";
import TextButton from "../buttons/TextButton.vue";

export default {
  name: "DocumentPageButtonsRow",
  components: { ToggleTextButton, TextButton },
  props: {
    is_folder_saved: {
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
    can_add_doc: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_change_doc: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_delete_file: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_add_file: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_view_file: {
      type: Boolean,
      required: false,
      default: false,
    },
    can_delete_doc: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_tuning_mode: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_group_by_mode: {
      type: Boolean,
      required: false,
      default: false,
    },
    group_by_settings: {
      type: Object,
      required: false, // Разрешаем NULL
    },
  },
  emits: [
    "save:docs",
    "delete:docs",
    "duplicate:docs",
    "toggle:editmode",
    "toggle:tuningmode",
    "toggle:groupbymode",
    "toggle:shownfiles",
    "reset:search",
    "flush:filecontainer",
    "new:doc",
    "allocate:files",
    "reset:tuning",
    "download:excel",
    "download:json",
    "download:files_archive",
    "to:cart"
  ],
  setup(props) {
    const group_by_active_title =
      props.group_by_settings === null
        ? ""
        : props.group_by_settings.button_active_name;

    const group_by_passive_title =
      props.group_by_settings === null
        ? ""
        : props.group_by_settings.button_passive_name;

    return { group_by_active_title, group_by_passive_title };
  },
};
</script>
<style scoped>
.documentpagebuttonsrow {
  display: flex;
}

.documentpagebuttonsrow__button {
  user-select: none;
}

.documentpagebuttonsrow__button_red {
  color: red;
}
</style>