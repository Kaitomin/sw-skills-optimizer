<template>
  <!-- Skills -->
  <div class="skills-details">
    <div v-if="char">
      <div class="char-info">
        <div>
          <img
            :src="'/' + char.icon"
            :alt="char.name + ' icon'"
            width="80"
            height="80"
          />
        </div>

        <div>
          <p class="description"><i>{{ description }}<br>{{ note }}</i></p>

          <div>
            <div class="cd-input">
              <input
                type="range"
                name="charCD"
                id="charCD"
                min="0"
                max="55"
                step="1"
                @change="$emit('char-cdr', charCD)"
                v-model="charCD"
              />
              <label id="cd-input" for="charCD"
                >Character CDR : {{ charCD + "%" }}</label
              >
            </div>

            <!-- Animation cancel toggler -->
            <div class="d-flex flex-column justify-evenly align-items-center">
              <label class="switch">
                <input type="checkbox" />
                <span class="slider round" @click="toggleCastCancel"></span>
              </label>
              <p>Animation cancel</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ephnel-buff">
        <div>
          <img
            src="/ephnel_bullet.png"
            alt=""
            width="40"
            height="40"
          />
        </div>
        <button class="ephnel-bullet" @click="toggleBullet">Bullet</button>
        <button class="ephnel-release" @click="toggleRelease">Limit Release</button>
      </div>

      <table v-if="clientWidth > 550" class="table table-striped table-skills">
        <thead>
          <tr @mouseover="displayTooltip" @mouseout="hideTooltip">
            <th scope="col" style="width:15%">Skill</th>
            <th scope="col" class="tooltip-container" @click="sortBy('dmg')">
              DMG<span class="tooltip-msg">Skill multiplier</span>
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cast')">
              Cast<span class="tooltip-msg"
                >Cast time in seconds [frames] {{ aspd }}% aspd - 60fps</span
              >
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cd')">
              CD<span class="tooltip-msg"
                >Skill CD after character CDR calculation</span
              ><br />[{{ charCD }}%]
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cd')">
              CD<span class="tooltip-msg"
                >Skill CD after character CDR & chain 15% CDR bonus
                calculation</span
              ><br />[{{ +charCD + 15 }}%]
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('dps')">
              DMG/Cast<span class="tooltip-msg"
                >Skill cast efficiency. Skill damage divided by cast time. If
                the attack duration is equal to cast time, consider it as the
                effective DPS.<br />This is a ratio, the total DMG done is equal
                to Skill %, not the ratio</span
              >
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">
              DMG/CD<span class="tooltip-msg"
                >Skill spam efficiency including character CDR. <br />
                Theoretically, the higher the more you should spam the skill
                when off CD. <br />
                In practice, you should balance with DMG/Cast</span
              ><br />[{{ charCD }}%]
            </th>
            <th
              scope="col"
              class="tooltip-container"
              @click="sortBy('dmg-cd15')"
            >
              DMG/CD<span class="tooltip-msg"
                >Skill spam efficiency including character CDR & chain 15% CDR
                bonus. Theoretically, the higher the more you should spam the
                skill when off CD. In practice, you should balance with
                DMG/Cast</span
              ><br />[{{ +charCD + 15 }}% ]
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in skillsTable" :key="skill._id">
            <td>
              <img
                :src="skill.icon"
                :alt="skill.skillName + ' icon'"
                width="48"
                height="48"
              />
              <p>{{ skill.skillName }}</p>
            </td>

            <td>{{ ephnelCalcDmg(skill) }}%</td>

            <td
              :class="
                castChecked && +skill.castCancel < +skill.cast
                  ? 'cancel-active'
                  : ''
              "
            >
              {{
                castChecked
                  ? (skill.castCancel / 60).toFixed(2)
                  : (skill.cast / 60).toFixed(2)
              }}s <br />
              [{{ castChecked ? skill.castCancel : skill.cast }}]
            </td>
            <td>{{ skill.cd == 0 ? "0.00" : calcCD(skill) }}s</td>
            <td>{{ skill.cd == 0 ? "0.00" : calcCD15(skill) }}s</td>

            <td class="dps">
              {{
                castChecked && ephnelRelease
                  ? Math.round(skill.dmgRelease / (skill.castCancel / 60))
                  : castChecked && ephnelBullet
                  ? Math.round(skill.dmgBullet / (skill.castCancel / 60))
                  : castChecked
                  ? Math.round(skill.dmg / (skill.castCancel / 60))
                  : ephnelRelease
                  ? Math.round(skill.dmgRelease / (skill.cast / 60))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / (skill.cast / 60))
                  : Math.round(skill.dmg / (skill.cast / 60))
              }}%
            </td>

            <td>
              {{
                ephnelRelease
                  ? Math.round(skill.dmgRelease / calcCD(skill))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / calcCD(skill))
                  : Math.round(skill.dmg / calcCD(skill))
              }}
            </td>

            <td>
              {{
                ephnelRelease
                  ? Math.round(skill.dmgRelease / calcCD15(skill))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / calcCD15(skill))
                  : Math.round(skill.dmg / calcCD15(skill))
              }}
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else class="table table-striped table-skills">
        <thead>
          <tr @mouseover="displayTooltip" @mouseout="hideTooltip">
            <th scope="col">Skill</th>
            <th scope="col" class="tooltip-container" @click="sortBy('dmg')">
              DMG<span class="tooltip-msg">Skill multiplier (DPS)</span>
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cast')">
              Cast<span class="tooltip-msg"
                >Cast time in seconds [frames] (DPS) {{ aspd }}% aspd -
                60fps</span
              >
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cd')">
              CD<span class="tooltip-msg"
                >Skill CD after character CDR calculation (DMG/CD{{
                  charCD
                }})</span
              ><br />[{{ charCD }}%]
            </th>
            <th scope="col" class="tooltip-container" @click="sortBy('cd')">
              CD<span class="tooltip-msg"
                >Skill CD after character CDR & chain 15% CDR bonus calculation
                (DMG/CD{{ +charCD + 15 }})</span
              ><br />[{{ +charCD + 15 }}%]
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in skillsTable" :key="skill._id">
            <td>
              <img
                :src="skill.icon"
                :alt="skill.skillName + 'icon'"
              />
              <p>{{ skill.skillName }}</p>
            </td>

            <td>
              {{ ephnelCalcDmg(skill) }}%
              <br />
              ({{
                castChecked && ephnelRelease
                  ? Math.round(skill.dmgRelease / (skill.castCancel / 60))
                  : castChecked && ephnelBullet
                  ? Math.round(skill.dmgBullet / (skill.castCancel / 60))
                  : castChecked
                  ? Math.round(skill.dmg / (skill.castCancel / 60))
                  : ephnelRelease
                  ? Math.round(skill.dmgRelease / (skill.cast / 60))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / (skill.cast / 60))
                  : Math.round(skill.dmg / (skill.cast / 60))
              }}%)
            </td>

            <td
              :class="
                castChecked && +skill.castCancel < +skill.cast
                  ? 'cancel-active'
                  : ''
              "
            >
              {{
                castChecked
                  ? (skill.castCancel / 60).toFixed(2)
                  : (skill.cast / 60).toFixed(2)
              }}s <br />
              [{{ skill.cast }}]
            </td>

            <td>
              {{ skill.cd == 0 ? "0.00" : calcCD(skill) }}s
              <br />
              {{
                ephnelRelease
                  ? Math.round(skill.dmgRelease / calcCD(skill))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / calcCD(skill))
                  : Math.round(skill.dmg / calcCD(skill))
              }}
            </td>

            <td>
              {{ skill.cd == 0 ? "0.00" : calcCD15(skill) }}s
              <br />
              {{
                ephnelRelease
                  ? Math.round(skill.dmgRelease / calcCD15(skill))
                  : ephnelBullet
                  ? Math.round(skill.dmgBullet / calcCD15(skill))
                  : Math.round(skill.dmg / calcCD15(skill))
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <hr />
  </div>
</template>

<script>
import CharacterService from "../services/CharacterService";

import {
  useDisplayTooltip,
  useHideTooltip,
} from "../composable/functions";

export default {
  props: ["charName"],
  data() {
    return {
      char: "",
      charCD: "44",
      dwChecked: false,
      castChecked: false,
      sortOrder: false,
      skillsTable: [],
      aspd: '',
      description: '',
      note: '(DW coefficient is applied by default)',
      ephnelBullet: false,
      ephnelRelease: false
    };
  },
  methods: {
    toggleCastCancel() {
      this.castChecked = !this.castChecked;

      if (this.castChecked) this.$emit("cast-cancel", this.castChecked)
      else this.$emit("cast-cancel", this.castChecked)
    },
    toggleBullet() {
      this.ephnelBullet = !this.ephnelBullet

      if (this.ephnelBullet) {
        // Disable Ephnel Release checkbox
        document
          .querySelector(".ephnel-bullet")
          .classList.add("active-buff")
        document
          .querySelector(".ephnel-release")
          .classList.remove("active-buff")

        this.ephnelRelease = false;
        this.$emit("ephnel-dmg", "bullet")
      } else {
        // Disable Ephnel Release checkbox
        document
          .querySelector(".ephnel-bullet")
          .classList.remove("active-buff")

        this.$emit("ephnel-dmg", "")
      }
    },
    toggleRelease() {
      this.ephnelRelease = !this.ephnelRelease;

      if (this.ephnelRelease) {
        // Disable Ephnel Bullet checkbox
        document
        .querySelector(".ephnel-release")
        .classList.add("active-buff");
        document
          .querySelector(".ephnel-bullet")
          .classList.remove("active-buff")

        this.ephnelBullet = false;
        this.$emit("ephnel-dmg", "release")
      } else {
        document
          .querySelector(".ephnel-release")
          .classList.remove("active-buff")
    
        this.$emit("ephnel-dmg", "")
      }
    },
    ephnelCalcDmg(skill) {
      if (this.ephnelRelease) return skill.dmgRelease
      if (this.ephnelBullet) return skill.dmgBullet
      return skill.dmg
    },
    calcCD(skill) {
      if (skill.cd == 0) return Infinity
      return (+skill.cd - (+skill.cd * this.charCD) / 100).toFixed(2);
    },
    calcCD15(skill) {
      if (skill.cd == 0) return Infinity
      return (
        +skill.cd -
        ((+skill.cd * this.charCD) / 100 + +skill.cd * 0.15)
      ).toFixed(2);
    },
    sortBy(criteria) {
      this.sortOrder = !this.sortOrder

      switch (criteria) {
        case "dmg": {
          if (this.ephnelRelease) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                +a.dmgRelease - +b.dmgRelease : 
                +b.dmgRelease - +a.dmgRelease
            )
          } else if (this.ephnelBullet) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                +a.dmgBullet - +b.dmgBullet :
                +b.dmgBullet - +a.dmgBullet
            )
          } else {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ?
                +a.dmg - +b.dmg : 
                +b.dmg - +a.dmg
            )
          }
          break
        }
        case "dps":
          if (this.castChecked && this.ephnelRelease) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgRelease / (a.castCancel / 60)) - Math.round(b.dmgRelease / (b.castCancel / 60)) : 
                Math.round(b.dmgRelease / (b.castCancel / 60)) - Math.round(a.dmgRelease / (a.castCancel / 60))
            )
          } else if (this.castChecked && this.ephnelBullet) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ?
                Math.round(a.dmgBullet / (a.castCancel / 60)) - Math.round(b.dmgBullet / (b.castCancel / 60)) :
                Math.round(b.dmgBullet / (b.castCancel / 60)) - Math.round(a.dmgBullet / (a.castCancel / 60))
            )
          } else if (this.castChecked) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmg / (a.castCancel / 60)) - Math.round(b.dmg / (b.castCancel / 60)) :
                Math.round(b.dmg / (b.castCancel / 60)) - Math.round(a.dmg / (a.castCancel / 60))
            )
          } else if (this.ephnelRelease) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgRelease / (a.cast / 60)) - Math.round(b.dmgRelease / (b.cast / 60)) :
                Math.round(b.dmgRelease / (b.cast / 60)) - Math.round(a.dmgRelease / (a.cast / 60))
            )
          } else if (this.ephnelBullet) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgBullet / (a.cast / 60)) - Math.round(b.dmgBullet / (b.cast / 60)) : 
                Math.round(b.dmgBullet / (b.cast / 60)) - Math.round(a.dmgBullet / (a.cast / 60))
            )
          } else {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmg / (a.cast / 60)) - Math.round(b.dmg / (b.cast / 60)) : 
                Math.round(b.dmg / (b.cast / 60)) - Math.round(a.dmg / (a.cast / 60))
            )
          }
          break
        case "dmg-cd":
          if (this.ephnelRelease) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgRelease / this.calcCD(a)) - Math.round(b.dmgRelease / this.calcCD(b)) : 
                Math.round(b.dmgRelease / this.calcCD(b)) - Math.round(a.dmgRelease / this.calcCD(a))
            )
          } else if (this.ephnelBullet) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgBullet / this.calcCD(a)) - Math.round(b.dmgBullet / this.calcCD(b)) : 
                Math.round(b.dmgBullet / this.calcCD(b)) - Math.round(a.dmgBullet / this.calcCD(a))
            )
          } else {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmg / this.calcCD(a)) - Math.round(b.dmg / this.calcCD(b)) :
                Math.round(b.dmg / this.calcCD(b)) - Math.round(a.dmg / this.calcCD(a))
            )
          }
          break;
        case "dmg-cd15":
          if (this.ephnelRelease) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgRelease / this.calcCD15(a)) - Math.round(b.dmgRelease / this.calcCD15(b)) : 
                Math.round(b.dmgRelease / this.calcCD15(b)) - Math.round(a.dmgRelease / this.calcCD15(a))
            )
          } else if (this.ephnelBullet) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmgBullet / this.calcCD15(a)) - Math.round(b.dmgBullet / this.calcCD15(b)) : 
                Math.round(b.dmgBullet / this.calcCD15(b)) - Math.round(a.dmgBullet / this.calcCD15(a))
            )
          } else {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                Math.round(a.dmg / this.calcCD15(a)) - Math.round(b.dmg / this.calcCD15(b)) : 
                Math.round(b.dmg / this.calcCD15(b)) - Math.round(a.dmg / this.calcCD15(a))
            )
          }
          break
        case "cast":
          if (this.castChecked) {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ? 
                +a.castCancel - +b.castCancel : 
                +b.castCancel - +a.castCancel
            )
          } else {
            this.skillsTable.sort((a, b) =>
              this.sortOrder ?
                +a.cast - +b.cast : 
                +b.cast - +a.cast
            )
          }
          break
        default:
          this.skillsTable.sort((a, b) =>
            this.sortOrder ? 
              +a[criteria] - +b[criteria] : 
              +b[criteria] - +a[criteria]
          )
          break
      }
    },
    displayTooltip(e) {
      useDisplayTooltip(e)
    },
    hideTooltip(e) {
      useHideTooltip(e)
    }
  },
  computed: {
    clientWidth() {
      return window.innerWidth
    }
  },
  created() {
    CharacterService.getCharacterInfo(this.charName)
      .then(res => {
        this.char = res.data.character;
        this.skillsTable = JSON.parse(JSON.stringify(res.data.skills))
        this.skillsTable.forEach(skill => {
          skill.dmg = Math.round(skill.dmg * 1.2)
          skill.dmgBullet = Math.round(skill.dmgBullet * 1.2)
          skill.dmgRelease = Math.round(skill.dmgRelease * 1.2)
        })
        this.displayTooltip;
        this.$emit("skills-table", {
          skillsTable: this.skillsTable,
          dwChecked: this.dwChecked
        });
      })
      .catch(() => this.$router.push("/"));

    this.description = "Data by Axtate from EN [18/06/2024]";
    this.aspd = 250;
  }
};
</script>

<style scoped>
.char-info {
  border-radius: 5px 5px 0 0;
}
.description {
  color: white;
}
.checked {
  background-color: #0064e1 !important;
}
.active {
  background: #0064e178 !important;
  border: 1px solid white !important;
}

/* SKills details */
.skills-details {
  width: 50%;
  min-width: 715px;
  margin: 0 1em;
  padding-top: 3em;
}
.cancel-active {
  color: #00fdce;
}
.dw-container,
.cast-container {
  display: flex;
  align-items: center;
  padding: 0.5em 2em;
  border: 1px solid #ffffff;
  background: #ffffff08;
  box-sizing: border-box;
  transition: background 0.2s;
}
.dw-container p,
.cast-container p {
  margin-bottom: 0;
}
.dw-container:hover,
.cast-container:hover {
  cursor: pointer;
  background: #ffffff2b;
}
.checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #eee;
}
.disabled {
  opacity: 0;
}
.ephnel-buff {
  color: white;
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1.5fr;
  grid-gap: 0 5px;
  align-items: center;
  /* width: 650px; */
  margin: 0 auto;
  padding: 0.5rem 10rem;
  border-left: 1px solid #95989e;
  border-right: 1px solid #95989e;
  border-bottom: 1px solid #95989e;
  background-color: #2d343f;
  border-radius: 0 0 5px 5px;
}
.ephnel-buff p {
  margin: 0;
  background: #008751;
  border: 1px solid white;
  padding: 0.5em 0;
}
.ephnel-buff button {
  background: none;
  border: 0;
  color: white;
  height: 40px;
  box-shadow: 0 0 0 0 white;
  border-radius: 5px
}
.ephnel-buff button:hover {
  box-shadow: 0 0 0 1px white;
  background-color: #ffffff1a;
  border-radius: 5px
}
.ephnel-buff button.active-buff {
  background-color: #008751;
  box-shadow: inset 0 0 0 1px white;
}

/* ---------- */
/* Responsive */
/* ---------- */
@media screen and (max-width: 650px) {
  .ephnel-buff {
    padding: 0.5rem;
  }
}
@media screen and (max-width: 500px) {
  .ephnel-buff {
    grid-template-columns: 1fr;
  }
}
</style>
