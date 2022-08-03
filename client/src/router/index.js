import { createRouter, createWebHistory } from 'vue-router'

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Soulworker | Skills Optimizer', content: 'Soulworker skills details and rotations optimization' },
    component: lazyLoad('CharactersList')
  },
  {
    path: '/character/:name',
    name: 'CharacterDetails',
    meta: { title: ' | Skills & Rotations', content: ' skills table and rotation templates' },
    component: lazyLoad('CharacterDetails'),
    props: true
  },
  {
    path: '/add-new-char',
    name: 'AddNewChar',
    meta: { title: 'New char', content: 'Add a new Soulworker character' },
    component: lazyLoad('NewCharacterForm')
  },
  {
    path: '/add-new-skill',
    name: 'AddNewSkill',
    meta: { title: 'New skill', content: 'Add a new Soulworker skill' },
    component: lazyLoad('NewSkillForm')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: 'Dashboard', content: 'Add or edit existing skills' },
    component: lazyLoad('Dashboard')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login', content: 'Login to access edit feature' },
    component: lazyLoad('Login')
  },
  {
    path: '/calculator',
    name: 'Calculator',
    meta: { title: 'Skill | Calculator', content: 'Skill dmg comparison', keepAlive: true },
    component: lazyLoad('Calculator')
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
  if (to.params.name) {
    document.querySelector("meta[name='description']").content = to.params.name + to.meta.content
    document.title = to.params.name + to.meta.title
    next();
  } else {
    document.querySelector("meta[name='description']").content = to.meta.content
    document.title = to.meta.title
    next();
  }
});

export default router
