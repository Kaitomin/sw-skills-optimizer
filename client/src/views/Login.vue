<template>
  <div class="container login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label>Username</label>
      <input type="text" v-model="username" required/>
      <label>Password</label>
      <input type="password" v-model="password" required/>
      <button class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>

import UserService from '../services/UserService';

export default {

  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const res = await UserService.login({
          username: this.username.toLowerCase(),
          password: this.password
        });
        this.$router.go();
      } catch (error) {
        console.log("Login error :", error);
      }
    }
  },
  async beforeCreate() {
    try {
      await UserService.loginGet();
    } catch (error) {
      this.$router.push('/')
    }
    
  }
}
</script>

<style scoped>
  .login-container form {
    display: flex;
    flex-direction: column;
    width: 250px;
    margin: 0 auto;
    border: 1px solid rgba(0,0,150,0.3);
    padding: 2rem;
    border-radius: 10px;

  }
  .login-container form input {
    border-radius: 5px;
    border: 1px solid blue;
    margin-bottom: 1rem;
  }
  .login-container form button {
    margin-top: 1rem;
  }
</style>