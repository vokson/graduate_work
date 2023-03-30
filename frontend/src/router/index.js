import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../views/LoginPage.vue'
import MainPage from '../views/MainPage.vue'
import MessagePage from '../views/service/MessagePage.vue'
// import DownloadFileFromFolderPage from '../views/download/DownloadFileFromFolderPage'


const routes = [
  // {
  //   path: '/folder/:folder_id/usergroup/:usergroup_id/file/:file_id',
  //   name: 'DownloadFileFromFolderPage',
  //   component: DownloadFileFromFolderPage
  // },
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
