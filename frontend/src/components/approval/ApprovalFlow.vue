<template>
  <div class="approvalflow">
    <div class="approvalflow__infoblock">
      <form-text-field class="approvalflow__label" :value="created_date_info" />
      <div class="approvalflow__empty" />
      <form-text-field class="approvalflow__label" :value="updated_date_info" />
    </div>
    <div v-if="can_be_modified" class="approvalflow__buttonblock">
      <div
        v-if="!is_saved"
        class="approvalflow__button approvalflow__button_save"
        title="Сохранить поток"
        @click="handle_save()"
      />
      <div
        v-if="is_saved && !is_active"
        class="approvalflow__button approvalflow__button_start"
        title="Запустить поток"
        @click="$emit('start')"
      />
      <div
        v-if="is_saved && is_active"
        class="approvalflow__button approvalflow__button_stop"
        title="Остановить поток"
        @click="$emit('stop')"
      />
      <div v-if="!is_active" class="approvalflow__empty" />
      <form-filtered-select-input
        v-if="!is_active"
        class="approvalflow__username"
        :parameters="{
          options: user_options,
          placeholder: 'Поиск...',
          size: 3,
        }"
        :value="action_username"
        @update="action_username = $event"
      />
      <div
        v-if="!is_active"
        class="approvalflow__button approvalflow__button_add"
        :class="{ approvalflow__button_gray: !is_action_username_chosen }"
        title="Добавить пользователя"
        @click="handle_add_user()"
      />
    </div>
    <div v-if="!is_active" class="approvalflow__userblock">
      <approval-flow-step-item
        class="approvalflow__user"
        v-for="(username, index) in non_attached_usernames"
        :key="index"
        :id="username"
        :text="find_user_description(username)"
        :can_be_deleted="false"
        :can_be_dragged="true"
      />
    </div>
    <div class="approvalflow__stepblock">
      <approval-flow-step
        class="approvalflow__step"
        v-for="(step, index) in steps"
        :key="index"
        :id="index + 1"
        :items="modify_step(step)"
        :states="states"
        :can_be_modified="!is_active && can_be_modified"
        @delete:step="$emit('delete:step', index)"
        @delete:item="handle_delete_user_from_step(index, $event)"
        @attach="handle_attach_user_to_step(index, $event)"
      />

      <div v-if="!is_active && can_be_modified" class="approvalflow__row">
        <div
          class="
            approvalflow__button
            approvalflow__button_large
            approvalflow__button_add_large
          "
          title="Добавить шаг потока"
          @click="$emit('add:step')"
        />
      </div>
      <div v-if="is_active" class="approvalflow__row">
        <div
          class="
            approvalflow__button
            approvalflow__button_large
            approvalflow__button_onprogress
            approvalflow__button_rotating
          "
          title="Поток запущен и работает"
        />
      </div>
      <div class="approvalflow__row">
        <div
          class="
            approvalflow__button
            approvalflow__button_large
            approvalflow__button_download_large
          "
          title="Скачать поток"
          @click="handle_download_json_file()"
        />
      </div>
      <div class="approvalflow__row">
        <json-file-drop-zone
          class="approvalflow__dropzone"
          :class="{
            approvalflow__dropzone_dragging: is_drag_above_json_file_zone,
          }"
          :default="[]"
          @update:dragging="is_drag_above_json_file_zone = $event"
          @update:json="handle_drop_json_file($event)"
        >
          <span
            v-if="!is_drag_above_json_file_zone"
            class="approvalflow_dropzonetitle"
          >
            Сюда можно загрузить JSON файл потока</span
          >
        </json-file-drop-zone>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { VueUnitOfWork } from "../../logic/service_layer/uow";
import { MessageBus } from "../../logic/service_layer/message_bus";

import FormTextField from "../fields/FormTextField.vue";
import ApprovalFlowStep from "./ApprovalFlowStep.vue";
import ApprovalFlowStepItem from "./ApprovalFlowStepItem.vue";
import FormFilteredSelectInput from "../fields/FormFilteredSelectInput.vue";
import JsonFileDropZone from "../file/JsonFileDropZone.vue";

import { ApprovalFlowUploadError } from "../../logic/domain/event";
import { DownloadJsonFile } from "../../logic/domain/command";
import { convertDateToDateTimeString } from "../../logic/service_layer/use_modules";

export default {
  components: {
    FormTextField,
    ApprovalFlowStep,
    ApprovalFlowStepItem,
    FormFilteredSelectInput,
    JsonFileDropZone,
  },
  name: "ApprovalFlow",
  props: {
    is_active: {
      type: Boolean,
      required: true,
    },
    is_saved: {
      type: Boolean,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
    states: {
      type: Object,
      required: true,
    },
    // Array of User objects
    users: {
      type: Array,
      required: true,
    },
    can_be_modified: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    "add:step",
    "delete:step",
    "delete:user",
    "attach:user",
    "save",
    "start",
    "stop",
  ],

  setup(props, { emit }) {
    const uow = new VueUnitOfWork();
    const created_date_info = computed(
      () => "Создан: " + convertDateToDateTimeString(props.created_at)
    );
    const updated_date_info = computed(
      () => "Обновлен: " + convertDateToDateTimeString(props.updated_at)
    );

    const action_username = ref("NOT_CHOSEN");
    const is_action_username_chosen = computed(
      () => action_username.value !== "NOT_CHOSEN"
    );

    const non_attached_usernames = ref([]);

    const is_drag_above_json_file_zone = ref(false);

    const user_options = computed(() =>
      [{ name: "Выберите пользователя", value: "NOT_CHOSEN" }].concat(
        props.users
          .map((e) => {
            return {
              name: (
                e.last_name +
                " " +
                e.first_name +
                " (" +
                e.username +
                ")"
              ).trim(),
              value: e.username,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );

    const usernames = computed(() => props.users.map((e) => e.username));

    const find_user_description = (username) => {
      const index = user_options.value.map((e) => e["value"]).indexOf(username);
      return user_options.value[index]["name"];
    };

    const modify_step = (arr_of_usernames) =>
      arr_of_usernames.map((username) => {
        return { id: username, text: find_user_description(username) };
      });

    const handle_add_user = () => {
      if (!is_action_username_chosen.value) return;
      non_attached_usernames.value.push(action_username.value);
    };

    const handle_attach_user_to_step = (index, username) => {
      emit("attach:user", [index, username]);
      non_attached_usernames.value = non_attached_usernames.value.filter(
        (e) => e != username
      );
    };

    const handle_delete_user_from_step = (index, username) => {
      emit("delete:user", [index, username]);
      non_attached_usernames.value.push(username);
    };

    const handle_save = () => {
      non_attached_usernames.value = [];
      emit("save");
    };

    const handle_drop_json_file = (arr) => {
      const count = props.steps.length;
      for (let i = 0; i < count; i++) emit("delete:step", 0);

      try {
        let index = 0;
        arr.forEach((step_arr) => {
          emit("add:step");

          step_arr.forEach((username) => {
            if (usernames.value.indexOf(username) == -1)
              throw new Error("Wrong username: " + username);

            emit("attach:user", [index, username]);
          });
          index++;
        });
      } catch (err) {
        console.log(err);
        MessageBus.handle(new ApprovalFlowUploadError(), uow);
      }
    };

    const handle_download_json_file = async () => {
      await MessageBus.handle(
        new DownloadJsonFile("flow.json", props.steps),
        uow
      );
    };

    return {
      convertDateToDateTimeString,
      created_date_info,
      updated_date_info,
      action_username,
      is_action_username_chosen,
      non_attached_usernames,
      user_options,
      usernames,
      is_drag_above_json_file_zone,
      find_user_description,
      modify_step,
      handle_add_user,
      handle_attach_user_to_step,
      handle_delete_user_from_step,
      handle_drop_json_file,
      handle_save,
      handle_download_json_file,
    };
  },
};
</script>

<style scoped>
.approvalflow,
.approvalflow__stepblock {
  display: flex;
  flex-direction: column;
}

.approvalflow__step {
  margin: 10px 10px 10px 10px;
}

.approvalflow__row {
  display: flex;
  justify-content: center;
  padding: 5px;
}

.approvalflow__infoblock,
.approvalflow__buttonblock,
.approvalflow__userblock {
  display: flex;
  padding: 3px;
}

.approvalflow__buttonblock {
  justify-content: center;
}

.approvalflow__userblock {
  flex-wrap: wrap;
}

.approvalflow__button {
  transition: all 0.25s;
  cursor: pointer;
  margin: 5px;
  min-height: 30px;
  min-width: 30px;
}

.approvalflow__button_large {
  min-height: 40px;
  min-width: 40px;
}

.approvalflow__button:hover {
  transform: scale(1.1);
}

.approvalflow__button_save {
  background: url("../../../public/save.png") top left/30px 30px no-repeat;
}

.approvalflow__button_start {
  background: url("../../../public/start.png") top left/30px 30px no-repeat;
}

.approvalflow__button_stop {
  background: url("../../../public/stop.png") top left/30px 30px no-repeat;
}

.approvalflow__button_add {
  background: url("../../../public/plus.png") top left/30px 30px no-repeat;
}

.approvalflow__button_add_large {
  background: url("../../../public/plus.png") top left/40px 40px no-repeat;
}

.approvalflow__button_download_large {
  background: url("../../../public/download.png") top left/40px 40px no-repeat;
}

.approvalflow__button_gray {
  filter: grayscale(100%);
}

.approvalflow__empty {
  flex-grow: 1;
}

.approvalflow__username {
  margin-top: 7px;
  max-width: 300px;
}

.approvalflow__user {
  margin: 3px;
  cursor: pointer;
  user-select: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.approvalflow__button_rotating {
  animation: rotate 3s infinite linear;
}

.approvalflow__dropzone {
  min-height: 80px;
  max-height: 80px;
  border: 2px dashed grey;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  padding: 3px;
  margin-top: 10px;
}

.approvalflow__dropzone_dragging {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}

.approvalflow__dropzonetitle {
  font-size: 24px;
}
</style>