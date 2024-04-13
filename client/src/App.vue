<template>
  <div>
    <Nav />
    <NavAdmin v-if="userRole" :userRole=userRole @logout=logout />
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
        </keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
      </router-view>
    </div>
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
      userRole: '',
      selectedItemMenu: ''
    }
  },
  components: { 
    Nav, NavAdmin
  },
  methods: {
    setSelectedItem(event) {
      console.log('selectedItem - ', event);
      this.selectedItemMenu = event
    },
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
  .content {
    margin-left: 145px
  }
  .separator {
    border-left: 1px solid white;
    height: 15px;
  }
  .logout:hover {
    cursor: pointer;
  }
</style>
