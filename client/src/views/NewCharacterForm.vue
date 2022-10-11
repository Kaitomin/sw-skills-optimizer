<template>
  <div class="new-character">
    <!-- <h1>Add a character</h1> -->
    <form @submit.prevent="addNewCharacter" enctype="multipart/form-data">
      <div>
        <label>Name</label><br>
        <input type="text" v-model="charName">
      </div>
      <div>
        <label>Avatar</label>
        <input type="file" name="avatar" accept="image/*" ref="file" @change="onSelect">
      </div>
    <button class="btn btn-primary">Add character</button>
    <div>
      <h5>{{ message }}</h5>
    </div>
    </form>
  </div>
</template>

<script>

import CharacterService from '../services/CharacterService.js'

export default {
  data() {
    return {
      charName: '',
      message: '',
      file: ''
    }
  },
  methods: {
    onSelect() {
      const file = this.$refs.file.files[0];
      this.file = file;
      console.log("this.file :", this.file)
    },
    async addNewCharacter() {
      const formData = new FormData();

      formData.append('avatar', this.file);
      formData.append('name', this.charName);
      
      try {
        await CharacterService.addNewCharacter(formData);
        this.message = "Uploaded !"
      } catch (error) {
        console.log('Error :', error);
        this.message = "Something went wrong :("
      }
    }
  },
  beforeCreate() {
    if (this.$root.userRole !== 'ADMIN') this.$router.push('/')
  },
}

</script>

<style scoped>
  .new-character {
    width: 500px;
    margin: 3em auto 0 auto;
    padding: 3em 0 0 0;
    color: white;
  }
  .new-character form {
    display: flex;
    flex-direction: column;
    width: 350px;
    margin: 0 auto;
    border: 1px solid white;
    background: #ffffff1f;
    padding: 1em 2em 0 2em;
  }
  .new-character form > div {
    margin: 1rem 0;
   }
  .new-character form button {
    margin: 1rem 0;
  }
</style>