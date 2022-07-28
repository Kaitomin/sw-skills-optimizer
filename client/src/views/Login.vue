<template>
  <div class="container login-container">
    <!-- <h1>Login</h1> -->
    <form @submit.prevent="login">
      <label>Username</label>
      <input type="text" v-model="username" required/>
      <span class="error">{{ error.username }}</span>
      <label>Password</label>
      <input type="password" v-model="password" required/>
      <span class="error">{{ error.password }}</span>
      <button class="btn btn-primary">Login</button>
      <p class="errMsg">{{ error.msg }}</p>
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
      error: {username: '', password: '', msg: ''},
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
        this.error.username = 'Unauthorized characters'
        return
      }
      if (!this.password.match(/^[a-z0-9!+]+$/i)) {
        this.error.password = 'Unauthorized characters'
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
          this.error.msg = 'Wrong credentials'
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
    margin: 3em auto 0 auto;
    border: 1px solid white;
    background: #ffffff1f;
    padding: 2rem;
    border-radius: 10px;
  }
  form input {
    border-radius: 5px;
    margin-bottom: 1rem;
  }
  form button {
    margin-top: 1rem;
  }
  .error, .errMsg {
    color: red;
  }
  .errMsg {
    margin: 1em 0 0 0 ;
  }
</style>