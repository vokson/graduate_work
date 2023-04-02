<template>
  <div class="page">
    <heading-component class="page__heading" text="Вход" size="middle" />
    <form class="page__input-block">
      <form-text-input
        class="page__input"
        :value="credentials.username"
        @update="credentials.username = $event"
        @keyup.enter="login_action"
        :parameters="{ placeholder: 'Логин' }"
        autocomplete="username"
      />
      <form-text-input
        class="page__input"
        :value="credentials.password"
        @update="credentials.password = $event"
        @keyup.enter="login_action"
        :parameters="{ placeholder: 'Пароль', secure: true }"
        autocomplete="current-password"
      />
    </form>

    <div class="page__button-block">
      <btn-component
        class="page__button"
        @click="login_action"
        caption="Войти"
        type="primary"
      />
      <btn-component
        v-if="is_authenticated"
        class="page__button"
        @click="logout_action"
        caption="Выйти"
        type="secondary"
      />
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { LoginWithCredentials, Logout } from "../logic/domain/command";
import { MessageBus } from "../logic/service_layer/message_bus";
import { VueUnitOfWork } from "../logic/service_layer/uow";
import BtnComponent from "../components/buttons/BtnComponent.vue";
import HeadingComponent from "../components/HeadingComponent.vue";
import FormTextInput from "../components/fields/FormTextInput.vue";

export default {
  components: { BtnComponent, HeadingComponent, FormTextInput },
  name: "LoginPage",

  setup() {
    const credentials = reactive({
      username: "",
      password: "",
    });

    const router = useRouter();
    const route = useRoute();

    const uow = new VueUnitOfWork();
    const user = uow.user_repository.get_current();

    const is_authenticated = uow.user_repository.is_authenticated();

    const login_action = async () => {
      const message = new LoginWithCredentials(
        credentials.username,
        credentials.password
      );

      await MessageBus.handle(message, uow);
      if (uow.token_repository.get_access_token())
        router.push({
          path:
            route.query.url === undefined
              ? "/"
              : decodeURIComponent(route.query.url),
        });
    };

    const logout_action = async () => {
      const message = new Logout();
      await MessageBus.handle(message, uow);
    };

    console.log('----------------------------------')
    uow.token_timer.stop();
    uow.get_files_timer.stop()

    return {
      is_authenticated,
      user,
      credentials,
      login_action,
      logout_action,
      uow,
    };
  },
};
</script>
<style scoped>
.page {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-left: 60px;
  align-items: stretch;
}

.page__heading {
  padding-top: 60px;
  padding-bottom: 15px;
  color: white;
}

.page__input-block {
  padding-bottom: 15px;
  width: 300px;
}
.page__input {
  margin-right: 10px;
  border-color: white;
}
.page__button {
  margin-right: 20px;
}
</style>
