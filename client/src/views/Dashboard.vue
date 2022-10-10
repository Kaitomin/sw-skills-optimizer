<template>
  <div class="dashboard">
    <div class="characters-container">
      <div class="characters">
        <div v-for="char in charList" :key="char._id" @click="getCharacterSkills(char.name)" :class="currentCharacter === char.name ? 'active' : ''">
          <img
            :src="getCharacterIcon(char.icon)"
            :alt="char.name + ' icon'"
            width="150"
            height="150"
            v-if='char.name !== "tmp"'
          >
        </div>
      </div>
      <router-link  v-if="$root.userRole === 'ADMIN'" to="/add-new-skill" class="add-character">Add skill</router-link>
    </div>
    <div class="skills-container">
      <table class="table table-striped skills-table">
        <thead>
          <tr>
            <th scope="col">Icon</th>
            <th scope="col" style="width: 340px">Skill</th>
            <th scope="col">Damage</th>
            <th scope="col" v-if="currentCharacter === 'Ephnel'">Bullet</th>
            <th scope="col" v-if="currentCharacter === 'Ephnel'">Limit release</th>
            <th scope="col">CD</th>
            <th scope="col">Cast</th>
            <th scope="col">Cast cancel</th>
            <th scope="col">DW</th>
            <th scope="col" v-if="currentCharacter === 'Chii'">Mark</th>
            <th scope="col">Character</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in skillsList" :key="skill._id" :id="`tr-${skill._id}`">
            <td scope="row">
              <img :src="getSkillIcon(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
            </td>
            <td>
              <input type="text" name="skillName" class="skill-name" :value="skill.skillName" title="Alphanumeric ( - ) % " disabled>
            </td>
            <td>
              <input type="text" name="dmg" class="skill-dmg" :value="skill.dmg" title="Integer" disabled>
            </td>
            <td v-if="currentCharacter === 'Ephnel'">
              <input type="text" name="dmgBullet" class="ephnel-bullet" :value="skill.dmgBullet" title="Integer" disabled>
            </td>
            <td v-if="currentCharacter === 'Ephnel'">
              <input type="text" name="dmgRelease" class="ephnel-release" :value="skill.dmgRelease" title="Integer" disabled>
            </td>
            <td>
              <input type="text" name="cd" :value="skill.cd" title="Integer" disabled>
            </td>
            <td>
              <input type="text" name="cast" :value="skill.cast" title="Integer" disabled>
            </td>
            <td>
              <input type="text" name="castCancel" :value="skill.castCancel" title="Integer" disabled>
            </td>
            <td>
              <input type="text" name="dwBoost" class="skill-dw" :value="skill.dwBoost" title="Float (minimum one digit after floating point)" disabled>
            </td>
            <td v-if="currentCharacter === 'Chii'">
              <input type="text" name="mark" class="chii-mark" :value="skill.mark" title="Integer" disabled>
            </td>
            <td>
              <input type="text" name="character" class="character-name" :value="skill.character" disabled>
            </td>
            <td class="actions">
              <i class="fa-solid fa-pen-to-square" title="Edit skill" @click="editSkill($event, skill)"></i>
              <div class="hidden">
                <i class="fa-solid fa-check" title="Apply changes" @click="saveChanges($event, skill)"></i>
                <i class="fa-solid fa-xmark" title="Cancel changes" @click="cancelChanges($event, skill)"></i>
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

import { useGetCharactersIcons, useGetCharacterIcon, useGetSkillIcon } from '../composable/functions';

export default {
  data() {
    return {
      charList: [],
      skillsList: [],
      currentCharacter: '',
      error: false
    }
  },
  methods: {
    async getAllCharacters() {
      this.charList = await useGetCharactersIcons()
    },
    getCharacterIcon(iconUrl) {
      return useGetCharacterIcon(iconUrl)
    },
    getSkillIcon(iconUrl) {
      return useGetSkillIcon(iconUrl)
    },
    getCharacterSkills(name) {
      CharacterService.getCharacterInfo(name)
      .then(res => {
        this.skillsList = res.data.skills
        this.currentCharacter = name
      })
    },
    validateInput({name, value}) {
      switch(name) {
        case 'dmg':
        case 'cd':
        case 'cast':
        case 'castCancel':
        case 'dmgBullet':
        case 'dmgRelease':
        case 'mark':
          if (!(/^[0-9]+$/).test(value)) this.error = true
          break
        case 'skillName':
          if (!(/^[-a-z0-9()%' ]+$/i).test(value)) this.error = true
          break
        case 'dwBoost': 
          if (!(/^[0-9]{1}([.][0-9]{1,4})$/).test(value)) this.error = true
          break
        default: 
          break
      }
    },
    editSkill(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`)

      inputs.forEach(input => {
        if (input.name === 'dwBoost' && input.value == '' || input.name === 'character') return

        input.classList.add('edit')
        input.disabled = false
      })

      event.target.classList.add('hidden')
      event.target.nextElementSibling.className = ''
    },
    async saveChanges(event, skill) {
      this.error = false

      const inputs = document.querySelectorAll(`#tr-${skill._id} input`)
      const skillObj = {...skill}

      inputs.forEach(input => {
        // console.log(input)
        if (input.name === 'dwBoost' && input.value == '') return

        this.validateInput({name: input.name, value: input.value})

        skillObj[input.name] = input.value
      })

      // if (!skill.dwBoost) {
      //   delete skillObj.dwBoost
      // }

      if (this.error) {
        // console.log('Error', this.error);
        confirm('Unauthorized characters, hover over each input for more details')
        return
      } else {
        // console.log(skillObj)

         try {

          // Test
          const res = await SkillService.updateSkill(skillObj)
          const skill = res.data.skill
          // endTest


          // await SkillService.updateSkill(skillObj)
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
    this.getCharacterSkills('Ephnel')
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





  /* ---------- */
  /* Characters */
  /* ---------- */
  .characters-container {
    display: flex;
    flex-direction: column;
    gap: 30px 0;
    width: 275px;
  }
  .characters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    height: fit-content;
    gap: 10px;
    border: 1px solid white;
    background: #042c2c;
    padding: 1em 10px;
  }
  .characters img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
  .characters > div {
    border-radius: 100%;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .characters > div:hover {
    cursor: pointer;
    background-color: #ffffff29;
  }
  .active {
    background-color: #00b8ff6b !important;
  }





  /* ------------ */
  /* Skills Table */
  /* ------------ */
  .skills-container {
    min-width: 1000px;
    width: 1200px;
    height: fit-content;
    border: 1px solid white;
  }
  .skills-container th {
    width: 7.5%;
  }
  .add-character {
    float: left;
    padding: 0.2em 0.5em;
    background: none;
    border: 2px solid white;
    text-decoration: none;
    color: white;
  }
  .add-character:hover {
    background: #ffffff21
  }
  .skills-table tr {
    background-color: #042c2c;
  }
  .skills-table > tbody > tr:nth-of-type(odd) {
    background-color: #071f1f;
  }
  table {
    color: white;
    margin: 0;
  }
  tbody td {
    vertical-align: middle;
  }

  /* Stats inputs */
  input {
    background: none;
    /* outline: 0; */
    border: 0;
    color: white;
    text-align: center;
    width: 60px;
  }
  input.skill-name {
    width: 100%;
  }
  input.skill-dmg,
  input.character-name,
  input.skill-dw
  {
    width: 60px;
  }
  input::placeholder {
    color: white;
  }

  /* Actions icons */
  .actions .fa-solid:hover {
    cursor: pointer;
  }
  .fa-pen-to-square:hover {
    color: #00b8ff;
  }
  .fa-check, .fa-xmark {
    font-size: 20px;
  }
  .fa-check {
    color: green;
  }

  .fa-xmark {
    color: red;
  }
  .edit {
    background: #ffffff61;
  } 
  .hidden {
    display: none!important;
  }
  .actions > div {
    display: flex;
    justify-content: space-around;
  }



  /* ---------- */
  /* Responsive */
  /* ---------- */
  @media screen and (max-width: 1550px) {
    .dashboard {
      flex-direction: column;
      width: 100%;
      gap: 2em;
    }

    /* Characters */
    .characters-container {
      width: 100%;
    }

    /* Skills */
    .skills-container {
      min-width: 0;
      width: 100%;
    }
  }


</style>