import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MyOffersView from '@/views/MyOffersView.vue'
import apiLogin from '@/service/apiService'

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
      component: () => import('../views/OfferView.vue'),
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('../views/ResultView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: async (to, from, next) => {
        // try {
        //   await apiLogin.get('/user')
        //   next() // user is authenticated
        // } catch {
        //   next('/login') // not authenticated
        // }
        const isLoggedIn = localStorage.getItem('authToken') === 'fake-jwt-token'
        if (isLoggedIn) {
          next('/profile')
        } else {
          next()
        }
      },
    },
    {
      path: '/profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: async (to, from, next) => {
        // try {
        //   await apiLogin.get('/user')
        //   next() // user is authenticated
        // } catch {
        //   next('/login') // not authenticated
        // }
        const isLoggedIn = localStorage.getItem('authToken') === 'fake-jwt-token'
        if (isLoggedIn) {
          next()
        } else {
          next('/login')
        }
      },
    },
    {
      path: '/offers',
      name: 'offers',
      component: MyOffersView,
      beforeEnter: async (to, from, next) => {
        // try {
        //   await apiLogin.get('/user')
        //   next() // user is authenticated
        // } catch {
        //   next('/login') // not authenticated
        // }
        const isLoggedIn = localStorage.getItem('authToken') === 'fake-jwt-token'
        if (isLoggedIn) {
          next()
        } else {
          next('/login')
        }
      },
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      // component: () => import('@/views/VehiclesView.vue'),
      beforeEnter: async (to, from, next) => {
        // try {
        //   await apiLogin.get('/user')
        //   next() // user is authenticated
        // } catch {
        //   next('/login') // not authenticated
        // }
        const isLoggedIn = localStorage.getItem('authToken') === 'fake-jwt-token'
        if (isLoggedIn) {
          next()
        } else {
          next('/login')
        }
      },
    },
  ],
})

export default router
