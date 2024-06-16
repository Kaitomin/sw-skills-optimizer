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
        <label>Cast Cancel</label>
        <input type="text" v-model="castCancel">
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
        <input type="file" name="icon" accept="image/*" ref="skillIcon" @change="onSelect">
      </div>

      <button>Add skill</button>

    </form>
  </div>
</template>

<script setup>
  import { inject, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import CharacterService from '../services/CharacterService'
  import SkillService from '../services/SkillService'

  const skillIcon = ref(null)
  let skillName = ''
  let dmg = ''
  let cast = ''
  let castCancel = ''
  let cd = ''
  let character = ''
  let characters = ref([])
  let userRole = inject('userRole')

  const getAllCharacters = async() => {
    try {
      const res = await CharacterService.getAllCharacters()
      characters.value = res.data.charList.map(char => char)
    } catch (error) {
      console.log(error)
    }
  }

  const onSelect = () => {
    // const file = skillIcon.value.file.files[0]
    skillIcon.value = skillIcon.value.files[0]
  }

  const addNewSkill = async() => {
    try {
      const formData = new FormData()

      console.log(skillIcon)

      formData.append('icon', skillIcon.value)
      formData.append('skillName', skillName)
      formData.append('dmg', dmg)
      formData.append('cast', cast)
      formData.append('castCancel', castCancel)
      formData.append('cd', cd)
      formData.append('character', character)

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      await SkillService.add(formData)
      // message = "Skill added !"
    } catch (error) {
      console.log(error);
      // message = "Something went wrong :("
    }
  }

  const router = useRouter()
  if (!userRole) router.push('/')

  getAllCharacters()
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
    color: white;
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