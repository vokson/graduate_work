.<template>
  <div class="page">
    <document-page-download-progress-row
      class="page__downloadprogress"
      :files="downloading_files"
      :full_format="true"
    />
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
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { onMounted, computed, ref, reactive } from "vue";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import {
  GetFileShareLink,
  DownloadFileByFileShareLink,
  Notify
} from "../../logic/domain/command";
import { MessageBus } from "../../logic/service_layer/message_bus";
import DocumentPageDownloadProgressRow from "../../components/document/DocumentPageDownloadProgressRow.vue";
import BaseForm from "../../components/forms/BaseForm.vue";

export default {
  components: {
    DocumentPageDownloadProgressRow,
    BaseForm,
  },
  name: "DownloadFilePage",

  setup() {
    const uow = new VueUnitOfWork();

    const route = useRoute();
    const file_id = route.params.file_id;
    const link_id = route.params.link_id;

    const downloading_files = computed(() =>
      uow.download_progress.values().map((obj) => obj.value)
    );

    const download_file = async () => {
      const results = await MessageBus.handle(
        new GetFileShareLink(file_id, link_id),
        uow
      );
      const link = results[0];
      console.log(link);
      if (link)
        if (!link.is_secured)
        await MessageBus.handle(
          new DownloadFileByFileShareLink(file_id, link_id, null),
          uow
        )
        else is_form_opened.value = true;
    };

    // FORM
    const is_form_opened = ref(false);
    const form_attributes = reactive({
      PASSWORD: "",
    });

    const handle_form_close = () => {
      is_form_opened.value = false;
    };

    const handle_form_apply = async () => {
      const password = form_attributes["PASSWORD"];

      if (!password) {
        await MessageBus.handle(new Notify("error", "Введите пароль"), uow);
        return;
      }

      is_form_opened.value = false;
      await MessageBus.handle(
        new DownloadFileByFileShareLink(file_id, link_id, password),
        uow
      );
    };

    const handle_update_form_attribute = (name, value) =>
      (form_attributes[name] = value);

    const form_pages = [
      {
        size: 400,
        name: "Защищенная ссылка",
        fields: [
          {
            type: "FormTextField",
            parameters: {
              font_weight: "bold",
            },
            value: "Введите пароль:",
          },
          {
            type: "FormTextInput",
            bind: "PASSWORD",
          },
        ],
      },
    ];

    onMounted(async () => {
      await download_file();
    });

    return {
      downloading_files,

      // FORM
      is_form_opened,
      form_pages,
      form_attributes,
      handle_update_form_attribute,
      handle_form_apply,
      handle_form_close,
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

.page__downloadprogress {
  margin-top: 20px;
  min-height: 20px;
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
</style>
