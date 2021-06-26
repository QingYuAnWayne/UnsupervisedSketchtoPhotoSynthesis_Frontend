import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../components/Home";
import Index from "../components/Index"

Vue.use(VueRouter)


const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/',
    name: 'Index',
    component: Index
  }
]

const router = new VueRouter({
  routes
})

export default router
