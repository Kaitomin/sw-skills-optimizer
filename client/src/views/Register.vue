<template>
  <div class="container register-container">
    <h1>Sign up</h1>
    <form @submit.prevent="register">
      <label>Username</label>
      <input type="text" v-model="username" required/>
      <label>Password</label>
      <input type="password" v-model="password" required/>
      <label>Confirm password</label>
      <input type="password" v-model="confirmPass" required/>
      <button class="btn btn-primary">Register</button>
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
      confirmPass: ''
    }
  },
  methods: {
    async register() {
      if (this.password != this.confirmPass) return;

      try {
        const res = await UserService.register({
          username: this.username.toLowerCase(),
          password: this.password
        });

        const data = res.data.user;
        console.log("Registered user :", data);

      } catch (error) {
        console.log("Registration error :", error);
      }
   
    }
  },
}
</script>

<style scoped>
  .register-container {
    margin-top: 5rem;
    color: white;
  }
  .register-container form {
    display: flex;
    flex-direction: column;
    width: 250px;
    margin: 0 auto;
    background: #00d0ff31;
    padding: 2rem;
    border-radius: 10px;

  }
  .register-container form input {
    border-radius: 15px;
    border: 1px solid rgba(0,150,150, 0.2);
    margin-bottom: 1rem;
    height: 30px;
    padding: 0 10px;
  }
  .register-container form button {
    margin-top: 1rem;
  }
</style>