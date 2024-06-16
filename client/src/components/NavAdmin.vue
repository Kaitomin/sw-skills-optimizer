<template>
  <div v-if="userRole === 'ADMIN' || 'EDITOR'" class="nav-admin">
    <router-link v-if="userRole === 'ADMIN'" to="/add-new-char">
      <i class="fa-solid fa-user-plus"> </i>
      Character
    </router-link>
    <router-link to="/dashboard">
      <i class="fa-solid fa-gauge"> </i>
      Dashboard
    </router-link>
    <a class="logout" @click="logout">
      <i class="fa-solid fa-right-from-bracket"> </i> 
      Logout
    </a>
  </div>
</template>

<script setup>
  const props = defineProps(['userRole'])

  //TODO: was in App.vue
  const logout = async() => {
    try {
      await UserService.logout_post();
      userRole = null;
      this.$router.push('/')
    } catch (error) {
      console.log("Logout err :", error)
    }
  }
</script>

<style scoped>
  a {
    text-decoration: none;
    color: #d9d9d9;
  }
  a:visited {
    color: #d9d9d9;
  }
  .nav-admin {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 0 3em;
    align-items: center;
    padding: 0.5em 1em;
    /* background: #2d343f; */
    border-bottom: 1px solid #95989e2b;
  }
</style>