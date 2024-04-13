<template>
  <div class="container login-container">
    <!-- <h1>Login</h1> -->
    <form @submit.prevent="login">

      <label for="username" class="form-label">Username</label>
      <input type="text" id="username" class="form-control" aria-describedby="usernameHelpBlock" v-model="username" required/>
      <span class="error">{{ error.username }}</span>

      <label for="password" class="form-label">Password</label>
      <input type="password" id="password" class="form-control" aria-describedby="passwordHelpBlock" v-model="password" required/>
      <span class="error">{{ error.password }}</span>

      <label for="captcha" class="form-label">{{ this.captcha.num1 + '+' + this.captcha.num2 }} ?</label> 
      <input type="number" id="captcha" class="form-control" v-model="userInput" min="0" max="50" placeholder="Enter result"/>

      <input type="text" id="email" class="form-label hdn" v-model="hdn" tabindex="-1" autocomplete="off">

      <button class="btn btn-primary">Login</button>

      <p class="errMsg">{{ error.msg }}</p>
      <span v-if="loginAttempts == 0" style="color: red">{{ timer }}</span>
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
      hdn: '',
      error: { username: '', password: '', msg: '' },
      loginAttempts: 3,
      timer: '1:00',
      captcha: { num1: '', num2: ''},
      userInput: ''
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
      if (!this.password.match(/^[a-z0-9!+_]+$/i)) {
        this.error.password = 'Unauthorized characters'
        return
      }
    },
    async login() {
      // Anti-spam
      if (this.hdn) return 
      if (!this.validateCaptcha()) return 

      this.handleErrors(this.username, this.password)

      if (!this.error.username && !this.error.password && this.loginAttempts > 0) {
        try {
          await UserService.login({
            username: this.username.toLowerCase(),
            password: this.password
          });
          // this.$router.go();
          this.$router
            .push({ path: 'Home' })
            .then(() => { this.$router.go(0) })
        } catch (error) {
          this.loginAttempts -= 1
          this.error.msg = `Invalid credentials - Attempts left: ${this.loginAttempts}`

          if (this.loginAttempts == 0) this.disableForm()
        }
      }
    },
    disableForm() {
      this.error.msg = 'Attempts blocked'

      const inputs = document.querySelectorAll('input')
      inputs.forEach(input => input.disabled = true)
      
      const countDown = setInterval(this.startTimer, 1000)

      setTimeout(() => {
        inputs.forEach(input => input.disabled = false)
        this.loginAttempts = 3
        this.error.msg = ''
        clearInterval(countDown)
        this.timer = '1:00'
      }, 60000)
    },
    startTimer() {
      let timeArray = this.timer.split(/[:]+/);
      let m = timeArray[0];
      let s = this.checkSecond((timeArray[1] - 1));

      if (s == 59) { m = m - 1 }
      if (m < 0) return
      
      this.timer = `${m}:${s}`
    },
    checkSecond(sec) {
      if (sec < 10 && sec >= 0) {sec = "0" + sec};
      if (sec < 0) {sec = "59"};
      return sec;
    },
    generateCaptcha() {
      this.captcha.num1 = Math.trunc(Math.random() * 10)
      this.captcha.num2 = Math.trunc(Math.random() * 10)
    },
    validateCaptcha() {
      const captchaResult = this.captcha.num1 + this.captcha.num2

      if (captchaResult === this.userInput) {
        return true
      } else {
        return false
      }
    }
  },
  async beforeCreate() {
    try {
      await UserService.loginGet();
    } catch (error) {
      this.$router.push('/')
    }
  },
  created() {
    this.generateCaptcha()
  }
}
</script>

<style scoped>
  h1, label {
    color: white;
  }
  .login-container {
    display: flex;
    justify-content: center;
    padding: 5em 0;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 250px;
    border: 1px solid #95989e;
    background: #2d343f;
    padding: 2rem;
    border-radius: 5px;
  }
  form input {
    border-radius: 5px;
    margin-bottom: 1rem;
  }
  form button {
    margin-top: 1rem;
  }
  .hdn {
    display: none;
  }
  .error, .errMsg {
    color: red;
  }
  .errMsg {
    margin: 1em 0 0 0 ;
  }
</style>