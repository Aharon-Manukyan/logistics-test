import { createRouter, createWebHistory } from 'vue-router'
import ThingsView from '@/views/ThingsView.vue'
import AdditionalExpenses from '@/views/AdditionalExpenses.vue'
import MainView from '@/views/MainView.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: AdditionalExpenses
  },
  {
    path: '/things',
    name: 'things',
    component: ThingsView
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
