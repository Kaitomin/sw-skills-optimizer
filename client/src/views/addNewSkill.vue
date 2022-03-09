<template>
  <div class="add-skill">
    <h1>Add a skill</h1>
    <form @submit.prevent="addNewSkill" enctype="multipart/form-data">
      <div>
        <label>Name</label>
        <input type="text" v-model="skillName">
      </div>
      
      <div>
        <label>Dmg</label>
        <input type="text" v-model="dmg">
      </div>

      <div>
        <label>Cast Time</label>
        <input type="text" v-model="cast">
      </div>

      <div>
        <label>CD</label>
        <input type="text" v-model="cd">
      </div>

      <div>
        <label>Character</label>
        <select v-model="character">
          <option v-for="char in characters" :key="char._id" :value="char.name">{{ char.name }}</option>
        </select>
      </div>

      <div>
        <label>Icon</label>
        <input type="file" name="icon" accept="image/*" ref="file" @change="onSelect">
      </div>

      <button>Add skill</button>

    </form>
  </div>
</template>

<script>

import CharacterService from '../services/CharacterService'
import SkillService from '../services/SkillService';

export default {
  data() {
    return {
      skillName: '',
      dmg: '',
      cast: '',
      cd: '',
      character: '',
      characters: [],
      file: ''
    }
  },

  methods: {
    async getAllCharacters() {
      try {
        const res = await CharacterService.getAllCharacters();
        this.characters = res.data.charList.map(char => char);
      } catch (error) {
        console.log(error)
      }
    },
    onSelect() {
      const file = this.$refs.file.files[0];
      this.file = file;
    },
    async addNewSkill() {
      try {
        const formData = new FormData();

        formData.append('icon', this.file);
        formData.append('skillName', this.skillName);
        formData.append('dmg', this.dmg);
        formData.append('cast', this.cast);
        formData.append('cd', this.cd);
        formData.append('character', this.character);

        await SkillService.addNewSkill(formData);
        this.message = "Skill added !"
      } catch (error) {
        console.log(error);
        this.message = "Something went wrong :("
      }
    },
  },
  beforeCreate() {
    if (!this.$root.userRole) this.$router.push('/')
  },
  created() {
    this.getAllCharacters()
  }
  
}
</script>

<style scoped>
  .add-skill form {
    max-width: 250px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .add-skill div, .add-skill input {
    width: 100%;
  }
  .add-skill div {
    display: flex;
    flex-direction: column;
    justify-content: baseline;
  }
  .add-skill input {
    height: 25px;
  }
  .add-skill div label {
    text-align: left;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .add-skill div {
    margin: 10px 0;
  }
  .add-skillbutton {
    border: none;
    height: 50px;
    width: 100px;
    background: rgb(23, 162, 167);
    color: white;
    font-size: 1.2rem;
  }
</style>