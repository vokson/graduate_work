<template>
  <div class="nav">
    <div v-for="item in links" v-bind:key="item.route_name" class="nav__links">
      <router-link class="nav__item" :to="{ name: item.route_name }">{{
        item.title
      }}</router-link>
    </div>

    <div class="nav__empty"></div>
  </div>
</template>

<script>
import { VueUnitOfWork } from "../../logic/service_layer/uow";

export default {
  name: "NavigationComponent",
  props: {
    links: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const uow = new VueUnitOfWork();
    const user = uow.user_repository.get_current(); // Ref
    return { user };
  },
};
</script>

<style>
.nav {
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: #f8f9fa;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(222, 226, 230);
}

.nav__empty {
  flex-grow: 1;
}

.nav__item {
  display: block;
  box-sizing: border-box;
  text-decoration: none;
  border: solid transparent;
  border-width: 1px 1px 0 1px;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  padding: 10px;
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  color: #007bff;
}

.nav__item:link,
.nav__item:visited {
  color: #007bff;
}

.nav__item:focus,
.nav__item:hover {
  color: darkblue;
  border-color: rgb(222, 226, 230);
}
</style>