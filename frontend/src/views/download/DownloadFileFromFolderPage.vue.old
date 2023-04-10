<template>
  <download-file-page :generate_message="make_message" />
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import {
  useBeforeEnterPage,
  useValidateIntOr404,
} from "../../logic/service_layer/use_modules";
import { DownloadFileFromFolder } from "../../logic/domain/command";
import DownloadFilePage from "./DownloadFilePage.vue";

export default {
  components: {
    DownloadFilePage,
  },
  name: "DownloadFileFromFolderPage",

  setup() {
    const route = useRoute();
    const uow = new VueUnitOfWork();

    const folder_id = useValidateIntOr404(route.params.folder_id);
    const usergroup_id = useValidateIntOr404(route.params.usergroup_id);

    const make_message = (name, size) =>
      new DownloadFileFromFolder(folder_id, usergroup_id, route.params.file_id, name, size, true);

    onMounted(
      async () =>
        await useBeforeEnterPage(
          uow,
          ["can_view_file"],
          folder_id,
          usergroup_id
        )
    );

    return { make_message };
  },
};
</script>