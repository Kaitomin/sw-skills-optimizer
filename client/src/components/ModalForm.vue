<template>
  <div class="blocker"></div>
  <form class="form-modal" @submit="saveChanges">
    <img :src="getSkillIcon(skill.icon)" alt="skill icon" width="50">
    <div>
      <label for="skill-name">Name</label>
      <input type="text" class="text" id="skill-name" v-model="skillUpdated.skillName">
    </div>
    <div>
      <label for="skill-dmg">Dmg</label>
      <input type="text" class="text" id="skill-dmg" v-model="skillUpdated.dmg">
    </div>
    <div>
      <label for="skill-time">Cast full (frame)</label>
      <input type="text" class="text" id="skill-time" v-model="skillUpdated.cast">
    </div>
    <div>
      <label for="skill-cancel">Cast cancel (frame)</label>
      <input type="text" class="text" id="skill-cancel" v-model="skillUpdated.castCancel">
    </div>
    <div>
      <label for="skill-cd">CD</label>
      <input type="text" class="text" id="skill-cd" v-model="skillUpdated.cd">
    </div>
    <div v-if="skillUpdated.dwBoost">
      <label for="skill-dw">DW boost</label>
      <input type="text" class="text" id="skill-dw" v-model="skillUpdated.dwBoost">
    </div>
    <div v-if="skillUpdated.mark">
      <label for="skill-mark">Mark</label>
      <input type="text" class="text" id="skill-mark" v-model="skillUpdated.mark">
    </div>
    <div v-if="skillUpdated.dmgBullet">
      <label for="skill-dmgBullet">Dmg bullet</label>
      <input type="text" class="text" id="skill-dmgBullet" v-model="skillUpdated.dmgBullet">
    </div>
    <div v-if="skillUpdated.dmgRelease">
      <label for="skill-dmgRelease">Dmg release</label>
      <input type="text" class="text" id="skill-dmgRelease" v-model="skillUpdated.dmgRelease">
    </div>
    <div>
      <label for="character">Character</label>
      <select name="character" id="character" v-model="skillUpdated.character">
        <option v-for="char in characters" :key="char._id" :value="char.name">{{ char.name }}</option>
      </select>
    </div>
    <span v-if="error.isError" class="error-msg">{{ error.msg }}</span>
    <button class="btn-save">Save</button>
    <button type="button" class="btn-cancel" @click="closeModal">X</button>
  </form>
</template>

<script>
  import CharacterService from '../services/CharacterService';
  import SkillService from '../services/SkillService';

  import {
    useGetSkillIcon
  } from "../composable/functions";
  
  export default {
    props: [
      'skill'
    ],
    emits: ['close-modal', 'submit'],
    data() {
      return {
        characters: [],
        skillUpdated: {},
        error: { isError: false, msg: '' }
      }
    },
    methods: {
      validateInput({ name, value }) {
        switch (name) {
          case "dmg":
          case "cd":
          case "cast":
          case "castCancel":
          case "dmgBullet":
          case "dmgRelease":
          case "mark":
            if (!/^[0-9]+$/.test(value)) this.error.isError = true;
            break;
          case "skillName":
            if (!/^[-a-z0-9()%>:' ]+$/i.test(value)) this.error.isError = true;
            break;
          case "dwBoost":
            if (!/^[0-9]{1}([.][0-9]{1,4})$/.test(value)) this.error.isError = true;
            break;
          default:
            break;
        }
      },
      closeModal() {
        this.$emit('close-modal')
      },
      getSkillIcon(iconUrl) {
        return useGetSkillIcon(iconUrl);
      },
      async saveChanges(e) {
        e.preventDefault()

        this.error = { isError: false, msg: '' }

        // console.log(this.skill);

        // Check errors
        const arr = Object.entries(this.skillUpdated)
        arr.forEach(input => {
          this.validateInput({ name: input[0], value: input[1] })
        })

        if (this.error.isError) {
          this.error.msg = 'One or more fields are not valid'
          return
        }

        try { 
          await SkillService.updateSkill(this.skillUpdated);
          this.$emit('submit', this.skillUpdated)
        } catch (e) {
          console.log(e);
        }
      },
    },
    async created() {
      const res = await CharacterService.getAllCharacters()
      this.characters = res.data.charList

      this.skillUpdated = {...this.skill}
    },
    mounted() {

    }
  }
</script>

<style scoped>
  .blocker {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    /* filter: blur(5px); */
    background: #0000008a;
    opacity: 0.5;
    z-index: 9;
  }
  .form-modal {
    display: flex;
    flex-direction: column;
    gap: 0.2em 0;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #21252d;
    padding: 2em;
    border-radius: 5px;
    z-index: 99;
    border: 1px solid white;
    color: white;
  }
  .form-modal > div {
    display: flex;
    justify-content: space-between;
    gap: 0 1em;
  }
  img {
    align-self: center;
  }
  .error-msg {
    color: red
  }
  .btn-save {
    border: 1px solid white;
    background-color: black;
    color: white;
    border-radius: 5px;
  }
  .btn-cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
    border: 0;
    background: #a5a5a5;
    border-radius: 5px;
    padding: 0px 10px;
  }
</style>