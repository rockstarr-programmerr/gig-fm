import Vue from 'vue'
import VueRouter from 'vue-router'
import { prefixWith } from './utils.js'

import Home from '../pages/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'hash',  // Using "hash" instead of "history" mode is important
  routes
})

export default router
