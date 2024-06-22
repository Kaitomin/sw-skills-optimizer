<template>
  <!-- Skills -->
    <div class="skills-details">
      <div v-if="char">
        <div class="char-info">
          <div>
            <img :src="'/' + char.icon" :alt="char.name + ' icon'" width="80" height="80">
          </div>

          <div>
            <p class="description"><i>{{ description }}<br>{{ note }}</i></p>
            <div>
              <div class="cd-input">
                <input type="range" name="charCD" id="charCD" min="0" max="55" step="1" @change="$emit('char-cdr', charCD)" v-model="charCD" />
                <label id="cd-input" for="charCD">Character CDR : {{ charCD +'%' }}</label>
              </div>

              <!-- Animation cancel toggler -->
              <div class="d-flex flex-column justify-evenly align-items-center">
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider round" @click="toggleCastCancel"></span>
                </label>
                <p>Animation cancel</p>
              </div>
            </div>
          </div>
        </div>
        
        <table v-if="clientWidth > 550" class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltip"
              @mouseout="hideTooltip"
            >
              <th scope="col" style="width:15%">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Skill multiplier</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] {{ aspd }}%  aspd - 60fps</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation</span><br>[{{ +charCD + 15}}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dps')">DMG/Cast<span class="tooltip-msg">Skill cast efficiency. Skill damage divided by cast time. If the attack duration is equal to cast time, consider it as the effective DPS.<br>This is a ratio, the total DMG done is equal to Skill %, not the ratio</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR. <br> Theoretically, the higher the more you should spam the skill when off CD. <br> In practice, you should balance with DMG/Cast</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd15')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR & chain 15% CDR bonus. Theoretically, the higher the more you should spam the skill when off CD. In practice, you should balance with DMG/Cast</span><br>[{{ +charCD + 15 }}% ]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="skill.icon" :alt="skill.skillName + ' icon'" width="48" height="48">
                <p>{{ skill.skillName }}</p>
              </td>

              <td>{{ skill.dmg }}%</td>

              <td :class="(castChecked && (+skill.castCancel < +skill.cast)) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ castChecked ? skill.castCancel : skill.cast }}]</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s</td>

              <td class="dps">{{ castChecked ? Math.round(skill.dmg/(skill.castCancel / 60)) : Math.round(skill.dmg/(skill.cast / 60)) }}%</td>

              <td>{{ Math.round(skill.dmg/calcCD(skill)) }}</td>

              <td>{{ Math.round(skill.dmg/calcCD15(skill)) }}</td>
            </tr>
          </tbody>
        </table>
        <table v-else class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltip" 
              @mouseout="hideTooltip"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Skill multiplier (DPS)</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] (DPS) {{ aspd }}%  aspd - 60fps</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation (DMG/CD{{charCD}})</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation (DMG/CD{{+charCD + 15}})</span><br>[{{ +charCD + 15}}%]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="skill.icon" :alt="skill.skillName + 'icon'">
                <p>{{ skill.skillName }}</p>
              </td>
              <td>{{ skill.dmg }}% <br> ({{ Math.round(skill.dmg/(skill.cast / 60).toFixed(2)) }}%)</td>
              <td :class="(castChecked && (+skill.castCancel < +skill.cast)) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ skill.cast }}]</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s <br>({{ Math.round(skill.dmg/calcCD(skill)) }})</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s <br>({{ Math.round(skill.dmg/calcCD15(skill)) }})</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
    </div>
</template>

<script>
import CharacterService from '../services/CharacterService';

import { useDisplayTooltip, useHideTooltip } from '../composable/functions';

export default {
  props: ['charName'],
  data() {
    return {
      char: '',
      charCD: '44',
      castChecked: false,
      sortOrder: false,
      skillsTable: [],
      aspd: '',
      description: '',
      note: '(DW coefficient is applied by default)',
    }
  },
  methods: {
    toggleCastCancel() {
      this.castChecked = !this.castChecked;
      this.$emit('cast-cancel', this.castChecked)
    },
    calcCD(skill) {
      if (skill.cd == 0) return Infinity
      return (+skill.cd - (+skill.cd * this.charCD/100)).toFixed(2);
    },
    calcCD15(skill) {
      if (skill.cd == 0) return Infinity
      return (+skill.cd - ((+skill.cd * this.charCD/100) + (+skill.cd * 0.15))).toFixed(2);
    },
    sortBy(criteria) {
      this.sortOrder = !this.sortOrder;

      switch(criteria) {
        case 'dps':
          if (this.castChecked) {
            this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.castCancel/60)) - Math.round(b.dmg/(b.castCancel/60)) : Math.round(b.dmg/(b.castCancel/60)) - Math.round(a.dmg/(a.castCancel/60)))
          } else {
            this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.cast/60)) - Math.round(b.dmg/(b.cast/60)) : Math.round(b.dmg/(b.cast/60)) - Math.round(a.dmg/(a.cast/60)))
          }
          break;
        case 'dmg-cd':
          this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD(a)) - Math.round(b.dmg/this.calcCD(b)) : Math.round(b.dmg/this.calcCD(b)) - Math.round(a.dmg/this.calcCD(a)))
          break;
        case 'dmg-cd15':
          this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD15(a)) - Math.round(b.dmg/this.calcCD15(b)) : Math.round(b.dmg/this.calcCD15(b)) - Math.round(a.dmg/this.calcCD15(a)))
          break;
        case 'cast':
          if (this.castChecked) {
            this.skillsTable.sort((a, b) => this.sortOrder ? +a.castCancel - +b.castCancel : +b.castCancel - +a.castCancel)
          } else {
            this.skillsTable.sort((a, b) => this.sortOrder ? +a.cast - +b.cast : +b.cast - +a.cast)
          }
          break;
        default:
          this.skillsTable.sort((a, b) => this.sortOrder ? +a[criteria] - +b[criteria] : +b[criteria] - +a[criteria])
          break;
      }
    },
    displayTooltip(e) {
      useDisplayTooltip(e)
    },
    hideTooltip(e) {
      useHideTooltip(e)
    },
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
      this.skillsTable.forEach(skill => skill.dmg =  Math.round(skill.dmg * 1.2))
      this.displayTooltip
      this.$emit('skills-table', {
        skillsTable: this.skillsTable
      })
    })
    .catch(err => this.$router.push('/'));

    switch(this.charName) {
      case 'Lily': 
        this.description = "Data by Axtate from EN [22/06/2024]"
        this.aspd = 250
        break;
      case 'Iris':
        this.description = "Data by AFN from EN [16/06/2024]"
        this.aspd = 240
        break;
      case 'Stella':
        this.description = "Data by Tatufo from EN [18/05/2023]"
        this.aspd = 205
        break;
      case 'Haru':
        this.description = "Data by Anave from EN [04/06/2024]"
        this.aspd = 240
        break;
      case 'Nabi':
        this.description = "Data from EN [29/05/2022]"
        this.aspd = 200
        break;
      case 'Dana':
        this.description = "Data by Tatufo from EN [18/05/2023]"
        this.aspd = 200
        break;
      case 'Erwin':
        this.description = "Data gathered from EN [08/06/2022]"
        this.aspd = 200
        break;
      default :
        this.aspd = 250
    }
  },
}
</script>

<style scoped>
  .description {
    color: white;
  }
  .nabi-note {
    font-style: italic;
    color: cyan;
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
  .cd-input {
    display: flex;
    flex-direction: column;
    justify-content: end;
    height: 58px;
    gap: 10px;
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
  
  /* Responsive */
</style>