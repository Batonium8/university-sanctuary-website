import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/view/HomeView.vue";
import HomeDetailsView from "@/view/HomeDetailsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'home',
    component: HomeDetailsView,
  },

  ],
})

export default router
