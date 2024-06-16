<template>
  <ModalForm 
    v-if="showModalForm" 
    :skill="selectedSkill" 
    :action="actionType"
    @close-modal="showModalForm = false" 
    @submit="saveChanges"
  />
  <div class="dashboard">
    <div
      v-show="showModal == true"
      class="alert modal-container"
      :class="error ? 'alert-danger' : 'alert-success'"
      role="alert"
    >
      {{ error ? "Invalid input" : "Skill updated" }}
    </div>

    <div>
      <div class="logger-container">
        <p>Changelog</p>
        <div>
          <div v-for="log in sortedLogger" :key="log._id">
            {{ log.date }} |
            {{ log.skill.skillName }}
            ◼ Dmg = {{ log.skill.dmg }}
            {{
              log.skill.dmgBullet ? `◼ Dmg bullet = ${log.skill.dmgBullet}` : null
            }}
            {{
              log.skill.dmgRelease
                ? `◼ Dmg release = ${log.skill.dmgRelease}`
                : null
            }}
            {{ log.skill.mark ? `◼ Mark = ${log.skill.mark}` : null }}
            ◼ Cast = {{ log.skill.cast }} ◼ Anim.cancel =
            {{ log.skill.castCancel }} ◼ CD = {{ log.skill.cd }}
            {{ log.skill.dwBoost ? `◼ DW = ${log.skill.dwBoost}` : null }}
          </div>
        </div>
      </div>
      <div>
        <div class="characters-container">
          <div class="characters">
            <div
              v-for="char in charList"
              :key="char._id"
              :class="{
                active: currentCharacter === char.name, 
                // hide: char.name == 'tmpChar' // For testing
              }"
              @click="currentCharacter = char.name"
            >
              <!-- <div
                v-if="char.name !== 'tmpChar'"
                @click="getCharacterSkills(char.name)"
              >
                <img
                  :src="getCharacterIcon(char.icon)"
                  :alt="char.name + ' icon'"
                  width="150"
                  height="150"
                />
              </div> -->

              <!-- For testing -->
              <div
                @click="getCharacterSkills(char.name)"
              >
                <img
                  :src="getCharacterIcon(char.icon)"
                  :alt="char.name + ' icon'"
                  width="150"
                  height="150"
                />
              </div>

            </div>
          </div>
          <button
            class="add-skill"
            @click="addSkill"
          >
            Add skill
          </button
          >
        </div>
        <div class="skills-container">
          <table class="table table-striped table-skills">
            <thead>
              <tr>
                <th scope="col">Icon</th>
                <th scope="col" style="width: 340px">Skill</th>
                <th scope="col">Damage</th>
                <th scope="col" v-if="currentCharacter === 'Ephnel'">Bullet</th>
                <th scope="col" v-if="currentCharacter === 'Ephnel'">
                  Limit release
                </th>
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
              <tr
                v-for="skill in skillsList"
                :key="skill._id"
                :id="`tr-${skill._id}`"
              >
                <td scope="row">
                  <img
                    :src="skill.icon"
                    :alt="skill.skillName + ' icon'"
                    width="48"
                    height="48"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="skillName"
                    class="skill-name"
                    :value="skill.skillName"
                    title="Alphanumeric (-)%>:"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="dmg"
                    class="skill-dmg"
                    :value="skill.dmg"
                    title="Integer"
                    disabled
                  />
                </td>
                <td v-if="currentCharacter === 'Ephnel'">
                  <input
                    type="text"
                    name="dmgBullet"
                    class="ephnel-bullet"
                    :value="skill.dmgBullet"
                    title="Integer"
                    disabled
                  />
                </td>
                <td v-if="currentCharacter === 'Ephnel'">
                  <input
                    type="text"
                    name="dmgRelease"
                    class="ephnel-release"
                    :value="skill.dmgRelease"
                    title="Integer"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="cd"
                    :value="skill.cd"
                    title="Integer"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="cast"
                    :value="skill.cast"
                    title="Integer"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="castCancel"
                    :value="skill.castCancel"
                    title="Integer"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="dwBoost"
                    class="skill-dw"
                    :value="skill.dwBoost"
                    title="Float (min 1 | max 4 digits after floating point)"
                    disabled
                  />
                </td>
                <td v-if="currentCharacter === 'Chii'">
                  <input
                    type="text"
                    name="mark"
                    class="chii-mark"
                    :value="skill.mark"
                    title="Integer"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="character"
                    class="character-name"
                    :value="skill.character"
                    disabled
                  />
                </td>
                <td class="actions">
                  <i
                    class="fa-solid fa-pen-to-square"
                    title="Edit skill"
                    @click="updateSkill(skill)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, inject, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import ModalForm from '../components/ModalForm.vue'
  import CharacterService from "../services/CharacterService";
  import LoggerService from "../services/LoggerService";

  import {
    useGetCharactersIcons,
    useGetCharacterIcon,
    useGetSkillIcon,
    useSetLogger
  } from "../composable/functions";


  let charList = ref([])
  let skillsList = ref([])
  let logger = ref([])
  let currentCharacter = ""
  let error = false
  let showModal = false
  let showModalForm = ref(false)
  let selectedSkill = {}
  let userRole = inject('userRole')
  let actionType = ref(null)

  const getAllCharacters = async() => {
    charList.value = await useGetCharactersIcons();
  }

  const getCharacterIcon = (iconUrl) => {
    return useGetCharacterIcon(iconUrl);
  }


  const getCharacterSkills = (name) => {
    CharacterService.getCharacterInfo(name).then(res => {
      skillsList.value = res.data.skills;
      currentCharacter = name;
    })
  }

  const getLogger = () => {
    LoggerService.getLogger().then(res => (logger.value = res.data.logger));
  }

  const updateSkill = (event) => {
    selectedSkill = event
    actionType.value = 'update'
    showModalForm.value = true
  }

  const addSkill = () => {
    actionType.value = 'add'
    showModalForm.value = true
  }

  const saveChanges= async(skill) => {
    try {
      showModalForm.value = false

      await getCharacterSkills(currentCharacter)
      if (skill.character != 'tmpChar') await useSetLogger(skill)
    } catch (err) {
      console.log(err)
    }

    getLogger()
  }

  const sortedLogger = computed(() => Array.from(logger.value).reverse())

  const router = useRouter()

  if (!userRole.value) router.push('/')
  
  getAllCharacters()
  getLogger()
  getCharacterSkills("Iris")
</script>

<style scoped>
  .table-skills {
    margin: 0;
  }
  .logger-container {
    color: white;
  }
  .logger-container > div {
    overflow-y: scroll;
    margin: 0 auto;
    height: 100px;
    padding: 1em 2em;
    text-align: left;
    border: 1px solid #95989e;
    border-radius: 5px;
    background: #2d343f;
  }
  .logger-container p {
    font-style: italic;
  }
  .logger-container ~ div {
    display: flex;
    justify-content: space-between;
    gap: 1em;
  }
  .dashboard {
    margin-top: 2em;
  }
  .dashboard > div:last-child {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    gap: 2em 0;
    width: 90%;
    margin: 2em auto 4em auto;
  }
  .dashboard::before {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    /* top: 0; */
    width: 100%;
    z-index: -999;
    opacity: 0.8;
    box-shadow: inset 0 0 200px 175px black;
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    animation: 1s ease-in 1s fadeIn;
  }

  /* Animation */
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.8;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.8;
    }
  }

  /* Modal */
  .modal-container {
    position: fixed;
    z-index: 999;
    top: 85px;
    left: 50%;
    width: 165px;
    font-weight: 900;
    border: 2px solid;
    transform: translate(-50%, 0px);
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
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    height: fit-content;
    gap: 10px;
    border: 1px solid #95989e;
    background: #2d343f;
    padding: 1em 10px;
    border-radius: 5px;
  }
  .characters img {
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }
  .characters > div {
    border-radius: 100%;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .characters > div:not(div:last-child):hover {
    cursor: pointer;
    background-color: #ffffff29;
  }
  .active {
    background-color: #00ffff8f !important;
  }
  .hide {
    display: none !important;
  }

  /* ------------ */
  /* Skills Table */
  /* ------------ */
  .skills-container {
    min-width: 1000px;
    width: 1200px;
    height: fit-content;
  }
  .skills-container th {
    width: 7.5%;
  }
  .add-skill {
    float: left;
    padding: 0.2em 0.5em;
    background: #2d343f;
    border: 1px solid #95989e;
    text-decoration: none;
    color: white;
    border-radius: 5px;
  }
  .add-skill:hover {
    background: #ffffff21;
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
  input.skill-dw {
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
  .fa-check,
  .fa-xmark {
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
    display: none !important;
  }
  .actions > div {
    display: flex;
    justify-content: space-around;
  }

  /* ---------- */
  /* Responsive */
  /* ---------- */
  @media screen and (max-width: 1550px) {
    .dashboard > div:last-child {
      flex-direction: column;
      gap: 2em;
    }

    .logger-container ~ div {
      flex-direction: column;
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
