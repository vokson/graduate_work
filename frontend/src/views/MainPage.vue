<template>
  <div class="page">
    <heading-component
      class="page__heading"
      text="Распределенное хранение файлов"
      size="middle"
    />
    <div class="page__container">
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
        r  <p class="page__userlabel">Имя:</p>
          <p class="page__uservalue">{{ user.first_name }}</p>
        </div>
        <div class="page__userrow">
          <p class="page__userlabel">Фамилия:</p>
          <p class="page__uservalue">{{ user.last_name }}</p>
        </div>
        <div class="page__userrow">
          <p class="page__userlabel">Суперпользователь ?:</p>
          <p class="page__uservalue">{{ user.is_superuser ? "Да" : "Нет" }}</p>
        </div>
        <div class="page__userrow">
          <p class="page__userlabel">Разрешения:</p>
          <ul class="page__uservalue">
            <li v-for="perm in user.permissions" :key="perm">{{ perm }}</li>
          </ul>
        </div>
      </div>
      <div class="page__servicecontainer">
        <!-- <document-page-download-progress-row
          class="page__downloadprogress"
          :files="downloading_files"
          :full_format="false"
        /> -->
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
        <file-list
          class="page__filelist"
          :files="files"
          :can_be_dragged="false"
          :can_be_deleted="true"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { ref, computed, onMounted } from "vue";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import { GetCdnServers, RefreshTokens, UploadFile } from "../logic/domain/command";
import { UploadFileTooBigError } from "../logic/domain/event";
import HeadingComponent from "../components/HeadingComponent.vue";
import FileList from "../components/file/FileList.vue";
import FileDropZone from "../components/file/FileDropZone.vue";
import { MessageBus } from "../logic/service_layer/message_bus";

// import FormTextField from "../components/fields/FormTextField.vue";
// import FolderTreeNode from "../components/folder/FolderTreeNode.vue";
// import ToggleTextButton from "../components/buttons/ToggleTextButton.vue";
import { useBeforeEnterPage } from "../logic/service_layer/use_modules";

export default {
  components: {
    HeadingComponent,
    FileList,
    FileDropZone,
    // FormTextField,
    // FolderTreeNode,
    // FormTextInput,
    // ToggleTextButton,
  },
  name: "FoldersPage",

  setup() {
    const uow = new VueUnitOfWork();
    const max_file_size = 100; // MB

    const refresh_tokens = async () =>
      await MessageBus.handle(new RefreshTokens(), uow);

    uow.token_timer.start(refresh_tokens);

    // PDF FILE DOCUMENTS
    const files = computed(() =>
      uow.file_repository.values().map((obj) => obj.value)
    );

    // DRAGGING
    const is_drag_above_file_zone = ref(false);

    // DROP
    const handle_new_file_drop = async (file) => {
      let message = null;
      if (file.size > max_file_size * 1024 * 1024) {
        message = new UploadFileTooBigError(file.name);
      } else {
        message = new UploadFile(uuidv4(), file);
      }
      await MessageBus.handle(message, uow);
    };

    // // DELETE
    // const handle_delete = async (id) => {
    //   await MessageBus.handle(new DeleteShareFile(id), uow);
    // };

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
    // const update_upload_progress = () => {
    //   MessageBus.handle(new UpdateUploadProgress(), uow);
    // };

    // uow.upload_progress_timer.set_callback(update_upload_progress);
    // uow.upload_progress_timer.start();


    const user = uow.user_repository.get_current(); // Ref

    onMounted(async () => {
      await useBeforeEnterPage(uow, []);
      await MessageBus.handle(new GetCdnServers(), uow);
    });

    return {
      // usergroup_id,
      // folders,
      // query,
      user,
      max_file_size,
      files,
      is_drag_above_file_zone,
      handle_new_file_drop,
      // is_all_expanded,
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
}

.page__userinfo {
  display: flex;
  flex-direction: column;
  min-width: 300px;
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

.page__servicecontainer {
  display: flex;
  flex-direction: column;
  min-width: 500px;
  max-width: 500px;
  padding: 3px;
}

.page__filedropzone {
  height: 80px;
  border: 2px dashed grey;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
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

</style>
