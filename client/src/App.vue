<template>
  <div>
    <Nav :userRole=userRole @logout=logout />
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

import "@/assets/global.css";
import "@/assets/theme_lily.css";
import "@/assets/theme_iris.css";
import "@/assets/theme_stella.css";
import "@/assets/theme_haru.css";
import "@/assets/theme_ephnel.css";
import "@/assets/theme_chii.css";
import "@/assets/theme_nabi.css";
import "@/assets/theme_dana.css";
import "@/assets/theme_erwin.css";
import UserService from './services/UserService';

export default {
  data() {
    return {
      userRole: ''
    }
  },
  components: { 
    Nav
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
  background: #ffffff12;
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
.edit {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 300px;
  margin: 0 auto;
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
