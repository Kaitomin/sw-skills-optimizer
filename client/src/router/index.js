import { createRouter, createWebHistory } from 'vue-router'
// import CharactersList from '../views/CharactersList.vue'
// import CharacterDetails from '../views/CharacterDetails.vue'
// import AddNewChar from '../views/addNewCharacter.vue'
// import AddNewSkill from '../views/addNewSkill.vue'
// import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Soulworker | Skills optimizer' },
    component: () => import('@/views/CharactersList.vue')
  },
  {
    path: '/character/:name',
    name: 'CharacterDetails',
    meta: { title: ' | skills infos' },
    component: () => import('@/views/CharacterDetails.vue'),
    props: true
  },
  {
    path: '/add-new-char',
    name: 'AddNewChar',
    meta: { title: 'New char' },
    component: () => import('@/views/addNewCharacter.vue')
  },
  {
    path: '/add-new-skill',
    name: 'AddNewSkill',
    meta: { title: 'New skill' },
    component: () => import('@/views/addNewSkill.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: () => import('@/views/Login.vue')
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

router.beforeEach((to, from, next) => {
  if(to.params.name) {
    document.title = to.params.name + to.meta.title
  } else {
    document.title = to.meta.title
  }
  next();
});

export default router
