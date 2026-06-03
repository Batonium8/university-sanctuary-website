import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/view/HomeView.vue";
import HomeDetailsView from "@/view/HomeDetailsView.vue";
import DoctorView from "@/view/DoctorView.vue";
import ServiceView from "@/view/ServiceView.vue";
import NotFound from "@/components/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'home',
    component: HomeView,
    },
    {
      path: '/rooms/:id',
      name: 'HomeDetail',
      component: HomeDetailsView,
    },
    {
      path: '/staff/:id',
      name: 'StaffDetail',
      component: DoctorView,
    },
    {
      path: '/services/:id',
      name: 'ServiceDetail',
      component: ServiceView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },


  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  },
})

export default router
