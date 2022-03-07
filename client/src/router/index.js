import { createRouter, createWebHistory } from 'vue-router'
import CharactersList from '../views/CharactersList.vue'
import CharacterDetails from '../views/CharacterDetails.vue'
import AddNewChar from '../views/addNewCharacter.vue'
import AddNewSkill from '../views/addNewSkill.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CharactersList
  },
  {
    path: '/character/:id',
    name: 'CharacterDetails',
    component: CharacterDetails,
    props: true
  },
  {
    path: '/add-new-char',
    name: 'AddNewChar',
    component: AddNewChar
  },
  {
    path: '/add-new-skill',
    name: 'AddNewSkill',
    component: AddNewSkill
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: "/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
