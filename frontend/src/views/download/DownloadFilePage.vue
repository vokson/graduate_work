<template>
  <div class="page">
    <document-page-download-progress-row
      class="page__downloadprogress"
      :files="downloading_files"
      :full_format="true"
    />
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { onMounted, computed } from "vue";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import { GetFileInfo } from "../../logic/domain/command";
import { MessageBus } from "../../logic/service_layer/message_bus";
import DocumentPageDownloadProgressRow from "../../components/document/DocumentPageDownloadProgressRow.vue";

export default {
  components: {
    DocumentPageDownloadProgressRow,
  },
  name: "DownloadFilePage",

  props: {
    generate_message: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const uow = new VueUnitOfWork();

    const route = useRoute();
    const file_id = route.params.file_id;

    const downloading_files = computed(() =>
      uow.download_progress.values().map((obj) => obj.value)
    );

    const handle_get_file_info = async () => {
      const message = new GetFileInfo(file_id);
      const result = await MessageBus.handle(message, uow);
      return result[0]; // Первый результат
    };

    const handle_download_file = async (name, size) =>
      await MessageBus.handle(props.generate_message(name, size), uow);

    onMounted(async () => {
      const file_info = await handle_get_file_info();
      if (file_info) await handle_download_file(file_info.name, file_info.size);
    });

    return { downloading_files };
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

.page__downloadprogress {
  margin-top: 20px;
  min-height: 20px;
}
</style>
