<template>
  <div class="page">
    <heading-component
      class="page__heading"
      text="Распределенное хранение файлов"
      size="middle"
    />
    <div class="page__container">
      <div class="page__topcontainer">
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
        <div class="page__filecontainer">
          <file-drop-zone
            class="page__filedropzone"
            :class="{ page__filedropzone_dragging: is_drag_above_file_zone }"
            @add:file="handle_new_file_drop($event)"
            @update:dragging="is_drag_above_file_zone = $event"
          >
            <span v-if="!is_drag_above_file_zone" class="page__dropzonetitle">
              &lt; {{ max_file_size }} МБ</span
            >
          </file-drop-zone>
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
        <div class="page__filedownloadingcontainer">
          <form-text-field value="Файлы в процессе скачивания:"/>
          <file-list :files="downloading_files" :can_be_deleted="false" :can_be_dragged="false"/>
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

        <div v-for="file in files" :key="file.id" class="filerow">
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
import { ref, computed, onMounted, watch } from "vue";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import {
  GetCdnServers,
  GetFiles,
  GetFileServers,
  RefreshTokens,
  UploadFile,
  DeleteFile,
  DownloadFile,
} from "../logic/domain/command";
import { UploadFileTooBigError } from "../logic/domain/event";
import HeadingComponent from "../components/HeadingComponent.vue";
// import FileList from "../components/file/FileList.vue";
import FileDropZone from "../components/file/FileDropZone.vue";
import FileBlock from "../components/file/FileBlock.vue";
import FileList from "../components/file/FileList.vue";
import { MessageBus } from "../logic/service_layer/message_bus";

import FormTextField from "../components/fields/FormTextField.vue";
// import FolderTreeNode from "../components/folder/FolderTreeNode.vue";
// import ToggleTextButton from "../components/buttons/ToggleTextButton.vue";
import { useBeforeEnterPage } from "../logic/service_layer/use_modules";

export default {
  components: {
    HeadingComponent,
    FileBlock,
    FileDropZone,
    FileList,
    FormTextField,
    // FolderTreeNode,
    // FormTextInput,
    // ToggleTextButton,
  },
  name: "MainPage",

  setup() {
    const uow = new VueUnitOfWork();
    const max_file_size = 100; // MB

    // CDN SERVERS
    const servers = computed(() =>
      uow.cdn_server_repository.values().map((obj) => obj.value)
    );

    // FILES
    const files = computed(() =>
      uow.file_repository.values().map((obj) => obj.value)
    );

    const downloading_files = computed(() =>
      uow.download_progress.values().map((obj) => obj.value).filter(f => !f.uploaded)
    );

    watch(files, async (arr) => {
      arr.forEach(async (f) => {
        if (f.servers.length < servers.value.length)
          await MessageBus.handle(new GetFileServers(f.id), uow);
      });
    });

    // document
    //   .getElementById("file-input")
    //   .addEventListener("change", function (e) {
    //     if (e.target.files[0]) {
    //       document.body.append("You selected " + e.target.files[0].name);
    //     }
    //   });

    const handle_delete = async (id) => {
      await MessageBus.handle(new DeleteFile(id), uow);
    };

    const handle_download = async (id) => {
      await MessageBus.handle(new DownloadFile(id), uow);
    };

    // DRAGGING
    const is_drag_above_file_zone = ref(false);

    // DROP
    const handle_new_file_drop = async (file) => {
      console.log(file);
      let message = null;
      if (file.size > max_file_size * 1024 * 1024) {
        message = new UploadFileTooBigError(file.name);
      } else {
        message = new UploadFile(file);
      }
      await MessageBus.handle(message, uow);
    };

    // // DOWNLOAD
    // const downloading_files = computed(() =>
    //   uow.download_progress.values().map((obj) => obj.value)
    // );

    // const handle_download = async (file, inline) => {
    //   await MessageBus.handle(new DownloadShareFile(file.id, file.name, file.size, inline), uow);
    // };

    // const handle_copy_link_to_file_into_clipboard = (file) => {
    //   const props = router.resolve({
    //     name: "DownloadShareFilePage",
    //     params: { file_id: file.id },
    //   });

    //   navigator.clipboard
    //     .writeText(window.location.origin + props.href)
    //     .then(() => MessageBus.handle(new FileLinkCopied(), uow));
    // };

    // TIMERS
    const refresh_tokens = async () =>
      await MessageBus.handle(new RefreshTokens(), uow);

    uow.token_timer.set_callback(refresh_tokens);
    uow.token_timer.start();

    const get_files = async () => {
      // await MessageBus.handle(new GetFiles(), uow);
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
    });

    return {
      // USER
      user,

      // SERVER
      servers,

      // FILE
      files,
      downloading_files,
      max_file_size,
      is_drag_above_file_zone,
      handle_new_file_drop,
      handle_delete,
      handle_download,
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
  /* height: 100%; */
  max-width: 300px;
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
}

.page__filedownloadingcontainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
}

.filerow,
.filerowheader {
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
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
</style>
