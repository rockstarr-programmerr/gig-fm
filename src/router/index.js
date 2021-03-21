import Vue from 'vue'
import VueRouter from 'vue-router'
import { prefixWith } from './utils.js'

import Home from '../pages/Home/index.vue'
import Repo from '../pages/Repo/index.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  ...prefixWith('/repo', [
    {
      path: '/:id',
      name: 'Repo',
      component: Repo,
      props: true
    }
  ])
]

const router = new VueRouter({
  mode: 'hash',  // Using "hash" instead of "history" mode is important
  routes
})

export default router
