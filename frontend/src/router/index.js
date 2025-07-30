import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import OfferView from '@/views/OfferView.vue'
import ResultView from '@/views/ResultView.vue'
import MyOffersView from '@/views/MyOffersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'search',
      component: OfferView
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    },
    {
      path: '/my-offers',
      name: 'my-offers',
      component: MyOffersView
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
