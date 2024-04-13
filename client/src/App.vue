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
import { version } from '../package.json';

import Nav from '@/components/Nav.vue'
import NavAdmin from './components/NavAdmin.vue'
import UserService from './services/UserService';
import VersionService from './services/VersionService'

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
  watch: {
    '$route': {
      async handler(newValue, oldValue) {
        console.log('Old route - ', oldValue);
        console.log('New route - ', newValue);

        console.log('Package before ver - ', version);

        if (oldValue && newValue && oldValue.fullPath != newValue.fullPath) {
          let latestVer = await VersionService.getVersion()
          latestVer = latestVer.data

          console.log('Current version - ', latestVer);
          console.log('Package after ver - ', version);

          if (version !== latestVer) {
            // console.log('RELOAD');
            location.reload()
          }
        
        }
      },
      immediate: true,
      deep: true,
    }
  }
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
