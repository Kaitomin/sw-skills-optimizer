<template>
  <div>
    <div id="nav">
      <router-link to="/" class="logo">
        <img src="@/assets/img/logo_130x70.png" alt="soulworker logo" width="130" height="70">
      </router-link>
      <div class="menu">
        <router-link to="/character/Iris">
          <img src="@/assets/img/iris_nav.png" alt="iris nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Lily">
          <img src="@/assets/img/lily_nav.png" alt="lily nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Haru">
          <img src="@/assets/img/haru_nav.png" alt="haru nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Stella">
          <img src="@/assets/img/stella_nav.png" alt="stella nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Ephnel">
          <img src="@/assets/img/ephnel_nav.png" alt="ephnel nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Chii">
          <img src="@/assets/img/chii_nav.png" alt="chii nav icon" width="120" height="50">
        </router-link>
        <router-link to="/character/Nabi">
          <img src="@/assets/img/nabi_nav.png" alt="nabi nav icon" width="120" height="50">
        </router-link>
      </div>
      <div>
        <router-link to="/calculator"><i class="fa-solid fa-calculator"></i> Calculator</router-link>
      </div>
      <div v-if="userRole == 'ADMIN'" class="edit">
        <router-link to="/add-new-char" >Add character</router-link><div class="separator"></div>
        <router-link to="/add-new-skill">Add skill</router-link><div class="separator"></div>
        <a class="logout" @click="logout">Logout</a>
      </div>
    </div>
    <!-- <router-view :key="$route.fullPath" /> -->

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
      </keep-alive>
      <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
    </router-view>

  </div>
</template>

<script>

import "@/assets/global.css";
import "@/assets/theme_lily.css";
import "@/assets/theme_iris.css";
import "@/assets/theme_stella.css";
import "@/assets/theme_haru.css";
import "@/assets/theme_ephnel.css";
import "@/assets/theme_chii.css";
import "@/assets/theme_nabi.css";
import UserService from './services/UserService';

export default {
  data() {
    return {
      userRole: ''
    }
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

/* Responsive */
@media screen and (max-width: 1150px) {
  #nav {
    flex-direction: column;
  }
}
</style>
