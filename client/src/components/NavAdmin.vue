<template>
  <div v-if="userRole === 'ADMIN'" class="nav-admin">
    <router-link to="/add-new-char" ><i class="fa-solid fa-user-plus"></i> Character</router-link>
    <router-link to="/dashboard"><i class="fa-solid fa-book"></i> Dashboard</router-link>
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
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: white;
    height: 50px;
    bottom: 0;
    font-weight: 900;
    font-size: 1.1rem;
    background: rgba(0, 0, 0, 0.788);
    border-top: 1px solid white;
  }
</style>