<template>
  <div class="dashboard" :style="containerHeight">
    <div
      v-show="showModal == true"
      class="alert modal-container"
      :class="error ? 'alert-danger' : 'alert-success'"
      role="alert"
    >
      {{ error ? "Invalid input" : "Skill updated" }}
    </div>
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
            :class="currentCharacter === char.name ? 'active' : ''"
          >
            <div
              v-if="char.name !== 'tmpChar'"
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
        <router-link
          v-if="$root.userRole === 'ADMIN'"
          to="/add-new-skill"
          class="add-character"
          >Add skill</router-link
        >
      </div>
      <div class="skills-container">
        <table class="table table-striped skills-table">
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
                  :src="getSkillIcon(skill.icon)"
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
                  @click="editSkill($event, skill)"
                ></i>
                <div class="hidden">
                  <i
                    class="fa-solid fa-check"
                    title="Apply changes"
                    @click="saveChanges($event, skill)"
                  ></i>
                  <i
                    class="fa-solid fa-xmark"
                    title="Cancel changes"
                    @click="cancelChanges($event, skill)"
                  ></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import CharacterService from "../services/CharacterService";
import SkillService from "../services/SkillService";
import LoggerService from "../services/LoggerService";

import {
  useGetCharactersIcons,
  useGetCharacterIcon,
  useGetSkillIcon
} from "../composable/functions";

export default {
  data() {
    return {
      charList: [],
      skillsList: [],
      logger: [],
      currentCharacter: "",
      error: false,
      showModal: false,
      containerH: ""
    };
  },
  methods: {
    async getAllCharacters() {
      this.charList = await useGetCharactersIcons();
    },
    getCharacterIcon(iconUrl) {
      return useGetCharacterIcon(iconUrl);
    },
    getSkillIcon(iconUrl) {
      return useGetSkillIcon(iconUrl);
    },
    getCharacterSkills(name) {
      CharacterService.getCharacterInfo(name).then(res => {
        this.skillsList = res.data.skills;
        this.currentCharacter = name;
      });
    },
    getLogger() {
      LoggerService.getLogger().then(res => (this.logger = res.data.logger));
    },
    validateInput({ name, value }) {
      switch (name) {
        case "dmg":
        case "cd":
        case "cast":
        case "castCancel":
        case "dmgBullet":
        case "dmgRelease":
        case "mark":
          if (!/^[0-9]+$/.test(value)) this.error = true;
          break;
        case "skillName":
          if (!/^[-a-z0-9()%>:' ]+$/i.test(value)) this.error = true;
          break;
        case "dwBoost":
          if (!/^[0-9]{1}([.][0-9]{1,4})$/.test(value)) this.error = true;
          break;
        default:
          break;
      }
    },
    editSkill(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`);

      inputs.forEach(input => {
        if (
          (input.name === "dwBoost" && input.value == "") ||
          input.name === "character"
        )
          return;

        input.classList.add("edit");
        input.disabled = false;
      });

      event.target.classList.add("hidden");
      event.target.nextElementSibling.className = "";
    },
    async saveChanges(event, skill) {
      this.error = false;

      const inputs = document.querySelectorAll(`#tr-${skill._id} input`);
      const skillObj = { ...skill };

      inputs.forEach(input => {
        if (input.name === "dwBoost" && input.value == "") return;

        this.validateInput({ name: input.name, value: input.value });
        skillObj[input.name] = input.value;
      });

      if (this.error) {
        this.showModal = true;
        setTimeout(() => (this.showModal = false), 1000);
        return;
      } else {
        try {
          // Modify skill
          await SkillService.updateSkill(skillObj);
          await this.getCharacterSkills(this.currentCharacter);

          const date = new Date();

          // Save current date to the logger
          let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          let month =
            date.getMonth() + 1 < 10
              ? "0" + date.getMonth()
              : date.getMonth() + 1;
          let year = date.getFullYear();
          let hours =
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          let minutes =
            date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes();
          let seconds =
            date.getSeconds() < 10
              ? "0" + date.getSeconds()
              : date.getSeconds();

          const currentDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

          await LoggerService.setLogger({ currentDate, skill: skillObj });

          // Disable edit inputs
          inputs.forEach(input => {
            input.classList.remove("edit");
            input.disabled = true;
          });

          event.target.parentElement.className = "hidden";
          event.target.parentElement.previousElementSibling.classList.remove(
            "hidden"
          );

          this.showModal = true;

          setTimeout(() => (this.showModal = false), 1000);
        } catch (err) {
          console.log(err);
        }

        this.getLogger();
      }
    },
    cancelChanges(event, skill) {
      const inputs = document.querySelectorAll(`#tr-${skill._id} input`);

      inputs.forEach(input => {
        input.classList.remove("edit");
        input.disabled = true;

        if (!input.value) input.value = "";
        else input.value = skill[input.name];
      });

      event.target.parentElement.className = "hidden";
      event.target.parentElement.previousElementSibling.classList.remove(
        "hidden"
      );
    }
  },
  computed: {
    containerHeight() {
      return {
        "--container-height": this.containerH
      };
    },
    sortedLogger() {
      return Array.from(this.logger).reverse();
    }
  },
  beforeCreate() {
    if (!this.$root.userRole) this.$router.push("/");
  },
  created() {
    this.getAllCharacters();
    this.getLogger();
    this.getCharacterSkills("Ephnel");
  },
  mounted() {
    const container = document.querySelector(".dashboard");
    setTimeout(() => (this.containerH = container.clientHeight + "px"), 1000);
  }
};
</script>

<style scoped>
.logger-container {
  color: white;
}
.logger-container > div {
  overflow-y: scroll;
  width: 91%;
  margin: 0 auto;
  height: 100px;
  padding: 1em 2em;
  text-align: left;
}
.logger-container p {
  font-style: italic;
}
.dashboard {
  margin-top: 2em;
}
.dashboard > div:last-child {
  display: flex;
  justify-content: space-around;
  width: 95%;
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
  background: url("../assets/img/homepage.webp");
  background-repeat: no-repeat;
  height: var(--container-height);
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
.characters > div:not(div:last-child):hover {
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
  background: #ffffff21;
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
