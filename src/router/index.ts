import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import Login from 'views/Login.vue'
import Dashboard from 'views/Dashboard.vue'
import Account from 'views/Account.vue'
import Cookies from 'universal-cookie'

function guard (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, afterAuth = true) {
  const cookies = new Cookies()
  const token: boolean = cookies.get('authToken')
  if (afterAuth) {
    if (token) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    if (!token) {
      next()
    }
  }
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter (to, from, next) {
      guard(to, from, next, false)
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter (to, from, next) {
      guard(to, from, next)
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter (to, from, next) {
      guard(to, from, next)
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
