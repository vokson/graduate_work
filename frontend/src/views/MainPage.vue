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
          <p class="page__userlabel">Имя:</p>
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
    </div>

    <!-- <form-text-input
      class="page__search"
      :value="query"
      :parameters="{ placeholder: 'Поиск...' }"
      @update="query = $event"
    />
    <toggle-text-button
      class="page__expandbutton"
      activeTitle="Вернуться в обычный режим"
      passiveTitle="Развернуть все"
      :isActive="is_all_expanded"
      @click="is_all_expanded = !is_all_expanded"
    />
    <div class="page__container">
      <folder-tree-node
        :tree="folders"
        :usergroup_id="usergroup_id"
        :expand_all="is_all_expanded"
      />
    </div> -->
  </div>
</template>

<script>
import { onMounted } from "vue";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import { RefreshTokens } from "../logic/domain/command";
import HeadingComponent from "../components/HeadingComponent.vue";
import { MessageBus } from "../logic/service_layer/message_bus";

// import FormTextField from "../components/fields/FormTextField.vue";
// import FolderTreeNode from "../components/folder/FolderTreeNode.vue";
// import ToggleTextButton from "../components/buttons/ToggleTextButton.vue";
import { useBeforeEnterPage } from "../logic/service_layer/use_modules";

export default {
  components: {
    HeadingComponent,
    // FormTextField,
    // FolderTreeNode,
    // FormTextInput,
    // ToggleTextButton,
  },
  name: "FoldersPage",

  setup() {
    const uow = new VueUnitOfWork();

    const refresh_tokens = async () =>
      await MessageBus.handle(new RefreshTokens(), uow);

    uow.token_timer.start(refresh_tokens);

    // // USERGROUP
    // const usergroup_id = computed(() => {
    //   const current_group = uow.usergroup_repository.get_current();
    //   return current_group.value === null ? 0 : current_group.value.id;
    // });

    // // FOLDER

    // const folders = computed(() => {
    //   // Сортируем массив по именам папок
    //   let arr = uow.folder_repository
    //     .values()
    //     .map((obj) => obj.value)
    //     .filter((folder) =>
    //       folder.name.toLowerCase().includes(query.value.toLowerCase())
    //     );
    //   arr.sort((a, b) => a.name - b.name);

    //   // Функция для формирования дерева
    //   const insert_into = (obj, array_of_keys, value) => {
    //     Array.prototype.forEach.call(array_of_keys, (key) => {
    //       if (!Object.prototype.hasOwnProperty.call(obj, key)) obj[key] = {};
    //       obj = obj[key];
    //     });

    //     obj["_target"] = value;
    //   };

    //   // Формирование дерева папок
    //   let folder_tree = {};
    //   arr.forEach((folder) => {
    //     // Разделяем имена по символу |
    //     insert_into(
    //       folder_tree,
    //       folder.name.split("|").map((value) => value.trim()),
    //       folder
    //     );
    //   });

    //   return folder_tree;
    // });

    // // SEARCH
    // const query = ref("");

    // // EXPAND
    // const is_all_expanded = ref(false);

    const user = uow.user_repository.get_current(); // Ref

    onMounted(async () => {
      await useBeforeEnterPage(uow, []);
    });

    return {
      // usergroup_id,
      // folders,
      // query,
      user,
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
</style>
