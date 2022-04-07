<template>
  <div>
    <div id="nav">
      <router-link to="/">
        <img src="@/assets/img/logo_200x113.webp" alt="soulworker logo" width="200" height="113">
      </router-link>
      <div class="menu">
        <router-link to="/">All</router-link><div class="separator"></div>
        <router-link to="/character/Iris">Iris</router-link><div class="separator"></div>
        <router-link to="/character/Lily">Lily</router-link><div class="separator"></div>
        <router-link to="/character/Haru">Haru</router-link><div class="separator"></div>
        <router-link to="/character/Stella">Stella</router-link>
      </div>
       <div v-if="userRole == 'ADMIN'" class="edit">
          <router-link to="/add-new-char" >Add character</router-link><div class="separator"></div>
          <router-link to="/add-new-skill">Add skill</router-link><div class="separator"></div>
          <a class="logout" @click="logout">Logout</a>
        </div>
    </div>
    <router-view :key="$route.fullPath" />
  </div>
  
</template>

<script>

import "@/assets/global.css";
import "@/assets/theme_lily.css";
import "@/assets/theme_iris.css";
import "@/assets/theme_stella.css";
import "@/assets/theme_haru.css";
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
      console.log(error)
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
  padding: 10px 0;
}
#nav a {
  font-size: 1.2em;
  font-weight: bold;
  color: #d9d9d9;
  text-decoration: none;
}
#nav > a {
  display: block;
  width: max-content;
  margin: 0 auto;
  margin-top: 1em;
}
.menu {
  display: flex;
  /* grid-template-columns: repeat(9, 1fr); */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  /* width: 375px; */
  margin: 0 auto;
}
.menu a {
  display: block;
  padding: 1em 0;
  width: 70px;
}
.edit {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 300px;
  margin: 0 auto;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
.separator {
  border-left: 1px solid white;
  height: 15px;
}
.logout:hover {
  cursor: pointer;
}

@media screen and (max-width: 400px) {
  /* .menu {
    grid-template-columns: repeat(5, 1fr);
    width: 275px;
  } */
}
</style>
