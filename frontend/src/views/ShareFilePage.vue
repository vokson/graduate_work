<template>
  <div class="page">
    <heading-component class="page__heading" text="Файлообменник" size="middle" />
    <div class="page__container">
      <div class="page__servicecontainer">
        <document-page-download-progress-row
          class="page__downloadprogress"
          :files="downloading_files"
          :full_format="false"
        />
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
          :files="share_files"
          :can_be_dragged="false"
          :can_be_deleted="true"
          @download:file="handle_download(...$event)"
          @delete:file="handle_delete($event)"
          @copy_link_to:file="handle_copy_link_to_file_into_clipboard($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useBeforeEnterPage } from "../../logic/service_layer/use_modules";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import { MessageBus } from "../../logic/service_layer/message_bus";
import HeadingComponent from "../../components/HeadingComponent.vue";
import FileDropZone from "../../components/file/FileDropZone.vue";
import FileList from "../../components/file/FileList.vue";
import {
  GetShareFiles,
  UploadFile,
  // DeleteShareFile,
  // DownloadShareFile,
  // UpdateUploadProgress,
} from "../../logic/domain/command";
// import { FileLinkCopied } from "../../logic/domain/event";
import DocumentPageDownloadProgressRow from "../../components/document/DocumentPageDownloadProgressRow.vue";

import { UploadFileTooBigError } from "../../logic/domain/event";

export default {
  components: {
    HeadingComponent,
    FileDropZone,
    FileList,
    DocumentPageDownloadProgressRow,
  },
  name: "ShareFilePage",
  setup() {
    const router = useRouter();
    const uow = new VueUnitOfWork();
    const max_file_size = 1024; // MB

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

    onMounted(async () => {
      await useBeforeEnterPage(uow, ["can_view_service"]); // Пытаемся автоматически зaлогинится
      // Получаем список документов с сервера
      await MessageBus.handle(new GetShareFiles(), uow);
    });

    onBeforeUnmount(async () => uow.upload_progress_timer.stop());

    return {
      max_file_size,
      handle_new_file_drop,
      handle_delete,
      handle_download,
      handle_copy_link_to_file_into_clipboard,
      is_drag_above_file_zone,
      share_files,
      downloading_files,
    };
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  padding-left: 60px;
}

.page__heading {
  padding-top: 60px;
  padding-bottom: 15px;
}

.page__container {
  display: flex;
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