<template>
  <div>
    <Nav />
    <NavAdmin v-if="userRole" :userRole=userRole @logout=logout />
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
      </keep-alive>
      <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
    </router-view>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import NavAdmin from './components/NavAdmin.vue'
import UserService from './services/UserService';

import "@/assets/global.css";

export default {
  data() {
    return {
      userRole: ''
    }
  },
  components: { 
    Nav, NavAdmin
  },
  methods: {
    async logout() {
      try {
        await UserService.logout_post();
        this.userRole = null;
        this.$router.push('/')
      } catch (error) {
        console.log("Logout err :", error)
      }
    },
  },
  async created() {
    try {
      const res = await UserService.getCurrentUser()
      this.userRole = res.data.role
    } catch (error) {
      console.log("Error during retrieving user")
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: #1c1c1c;
  padding: 10px 25px;
  border-bottom: 1px solid white;
}
#nav a {
  font-size: 1.1em;
  font-weight: bold;
  color: #d9d9d9;
  text-decoration: none;
}
#nav > a {
  display: block;
  width: max-content;
}
.menu {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0;
}
.menu a {
  display: block;
  padding: 0.5em 0;
}
#nav a.router-link-exact-active {
  color: #00ffff8f;
}
.separator {
  border-left: 1px solid white;
  height: 15px;
}
.logout:hover {
  cursor: pointer;
}


</style>
