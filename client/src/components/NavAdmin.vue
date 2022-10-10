<template>
  <div v-if="userRole === 'ADMIN' || 'EDITOR'" class="nav-admin">
    <router-link v-if="userRole === 'ADMIN'" to="/add-new-char" ><i class="fa-solid fa-user-plus"></i> Character</router-link>
    <router-link to="/dashboard"><i class="fa-solid fa-gauge"></i> Dashboard</router-link>
    <a class="logout" @click="logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
  </div>
</template>

<script>
export default {
  props: ['userRole'],
  methods: {
    logout() {
      this.$emit('logout');
    }
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
    justify-content: space-evenly;
    align-items: center;
    height: 50px;
    font-weight: 900;
    font-size: 1.1rem;
    background: #0034347a;
    border-bottom: 1px solid white;
  }
</style>