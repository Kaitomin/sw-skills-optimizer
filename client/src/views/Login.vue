<template>
  <div class="container login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label>Username</label>
      <input type="text" v-model="username" required/>
      <span class="error">{{ error.username }}</span>
      <label>Password</label>
      <input type="password" v-model="password" required/>
      <span class="error">{{ error.password }}</span>
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
      error: {username: '', password: ''}
    }
  },
  methods: {
    handleErrors() {
      this.error.username = this.error.password = ''
      if (this.username.length < 5 ) {
        this.error.username = 'Length must be > 5'
        return
      }
      if (this.password.length < 5 ) {
        this.error.password = 'Length must be > 5'
        return
      }
      if (!this.username.match(/^[a-z0-9]+$/i)) {
        this.error.username = 'Only letters and numbers allowed '
        return
      }
      if (!this.password.match(/^[a-z0-9!+]+$/i)) {
        this.error.password = 'Only letters, numbers, ! and + allowed'
        return
      }
    },
    async login() {
      this.handleErrors(this.username, this.password)

      if (!this.error.username && !this.error.password) {
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
  h1, label {
    color: white;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 250px;
    margin: 0 auto;
    border: 1px solid rgba(0,0,150,0.3);
    padding: 2rem;
    border-radius: 10px;
  }
  form input {
    border-radius: 5px;
    border: 1px solid blue;
    margin-bottom: 1rem;
  }
  form button {
    margin-top: 1rem;
  }
  .error {
    color: red;
  }
</style>