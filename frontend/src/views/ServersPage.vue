<template>
  <div class="page">
    <heading-component class="page__heading" text="S3 сервера" size="middle" />
    <div class="page__container">
      <div class="page__editblock">
        <base-form
          class="page__form"
          :attributes="current"
          :settings="form_pages"
          :is_edit_mode="true"
          :is_header_required="false"
          @update="handle_update_attribute($event.name, $event.value)"
        >
        </base-form>

        <div class="page__editrow">
          <btn-component
            class="page__button"
            @click="add_action()"
            caption="Добавить"
            type="primary"
            :disabled="!is_edit_block_valid"
            v-if="can_add && !current_id"
          />
          <btn-component
            class="page__button"
            @click="update_action()"
            caption="Сохранить"
            type="success"
            :disabled="!is_edit_block_valid"
            v-if="can_change && current_id"
          />
          <btn-component
            class="page__button"
            @click="delete_action()"
            caption="Удалить"
            type="danger"
            v-if="can_delete && current_id"
          />
        </div>
      </div>
      <search-component
        class="page__searchblock"
        :schema="search_schema"
        :model_objects="model_objects"
        :convert_obj_to_item="convert_model_to_item"
        :current_id="current_id"
        sort_by="name"
        :search_time="search_time"
        :is_searching="is_searching"
        :should_emit_search_event_on_any_keypress="true"
        @choose="current_id = $event"
        @search="search_action($event)"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import {
  AddCdnServer,
  UpdateCdnServer,
  DeleteCdnServer,
} from "../logic/domain/command";
import { MessageBus } from "../logic/service_layer/message_bus";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import {
  convertObject,
  // useBeforeEnterPage,
  filterArrayOfObjectsByQuery,
  // validate_json,
  useCurrentMixin,
  // useGetFolders,
} from "../logic/service_layer/use_modules";
// import { FolderSettings } from "../logic/adapters/api_responses/models/folder/folder_settings";

import HeadingComponent from "../components/HeadingComponent.vue";
import BtnComponent from "../components/buttons/BtnComponent.vue";
import BaseForm from "../components/forms/BaseForm.vue";
import SearchComponent from "../components/SearchComponent.vue";

export default {
  components: {
    HeadingComponent,
    BtnComponent,
    BaseForm,
    SearchComponent,
  },
  name: "ServersPage",

  setup() {
    const uow = new VueUnitOfWork();

    const convert_model_to_item = (obj) => {
      return {
        id: obj.id,
        attributes: {
          id: obj.id.toString(),
          name: obj.name,
          location: obj.location,
          zone: obj.zone,
          latitude: obj.latitude,
          longitude: obj.longitude,
          is_on: obj.is_on,
          is_ready: obj.is_ready,
          created: obj.created,
          updated: obj.updated,
        },
        actions: {},
      };
    };

    const query_for_internal_search = ref({});
    const model_objects = computed(() =>
      filterArrayOfObjectsByQuery(
        uow.cdn_server_repository.values().map((obj) => obj.value),
        query_for_internal_search.value
      )
    );

    const can_add = uow.permission_repository.has("can_add_cdnserver");
    const can_change = uow.permission_repository.has("can_change_cdnserver");
    const can_delete = uow.permission_repository.has("can_delete_cdnserver");

    // STATUS
    const search_time = ref(0);
    const is_searching = ref(false);

    const search_action = (query) => (query_for_internal_search.value = query);

    const search_schema = [
      {
        name: "location",
        size: "w200",
        align: "left",
        grow: true,
        fields: [
          {
            placeholder: "Расположение",
            rule: "icontains",
          },
        ],
      },
      {
        name: "zone",
        size: "w400",
        fields: [
          {
            placeholder: "Зона",
            rule: "icontains",
          },
        ],
      },
      {
        name: "is_on",
        size: "w50",
        fields: [
          {
            placeholder: "On/Off",
            rule: "exact",
          },
        ],
      },
      {
        name: "is_ready",
        size: "w50",
        fields: [
          {
            placeholder: "Ready",
            rule: "exact",
          },
        ],
      },
    ];

    // FORM
    const init_obj = {
      id: null,
      name: "",
      location: "",
      zone: "",
      latitude: "",
      longitude: "",
      is_on: false,
      is_ready: false,
      created: Date.now(),
      updated: Date.now(),
    };

    const to_repository_convertion = {
      // settings: (x) => JSON.parse(x),
    };

    const from_repository_convertion = {
      // settings: (x) => JSON.stringify(x, null, 3), // Каждый новый отступ - 3 пробела
    };

    const { current_id, current, handle_update_attribute } = useCurrentMixin(
      init_obj,
      uow.cdn_server_repository,
      from_repository_convertion
    );

    // const is_settings_valid = computed(() =>
    //   validate_json(current.value.settings, FolderSettings)
    // );

    const is_edit_block_valid = computed(
      // () => is_settings_valid.value && current.value.name.length > 0
      () => true
    );

    const add_action = async () => {
      const message = new AddCdnServer(
        ...[
          "name",
          "location",
          "zone",
          "latitude",
          "longitude",
          "is_on",
          "is_ready"
        ].map((k) => convertObject(current.value, to_repository_convertion)[k])
      );
      await MessageBus.handle(message, uow);
    };

    const update_action = async () => {
      const message = new UpdateCdnServer(
        ...[
          "id",
          "name",
          "location",
          "zone",
          "latitude",
          "longitude",
          "is_on",
          "is_ready"
        ].map((k) => convertObject(current.value, to_repository_convertion)[k])
      );
      await MessageBus.handle(message, uow);
    };

    const delete_action = async () => {
      const message = new DeleteCdnServer(current_id.value);
      await MessageBus.handle(message, uow);
      current_id.value = null;
    };

    const form_pages = computed(() => [
      {
        size: "w450",
        fields: [
          {
            type: "FormTextField",
            bind: "id",
          },
          {
            type: "FormTextField",
            value: "Расположение:",
          },
          {
            type: "FormTextInput",
            bind: "location",
          },
          {
            type: "FormTextField",
            value: "Зона:",
          },
          {
            type: "FormTextInput",
            bind: "zone",
          },
          {
            type: "FormTextField",
            value: "Широта:",
          },
          {
            type: "FormTextInput",
            bind: "latitude",
          },
          {
            type: "FormTextField",
            value: "Долгота:",
          },
          {
            type: "FormTextInput",
            bind: "longitude",
          },
          {
            type: "FormTextField",
            value: "Включен ?",
          },
          {
            type: "FormBooleanInput",
            bind: "is_on",
          },
          {
            type: "FormTextField",
            value: "Готов к работе ?",
          },
          {
            type: "FormBooleanInput",
            bind: "is_ready",
          },
        ],
      },
    ]);
    onMounted(async () => {
      // Пытаемся автоматически зaлогинится
      // await useBeforeEnterPage(uow, ["can_view_flow"]);
      // await useGetFolders(uow);
    });

    return {
      // ACTION
      search_action,
      add_action,
      update_action,
      delete_action,

      // PERMISSION
      can_add,
      can_change,
      can_delete,

      // EDIT
      current_id,
      current,
      is_edit_block_valid,
      handle_update_attribute,
      form_pages,

      // SEARCH
      search_schema,
      model_objects,
      convert_model_to_item,
      search_time,
      is_searching,
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

.page__editblock {
  width: 600px;
  display: flex;
  flex-direction: column;
  padding-right: 15px;
}

.page__searchblock {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  border-left: 1px solid black;
}

.page__button {
  margin: 5px;
}

.page__editrow {
  display: flex;
  width: 100%;
}
</style>
