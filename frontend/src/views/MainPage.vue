<template>
  <div class="page">
    <heading-component
      class="page__heading"
      text="Распределенное хранение файлов"
      size="middle"
    />
    <div class="page__container">
      <div class="page__form-backdrop" v-if="is_form_opened">
        <base-form
          class="page__form"
          :attributes="form_attributes"
          :settings="form_pages"
          @update="handle_update_form_attribute($event.name, $event.value)"
          @close="handle_form_close()"
          @apply="handle_form_apply()"
        >
        </base-form>
      </div>
      <div class="page__topcontainer">
        <div class="page__infocontainer">
          <div v-if="user" class="page__userinfo">
            <div class="page__userrow">
              <p class="page__userlabel">Имя пользователя:</p>
              <p class="page__uservalue">{{ user.username }}</p>
            </div>
            <div class="page__userrow">
              <p class="page__userlabel">E-mail:</p>
              <p class="page__uservalue">{{ user.email }}</p>
            </div>
            <div class="page__userrow">
              <p class="page__userlabel">Имя:</p>
              <p class="page__uservalue">{{ user.first_name }}</p>
            </div>
            <div class="page__userrow">
              <p class="page__userlabel">Фамилия:</p>
              <p class="page__uservalue">{{ user.last_name }}</p>
            </div>
            <div class="page__userrow">
              <p class="page__userlabel">Суперпользователь ?:</p>
              <p class="page__uservalue">
                {{ user.is_superuser ? "Да" : "Нет" }}
              </p>
            </div>
            <div class="page__userrow">
              <p class="page__userlabel">Разрешения:</p>
              <ul class="page__uservalue">
                <li v-for="perm in user.permissions" :key="perm">{{ perm }}</li>
              </ul>
            </div>
          </div>
          <div v-if="selected_file_id" class="page__fileinfo">
            <form-text-field
              value="Сменить имя файла"
              :parameters="{ font_weight: 600 }"
            />
            <form-text-input
              :value="selected_file_name"
              @update="selected_file_name = $event"
            />
            <btn-component
              или
              v-if="selected_file_name"
              class="fileinfo__button"
              caption="Применить"
              type="success"
              @click="handle_rename_file()"
            />
          </div>
        </div>
        <div class="page__filecontainer">
          <file-list
            :files="downloading_files"
            :can_be_deleted="false"
            или
            :can_be_dragged="false"
          />
          <file-drop-zone
            class="page__filedropzone"
            :class="{ page__filedropzone_dragging: is_drag_above_file_zone }"
            @add:file="handle_new_file_drop($event)"
            @update:dragging="is_drag_above_file_zone = $event"
          >
            <span v-if="!is_drag_above_file_zone" class="page__dropzonetitle">
              Drag&Drop &lt; {{ max_file_size }} МБ</span
            >
          </file-drop-zone>
          или
          <input
            type="file"
            id="file-input"
            multiple
            @change="
              Array.prototype.forEach.call($event.target.files, (f) =>
                handle_new_file_drop(f)
              )
            "
          />
        </div>
        <div class="page__historycontainer hystorycontainer">
          <form-text-field
            value="История действий пользователя:"
            :parameters="{ font_weight: 600 }"
          />
          <document-pagination-row
            :total_count="ua_total_count"
            :count_per_page="ua_count_per_page"
            :current_page="ua_current_page"
            :variants="ua_variants"
            @set:count_per_page="ua_select_count_per_page($event)"
            @select:page="ua_select_page($event)"
          />
          <div
            v-for="action in user_actions"
            :key="action.id"
            class="historycontainer__row history__row"
          >
            <div class="history__date">
              {{ action.created.toLocaleString() }}
            </div>
            <div class="history__text">{{ action.text }}</div>
          </div>
        </div>
        <div class="page__linkcontainer linkcontainer">
          <form-text-field
            value="Общедоступные ссылки (выберите файл):"
            :parameters="{ font_weight: 600 }"
          />
          <div
            v-for="link in share_links"
            :key="link.id"
            class="linkcontainer__row link__row"
          >
            <div class="link__delete" @click="handle_delete_link(link.id)" />
            <div class="link__date">
              {{ link.created.toLocaleString() }}
            </div>
            <div v-if="link.is_expired" class="link__text link__text_expired">
              Истекло время жизни ссылки
            </div>
            <div v-else class="link__text">
              <a :href="make_share_link_for_selected_file(link.id)">Ссылка</a
              >{{ link.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="page__middlecontainer">
        <div class="filerowheader">
          <div class="filerow__button" />
          <div class="filerow__name">Наименование</div>

          <div class="filerow__date">Создан</div>
          <div class="filerow__date">Изменен</div>

          <div
            v-for="server in servers"
            :key="server.id"
            class="filerow__server"
          >
            <p>{{ server.location }}</p>
            <p>Ш: {{ server.latitude }}</p>
            <p>Д: {{ server.longitude }}</p>
          </div>
        </div>

        <div
          v-for="file in files"
          :key="file.id"
          class="filerow"
          :class="{ filerow_selected: file.id === selected_file_id }"
        >
          <div class="filerow__selector">
            <form-boolean-input
              :value="file.id === selected_file_id"
              :parameters="{size: 26}"
              @click="handle_select_file(file.id, file.name)"
            />
          </div>
          <div class="filerow__button">
            <div
              class="filerow__img filerow__img_delete"
              @click="handle_delete(file.id)"
            />
          </div>

          <div class="filerow__name">
            <file-block
              :file="file"
              @download:file="handle_download(file.id)"
              @copy_link_to:file="handle_copy_link(file.id)"
            />
          </div>

          <div class="filerow__date">
            {{ file.created.toLocaleString() }}
          </div>

          <div class="filerow__date">
            {{ file.updated.toLocaleString() }}
          </div>

          <div
            v-for="server in servers"
            :key="server.name"
            class="filerow__server"
          >
            <div
              class="filerow__img"
              :class="{
                filerow__img_yes: file.names_of_servers.includes(server.name),
                filerow__img_no: !file.names_of_servers.includes(server.name),
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import {
  Notify,
  GetCdnServers,
  GetUserActions,
  GetFiles,
  GetFileServers,
  RefreshTokens,
  UploadFile,
  DeleteFile,
  DownloadFile,
  RenameFile,
  AddFileShareLink,
  GetFileShareLinks,
  FlushFileShareLinks,
  DeleteFileShareLink,
} from "../logic/domain/command";
import {
  UploadFileTooBigError,
  FileShareLinkCopied,
} from "../logic/domain/event";
import HeadingComponent from "../components/HeadingComponent.vue";
import DocumentPaginationRow from "../components/document/DocumentPaginationRow.vue";
import FileDropZone from "../components/file/FileDropZone.vue";
import FileBlock from "../components/file/FileBlock.vue";
import FileList from "../components/file/FileList.vue";
import { MessageBus } from "../logic/service_layer/message_bus";

import BaseForm from "../components/forms/BaseForm.vue";
import FormTextField from "../components/fields/FormTextField.vue";
import FormTextInput from "../components/fields/FormTextInput.vue";
import FormBooleanInput from "../components/fields/FormBooleanInput.vue";
import BtnComponent from "../components/buttons/BtnComponent.vue";
import { useBeforeEnterPage } from "../logic/service_layer/use_modules";

export default {
  components: {
    HeadingComponent,
    FileBlock,
    FileDropZone,
    FileList,
    FormTextField,
    FormTextInput,
    FormBooleanInput,
    DocumentPaginationRow,
    BaseForm,
    BtnComponent,
    // FolderTreeNode,
    // ToggleTextButton,
  },
  name: "MainPage",

  setup() {
    const router = useRouter();
    const uow = new VueUnitOfWork();
    const max_file_size = 100; // MB

    // CDN SERVERS
    const servers = computed(() =>
      uow.cdn_server_repository.values().map((obj) => obj.value)
    );

    // HISTORY
    const user_actions = computed(() =>
      uow.action_repository
        .values()
        .map((obj) => obj.value)
        .toSorted((a, b) => b.created - a.created)
    );
    const ua_total_count = uow.action_repository.get_count(); // Ref
    const ua_current_page = ref(1);
    const ua_count_per_page = ref(10);
    const ua_variants = ref([5, 10]);

    const ua_select_page = (page_num) => (ua_current_page.value = page_num);
    const ua_select_count_per_page = (page_size) =>
      (ua_count_per_page.value = page_size);

    watch([ua_current_page, ua_count_per_page], async () => {
      await refresh_actions();
    });

    const refresh_actions = async () =>
      await MessageBus.handle(
        new GetUserActions(ua_current_page.value, ua_count_per_page.value),
        uow
      );

    // FILES
    const files = computed(() =>
      uow.file_repository.values().map((obj) => obj.value)
    );

    const downloading_files = computed(() =>
      uow.download_progress
        .values()
        .map((obj) => obj.value)
        .filter((f) => !f.uploaded)
    );

    watch(files, async (arr) => {
      arr.forEach(async (f) => {
        if (f.servers.length < servers.value.length)
          await MessageBus.handle(new GetFileServers(f.id), uow);
      });
    });

    const handle_delete = async (id) => {
      await MessageBus.handle(new DeleteFile(id), uow);
      selected_file_id.value = null
      selected_file_name.value = ''
      await refresh_actions();
    };

    const handle_download = async (id) => {
      await MessageBus.handle(new DownloadFile(id), uow);
      await refresh_actions();
    };

    const selected_file_id = ref(null);
    const selected_file_name = ref("");

    const handle_select_file = async (id, name) => {
      selected_file_id.value = id;
      selected_file_name.value = name;
      await MessageBus.handle(new GetFileShareLinks(id), uow);
    };

    const handle_rename_file = async () => {
      await MessageBus.handle(
        new RenameFile(selected_file_id.value, selected_file_name.value),
        uow
      );
      await refresh_actions();
    };

    // DRAGGING
    const is_drag_above_file_zone = ref(false);

    // DROP
    const handle_new_file_drop = async (file) => {
      let message = null;
      if (file.size > max_file_size * 1024 * 1024) {
        message = new UploadFileTooBigError(file.name);
      } else {
        message = new UploadFile(file);
      }
      await MessageBus.handle(message, uow);
      await refresh_actions();
    };

    // SHARE LINKS
    const share_links = computed(() => {
      let links = uow.link_repository
        .values()
        .map((obj) => obj.value)
        .toSorted((a, b) => b.created - a.created);
      return links;
    });

    const make_share_link = (file_id, link_id) => {
      const props = router.resolve({
        name: "DownloadFilePage",
        params: {
          file_id: file_id,
          link_id: link_id,
        },
      });

      return window.location.origin + props.href;
    };

    const make_share_link_for_selected_file = (link_id) =>
      make_share_link(selected_file_id.value, link_id);

    const handle_copy_link_into_clipboard = (file_id, link_id) => {
      const url = make_share_link(file_id, link_id);

      if (navigator.clipboard)
        navigator.clipboard
          .writeText(url)
          .then(() => MessageBus.handle(new FileShareLinkCopied(), uow));
      else console.log(url);
    };

    const handle_delete_link = async (link_id) => {
      await MessageBus.handle(
        new DeleteFileShareLink(selected_file_id.value, link_id),
        uow
      );
      await MessageBus.handle(new FlushFileShareLinks(), uow);
    };

    // FORM
    const is_form_opened = ref(false);
    const form_attributes = reactive({
      FILE_ID: null,
      LIFETIME: "0",
      PASSWORD: "",
    });

    const handle_copy_link = (file_id) => {
      handle_update_form_attribute("FILE_ID", file_id);
      selected_file_id.value = file_id;
      is_form_opened.value = true;
    };

    const handle_form_close = () => {
      is_form_opened.value = false;
    };

    const handle_form_apply = async () => {
      const file_id = form_attributes["FILE_ID"];
      let lifetime = Number.parseInt(form_attributes["LIFETIME"]);
      let password = form_attributes["PASSWORD"];

      if (!password) password = null;

      if (isNaN(lifetime) || lifetime < 0) {
        await MessageBus.handle(
          new Notify("error", "Время жизни должно быть целым числом"),
          uow
        );
        return;
      }

      if (lifetime === 0) {
        lifetime = null;
      } else {
        lifetime *= 60;
      }

      is_form_opened.value = false;
      const results = await MessageBus.handle(
        new AddFileShareLink(file_id, lifetime, password),
        uow
      );
      const link = results[0];
      handle_copy_link_into_clipboard(file_id, link.id);
      await refresh_actions();
    };

    const handle_update_form_attribute = (name, value) =>
      (form_attributes[name] = value);

    const form_pages = [
      {
        size: 400,
        name: "Создание ссылки",
        fields: [
          {
            type: "FormTextField",
            parameters: {
              font_weight: "bold",
            },
            value: "Время жизни ссылки в минутах (0 - бессрочно):",
          },
          {
            type: "FormTextInput",
            bind: "LIFETIME",
          },
          {
            type: "FormTextField",
            parameters: {
              font_weight: "bold",
            },
            value: "Пароль:",
          },
          {
            type: "FormTextInput",
            bind: "PASSWORD",
          },
        ],
      },
    ];

    // TIMERS
    const refresh_tokens = async () =>
      await MessageBus.handle(new RefreshTokens(), uow);

    uow.token_timer.set_callback(refresh_tokens);
    uow.token_timer.start();

    const get_files = async () => {
      files.value.forEach(async (f) => {
        if (f.servers.length < servers.value.length)
          await MessageBus.handle(new GetFileServers(f.id), uow);
      });
    };

    uow.get_files_timer.set_callback(get_files);
    uow.get_files_timer.start();

    const user = uow.user_repository.get_current(); // Ref

    onMounted(async () => {
      await useBeforeEnterPage(uow, []);
      await MessageBus.handle(new GetCdnServers(), uow);
      await MessageBus.handle(new GetFiles(), uow);
      await refresh_actions();
    });

    return {
      // USER
      user,

      // USER ACTIONS
      user_actions,
      ua_total_count,
      ua_current_page,
      ua_count_per_page,
      ua_variants,
      ua_select_page,
      ua_select_count_per_page,

      // SERVER
      servers,

      // FILE
      files,
      selected_file_id,
      selected_file_name,
      handle_select_file,
      downloading_files,
      max_file_size,
      is_drag_above_file_zone,
      handle_new_file_drop,
      handle_delete,
      handle_download,
      handle_copy_link,
      handle_rename_file,

      // FORM
      is_form_opened,
      form_pages,
      form_attributes,
      handle_update_form_attribute,
      handle_form_apply,
      handle_form_close,

      // SHARE LINK
      share_links,
      make_share_link,
      make_share_link_for_selected_file,
      handle_copy_link_into_clipboard,
      handle_delete_link,
    };
  },
};
</script>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding-left: 60px;
  padding-right: 60px;
}

.page__heading {
  padding-top: 60px;
  padding-bottom: 15px;
}
.page__container {
  display: flex;
  flex-direction: column;
  /* max-width: 1000px; */
}

.page__topcontainer {
  display: flex;
  width: 100%;
  align-items: stretch;
}

.page__userinfo {
  display: flex;
  flex-direction: column;
}

.page__userrow {
  display: flex;
  width: 100%;
  padding: 3px;
}

.page__userlabel {
  min-width: 200px;
  font-weight: 500;
}
.page__uservalue {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.page__filedropzone {
  width: 100%;
  max-width: 300px;
  max-height: 200px;
  border: 2px dashed grey;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin: 5px;
}

.page__filedropzone_dragging {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}

.page__dropzonetitle {
  font-size: 24px;
}

.page__middlecontainer {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.page__filecontainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  min-height: 300px;
}

.page__historycontainer,
.page__linkcontainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
}

.page__historycontainer {
  flex-grow: 1;
}

.page__linkcontainer {
  min-width: 450px;
  max-width: 450px;
}

.filerow,
.filerowheader {
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
}

.filerow {
  cursor: pointer;
}

.filerow_selected {
  background-color: lightgray !important;
}

.filerowheader {
  font-weight: 600;
  text-align: center;
}

.filerow:nth-child(odd) {
  background-color: lightyellow;
}

.filerow:nth-child(even) {
  background-color: rgb(215, 242, 255);
}

.filerow__name {
  flex-grow: 1;
  padding-left: 5px;
  padding-right: 5px;
}

.filerow__button {
  min-width: 30px;
  max-width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filerow__selector {
  min-width: 30px;
  max-width: 30px;
}

.filerow__server {
  min-width: 150px;
  max-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filerow__date {
  min-width: 100px;
  max-width: 100px;
  text-align: center;
}

.filerow__img {
  min-width: 26px;
  max-width: 26px;
  min-height: 26px;
  max-height: 26px;
}

.filerow__img_yes {
  background: url("../../public/check.png") top left/26px 26px no-repeat;
}

.filerow__img_no {
  background: url("../../public/cancel.png") top left/26px 26px no-repeat;
}

.filerow__img_delete {
  background: url("../../public/delete.png") top left/26px 26px no-repeat;
  cursor: pointer;
}

.history__row,
.link__row {
  display: flex;
}

.history__date,
.link__date {
  min-width: 150px;
}

.history__text,
.link__text {
  margin-left: 20px;
  flex-grow: 1;
  flex-wrap: wrap;
}

.link__text_expired {
  text-decoration: line-through;
}

.link__delete {
  background: url("../../public/delete.png") top left/20px 20px no-repeat;
  cursor: pointer;
  min-width: 20px;
  max-width: 20px;
  margin-right: 5px;
}

.page__form-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.page__form {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  padding: 20px;
  border-radius: 10px;
}

.filerowdescription {
  text-align: end;
}

.page__infocontainer {
  display: flex;
  flex-direction: column;
}

.page__fileinfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.fileinfo__button {
  margin-top: 5px;
}
</style>
