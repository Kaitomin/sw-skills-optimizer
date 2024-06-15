<template>
  <div>
    <Suspense>
      <template #default>
        <Nav />
      </template>
      <template #fallback>
        <span>Loading...</span>
      </template>
    </Suspense>
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

<script setup>
  import { onBeforeMount, provide, ref } from 'vue'
  import { version } from '../package.json'

  import Nav from '@/components/Nav.vue'
  import NavAdmin from './components/NavAdmin.vue'
  import UserService from './services/UserService'
  import VersionService from './services/VersionService'

  import "@/assets/global.css";

  let userRole = ref('')
  provide('userRole', userRole)

  // const selectedItemMenu = ''
  
  // function setSelectedItem(event) {
  //   console.log('selectedItem - ', event);
  //   this.selectedItemMenu = event
  // }

  // async function logout() {
  //   try {
  //     await UserService.logout_post();
  //     this.userRole = null;
  //     this.$router.push('/')
  //   } catch (error) {
  //     console.log("Logout err :", error)
  //   }
  // }

  onBeforeMount(async() => {
    try {
      const res = await UserService.getCurrentUser()
      userRole.value = res.data.role
    } catch (error) {
      console.log("Error during retrieving user")
    }
  })

  // watch: {
  //   '$route': {
  //     async handler(newValue, oldValue) {
  //       // console.log('Old route - ', oldValue);
  //       // console.log('New route - ', newValue);
  //       // console.log('Package before ver - ', version);

  //       if (oldValue && newValue && oldValue.fullPath != newValue.fullPath) {
  //         let latestVer = await VersionService.getVersion()
  //         latestVer = latestVer.data

  //         // console.log('Current version - ', latestVer);
  //         // console.log('Package after ver - ', version);

  //         if (version !== latestVer) {
  //           location.reload()
  //         }
        
  //       }
  //     },
  //     immediate: true,
  //     deep: true,
  //   }
  // }

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
