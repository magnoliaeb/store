import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

import Category from '../views/dashboard/Category.vue'
import Client from '../views/dashboard/Client.vue'
import Provider from '../views/dashboard/Provider.vue'
import User from '../views/dashboard/User.vue'
import Article from '../views/dashboard/Article.vue'
import Invoice from '../views/dashboard/Invoice.vue'
import Income from '../views/dashboard/Income.vue'
import CraeteInvoice from '../views/dashboard/CraeteInvoice.vue'
import CreateIncome from '../views/dashboard/CreateIncome.vue'
import Login from '../views/auth/Login.vue'

import Home from '../views/Home.vue'
Vue.use(VueRouter)


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' },
      meta: {
        libre: true
      },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        libre: true
      }
    },
    {
      path: '/categories',
      name: 'Category',
      component: Category,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/clients',
      name: 'Client',
      component: Client,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/providers',
      name: 'Provider',
      component: Provider,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/users',
      name: 'User',
      component: User,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/articles',
      name: 'Article',
      component: Article,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/invoices',
      name: 'Invoice',
      component: Invoice,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/invoices/create',
      name: 'CraeteInvoice',
      component: CraeteInvoice,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/incomes',
      name: 'Income',
      component: Income,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: '/incomes/create',
      name: 'CreateIncome',
      component: CreateIncome,
      meta: {
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },

  ]
})



router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  const isLibre = to.matched.some((item) => item.meta.libre)
  const user = store.getters['auth/user'];

  console.log(user)

  if (!isLibre) {
    if (user) {
      next()
      console.log('esta autenticado')
    } else {
      next({ name: 'Login'})
      console.log('No esta autenticado')
    }
    next()
  } else {
    next()
  }
})

export default router
