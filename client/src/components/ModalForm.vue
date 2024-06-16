<template>
  <div class="blocker"></div>
  <form class="form-modal" @submit="saveChanges">
    <img 
      v-if="action == 'update'"
      :src="skill.icon" 
      alt="skill icon" 
      width="50"
    >
    <div class="form-inputs">
      <div>
        <label for="skill-name">Name</label>
        <input type="text" class="text" id="skill-name" v-model="skillUpdated.skillName" required>
      </div>
      <div>
        <label for="skill-dmg">Damage (%)</label>
        <input type="text" class="text" id="skill-dmg" v-model="skillUpdated.dmg" required>
      </div>
      <div>
        <label for="skill-time">Cast full (frame)</label>
        <input type="text" class="text" id="skill-time" v-model="skillUpdated.cast" required>
      </div>
      <div>
        <label for="skill-cancel">Cast cancel (frame)</label>
        <input type="text" class="text" id="skill-cancel" v-model="skillUpdated.castCancel" required>
      </div>
      <div>
        <label for="skill-cd">CD (s)</label>
        <input type="text" class="text" id="skill-cd" v-model="skillUpdated.cd" required>
      </div>
      <div v-if="skillUpdated.dwBoost">
        <label for="skill-dw">DW boost</label>
        <input type="text" class="text" id="skill-dw" v-model="skillUpdated.dwBoost" required>
      </div>
      <div v-if="skillUpdated.mark">
        <label for="skill-mark">Mark</label>
        <input type="text" class="text" id="skill-mark" v-model="skillUpdated.mark" required>
      </div>
      <div v-if="skillUpdated.dmgBullet">
        <label for="skill-dmgBullet">Dmg bullet</label>
        <input type="text" class="text" id="skill-dmgBullet" v-model="skillUpdated.dmgBullet" required>
      </div>
      <div v-if="skillUpdated.dmgRelease">
        <label for="skill-dmgRelease">Dmg release</label>
        <input type="text" class="text" id="skill-dmgRelease" v-model="skillUpdated.dmgRelease" required>
      </div>
      <div>
        <label>Icon</label>
        <input type="file" name="icon" accept="image/*" ref="skillIcon" class="btn-file" @change="onSelect">
      </div>

      <div>
        <label for="character">Character</label>
        <select name="character" id="character" v-model="skillUpdated.character" required>
          <option v-for="char in characters" :key="char._id" :value="char.name">{{ char.name }}</option>
        </select>
      </div>
    </div>
    <span v-if="error.isError" class="error-msg">{{ error.msg }}</span>
    <button class="btn-save">Save</button>
    <button type="button" class="btn-cancel" @click="closeModal">X</button>
  </form>
</template>

<script>
  import CharacterService from '../services/CharacterService';
  import SkillService from '../services/SkillService';
  
  export default {
    props: [
      'skill',
      'action'
    ],
    emits: ['close-modal', 'submit'],
    data() {
      return {
        characters: [],
        skillUpdated: {},
        error: { isError: false, msg: '' },
        skillIcon: ''
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
      onSelect() {
        const file = this.$refs.skillIcon.files[0]
        this.skillIcon = file
      },
      async saveChanges(e) {
        e.preventDefault()
   
        this.error = { isError: false, msg: '' }

        if (this.action == 'add' && !this.skillIcon) {
          this.error.isError = true
          this.error.msg = 'File icon is missing'
          return
        } 

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
          const formData = new FormData()

          formData.append('_id', this.skillUpdated._id)
          formData.append('icon', this.skillIcon)
          formData.append('skillName', this.skillUpdated.skillName)
          formData.append('dmg', this.skillUpdated.dmg)
          formData.append('cast', this.skillUpdated.cast)
          formData.append('castCancel', this.skillUpdated.castCancel)
          formData.append('cd', this.skillUpdated.cd)
          formData.append('character', this.skillUpdated.character)
          formData.append('secureUrl', this.skillUpdated.icon)

          for (const pair of formData.entries()) {
            console.log(pair[0], pair[1])
          }

          switch (this.action) {
            case 'update':
              await SkillService.update(formData)
              this.$emit('submit', this.skillUpdated)
              break;
            case 'add':
              await SkillService.add(formData)
              this.$emit('submit', this.skillUpdated)
              break;
            default:
              console.log('Action type not defined')
          }
        } catch (e) {
          console.log(e);
        }
      },
    },
    async created() {
      const res = await CharacterService.getAllCharacters()
      this.characters = res.data.charList

      if (this.action == 'update') this.skillUpdated = {...this.skill}
    },
  }
</script>

<style scoped>
  .blocker {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #0000008a;
    opacity: 0.5;
    z-index: 9;
  }
  .form-modal {
    display: flex;
    flex-direction: column;
    gap: 2em 0;
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
  .form-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.5em 0;
    margin-top: 1em;
  }
  .form-inputs > div {
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
    border: 1px solid #95989e;
    background-color: #00ffff75;
    color: white;
    border-radius: 5px;
  }
  .btn-file {
    width: 190px;
    max-width:100%;  
    white-space: normal;
    word-wrap: break-word; 
  }
  .btn-cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    color: red;
    border: 0;
    /* background: #a5a5a5; */
    background: transparent;
    border-radius: 5px;
    padding: 0px 10px;
    font-weight: 900;
    transition: background 0.1s ease-in-out;
  }
  .btn-cancel:hover {
    background: #95989e;
  }
</style>