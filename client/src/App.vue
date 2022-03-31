<template>
  <div>
    <div id="nav">
      <router-link to="/">Characters</router-link>
      <span v-if="userRole == 'ADMIN'">
        <router-link to="/add-new-char"> | Add character</router-link>
        <router-link to="/add-new-skill"> | Add skill</router-link>
        <a @click="logout"> | Logout</a>
      </span>
      <br>
      <router-link class="character" to="/character/Iris">Iris - </router-link>
      <router-link class="character" to="/character/Lily">Lily</router-link>
    </div>
    <hr>
    <router-view :key="$route.fullPath" />
  </div>
  
</template>

<script>

import UserService from './services/UserService';
import CharacterService from './services/CharacterService';

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
  font-size: 1em;
  font-weight: bold;
  color: #d9d9d9;
  text-decoration: none;
}
#nav a.character {
  font-size: 1em;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
