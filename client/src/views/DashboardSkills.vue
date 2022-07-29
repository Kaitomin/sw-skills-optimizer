<template>
  <div class="dashboard">
    <div>
      <div class="characters">
        <div v-for="char in charList" :key="char._id" @click="getCharacterSkills(char.name)">
          <img
            :src="getCharIcon(char.icon)"
            :alt="char.name + ' icon'"
            width="150"
            height="150"
          >
        </div>
      </div>
      <router-link to="/add-new-skill" class="addChar">Add skill</router-link>
    </div>
    <div class="skills">
      <table class="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Icon</th>
            <th scope="col">Skill</th>
            <th scope="col">Dmg</th>
            <th scope="col" v-if="currentCharacter === 'Ephnel'">Bullet</th>
            <th scope="col" v-if="currentCharacter === 'Ephnel'">R+B</th>
            <th scope="col">CD</th>
            <th scope="col">Cast</th>
            <th scope="col">C.Cancel</th>
            <th scope="col">DW</th>
            <th scope="col" v-if="currentCharacter === 'Chii'">Mark</th>
            <th scope="col">Character</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in skillsList" :key="skill._id" :id="`tr-${skill._id}`">
            <td scope="row">
              <img
                :src="getSkillIcon(skill.icon)"
              >
            </td>
            <td>
              <input type="text" name="skillName" class="skill-name" :value="skill.skillName" disabled>
            </td>
            <td>
              <input type="text" name="dmg" class="skill-dmg" :value="skill.dmg" disabled>
            </td>
            <td v-if="currentCharacter === 'Ephnel'">
              <input type="text" name="dmgBullet" class="ephnel-bullet" :value="skill.dmgBullet" disabled>
            </td>
            <td v-if="currentCharacter === 'Ephnel'">
              <input type="text" name="dmgRelease" class="ephnel-release" :value="skill.dmgRelease" disabled>
            </td>
            <td>
              <input type="text" name="cd" :value="skill.cd" disabled>
            </td>
            <td>
              <input type="text" name="cast" :value="skill.cast" disabled>
            </td>
            <td>
              <input type="text" name="castCancel" :value="skill.castCancel" disabled>
            </td>
            <td>
              <input type="text" name="dwBoost" class="skill-dw" :value="skill.dwBoost" disabled>
            </td>
            <td v-if="currentCharacter === 'Chii'">
              <input type="text" name="mark" class="chii-mark" :value="skill.mark" disabled>
            </td>
            <td>
              <input type="text" name="character" class="character-name" :value="skill.character" disabled>
            </td>
            <td class="actions">
              <i class="fa-solid fa-pen-to-square" @click="editSkill($event, skill)"></i>
              <div class="hidden">
                <i class="fa-solid fa-check" @click="saveChanges($event, skill)"></i>
                <i class="fa-solid fa-xmark" @click="cancelChanges($event, skill)"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CharacterService from '../services/CharacterService';
import SkillService from '../services/SkillService'

export default {
  data() {
    return {
      charList: [],
      skillsList: [],
      currentCharacter: ''
    }
  },
  methods: {
    async getAllCharacters() {
      try {
        const res = await CharacterService.getAllCharacters()
        this.charList = res.data.charList;
      } catch (error) {
        console.log('Error :', error);
      }
    },
    getCharIcon(iconUrl) {
      return require('@/assets/uploads/characters/' + iconUrl.split('.')[0] + '.png')
    },
    getSkillIcon(iconUrl) {
      return require('@/assets/uploads/skills/' + iconUrl.split('.')[0] + '.png')
    },
    getCharacterSkills(name) {
      CharacterService.getCharacterInfo(name)
      .then(res => {
        this.skillsList = res.data.skills
        this.currentCharacter = name
        // console.log('Table refreshed')
      })
    },
    editSkill(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`)

      inputs.forEach(input => {
        input.classList.add('edit')
        input.disabled = false
      })

      event.target.classList.add('hidden')
      event.target.nextElementSibling.className = ''
    },
    async saveChanges(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`)
      const skillObj = {...skill}

      inputs.forEach(input => {
        skillObj[input.name] = input.value
      })

      if (!skill.dwBoost) {
        delete skillObj.dwBoost
      }

      // console.log(skillObj)

      try {
        await SkillService.updateSkill(skillObj)
        await this.getCharacterSkills(this.currentCharacter)

        inputs.forEach(input => {
          input.classList.remove('edit')
          input.disabled = true
        })

        event.target.parentElement.className = 'hidden'
        event.target.parentElement.previousElementSibling.classList.remove('hidden')
      } catch(err) {
        console.log(err)
      }
    },
    cancelChanges(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`)

      inputs.forEach(input => {
        input.classList.remove('edit')
        input.disabled = true

        if (!input.value) input.value = ''
        else input.value = skill[input.name]
      })

      event.target.parentElement.className = 'hidden'
      event.target.parentElement.previousElementSibling.classList.remove('hidden')
    }
  },
  beforeCreate() {
    if (!this.$root.userRole) this.$router.push('/')
  },
  created() {
    this.getAllCharacters();
    this.getCharacterSkills('Dana')
  },
}
</script>

<style scoped>
  .dashboard {
    display: flex;
    justify-content: space-around;
    width: 95%;
    margin: 2em auto 4em auto;
  }
  .dashboard > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 30px 0;
    width: 435px;
  }
  .characters {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: fit-content;
    gap: 10px;
  }
  .characters img {
    width: 100px;
    height: 100px;
  }
  .characters img:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  .skills {
    min-width: 1000px;
  }
  .addChar {
    float: left;
    padding: 0.2em 0.5em;
    background: none;
    border: 2px solid white;
    text-decoration: none;
    color: white;
  }
  .addChar:hover {
    background: #ffffff21
  }
  table {
    color: white;
  }
  tbody td {
    vertical-align: middle;
  }
  input {
    background: none;
    outline: 0;
    border: 0;
    color: white;
    text-align: center;
    width: 40px;
  }
  input.skill-name {
    width: 150px;
  }
  input.skill-dmg {
    width: 55px;
  }
  input.character-name {
    width: 60px;
  }
  input.skill-dw {
    width: 60px;
  }
  input::placeholder {
    color: white;
  }
  .edit {
    background: #78787857;
  }
  .hidden {
    display: none!important;
  }

  .actions > div {
    display: flex;
    justify-content: space-around;
  }
</style>