import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../views/LoginPage.vue'
import MainPage from '../views/MainPage.vue'
import MessagePage from '../views/service/MessagePage.vue'
import DownloadFilePage from '../views/download/DownloadFilePage'


const routes = [
  {
    path: '/files/:file_id/links/:link_id',
    name: 'DownloadFilePage',
    component: DownloadFilePage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: MessagePage,
    props: {text: "Страница не найдена"}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
