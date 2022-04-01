import { createRouter, createWebHistory } from 'vue-router'

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Soulworker | Skills optimizer' },
    component: lazyLoad('CharactersList')
  },
  {
    path: '/character/:name',
    name: 'CharacterDetails',
    meta: { title: ' | skills infos' },
    component: lazyLoad('CharacterDetails'),
    props: true
  },
  {
    path: '/add-new-char',
    name: 'AddNewChar',
    meta: { title: 'New char' },
    component: lazyLoad('addNewCharacter.vue')
  },
  {
    path: '/add-new-skill',
    name: 'AddNewSkill',
    meta: { title: 'New skill' },
    component: lazyLoad('addNewSkill.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: lazyLoad('Login.vue')
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
