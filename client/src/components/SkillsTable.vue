<template>
  <!-- Skills -->
    <div class="skills-details">
      <div v-if="char">
        <p class="description">
          <i>{{ description }}<br>(click on criteria to sort the table) <br> <span v-if="charName=='Nabi'" class="nabi-note">Only [Close Quarter (Full)] includes Light Injury stacks damage</span>
</i>
        </p>
        <div class="char-info">
          <div class="cdInput">
            <input type="range" name="charCD" id="charCD" min="0" max="55" step="1" @change="$emit('char-cdr', charCD)" v-model="charCD" /><br>
            <label id="cdInput" for="charCD">Character CDR : {{ charCD +'%' }}</label>
          </div>

          <!-- Common desire -->
          <div class="dw-container" @click="toggleDesire">
            <p>Desire Worker</p>
          </div>
          <div class="cast-container" @click="toggleCastCancel">
            <p>Animation cancel</p>
          </div>
        </div>
        
        <table v-if="clientWidth > 550" class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips"
              @mouseout="hideTooltips"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Skill multiplier</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] {{ aspd }}%  aspd - 60fps</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation</span><br>[{{ +charCD + 15}}%]</th>
              <th class="separator-th"></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dps')">DPS<span class="tooltip-msg">Damage % per second</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR. <br> Theoretically, the higher the more you should spam the skill when off CD. <br> In practice, you should balance with DPS</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd15')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR & chain 15% CDR bonus. Theoretically, the higher the more you should spam the skill when off CD. In practice, you should balance with DPS</span><br>[{{ +charCD + 15 }}% ]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
                <p>{{ skill.skillName }}</p>
              </td>

              <td>{{ skill.dmg }}%</td>

              <td :class="castChecked && (skill.castCancel < skill.cast) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ castChecked ? skill.castCancel : skill.cast }}]</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s</td>
              <td class="separator-td"></td>

              <td class="dps">{{ castChecked ? Math.round(skill.dmg/(skill.castCancel / 60)) : Math.round(skill.dmg/(skill.cast / 60)) }}%</td>

              <td>{{ Math.round(skill.dmg/calcCD(skill)) }}</td>

              <td>{{ Math.round(skill.dmg/calcCD15(skill)) }}</td>
            </tr>
          </tbody>
        </table>
        <table v-else class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips" 
              @mouseout="hideTooltips"
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
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + 'icon'">
                <p>{{ skill.skillName }}</p>
              </td>
              <td>{{ skill.dmg }}% <br> ({{ Math.round(skill.dmg/(skill.cast / 60).toFixed(2)) }}%)</td>
              <td :class="(castChecked && (skill.castCancel < skill.cast)) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ skill.cast }}]</td>
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

export default {
  props: ['charName'],
  data() {
    return {
      char: '',
      charCD: '44',
      dwChecked: false,
      castChecked: false,
      sortOrder: false,
      skillsTable: [],
      aspd: '',
      description: '',
    }
  },
  methods: {
    getImgUrl(iconUrl) {
      try {
        return require('@/assets/uploads/skills/' + iconUrl)
      } catch (e) {
        return 
      }
    },
    toggleDesire() {
      this.dwChecked = !this.dwChecked;

      if (this.dwChecked) {
        document.querySelector('.dw-container').classList.add('active')

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg * 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg * 1.2)
          }
        })

        this.$emit('skills-table', {
          skillsTable: this.skillsTable,
          dwChecked: this.dwChecked
        })
      } else {
        document.querySelector('.dw-container').classList.remove('active')

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg / 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg / 1.2)
          }
        })
        this.$emit('skills-table', {
          skillsTable: this.skillsTable,
          dwChecked: this.dwChecked
        })
      }
    },
    toggleCastCancel() {
      this.castChecked = !this.castChecked;

      if (this.castChecked) {
        document.querySelector('.cast-container').classList.add('active')

        this.$emit('cast-cancel', this.castChecked)
      } else {
        document.querySelector('.cast-container').classList.remove('active')
        this.$emit('cast-cancel', this.castChecked)
      }
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
    sortTab() {
      let tbody = document.querySelector('tbody');
      let tr = Array.from(document.querySelectorAll('tbody tr'));

      tr.forEach(tr => tr.remove())
      tr.sort((a, b) => {
        return a.querySelector('td.dps').textContent - b.querySelector('td.dps').textContent
      })
      tr.forEach(tr => tbody.append(tr))
    },
    displayTooltips(e) {
      if (e.target.classList.contains("tooltip-container")) {
        e.target.children[0].style.display = "block"
      }
    },
    hideTooltips(e) {
      if (e.target.classList.contains("tooltip-container")) {
        e.target.children[0].style.display = "none"
      }
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
      this.skillsTable = JSON.parse(JSON.stringify(res.data.skills));
      this.displayTooltips
      this.$emit('skills-table', {
        skillsTable: this.skillsTable,
        dwChecked: this.dwChecked
      })
    })
    .catch(err => this.$router.push('/'));

    switch(this.charName) {
      case 'Lily': 
        this.description = "Data gathered from KR ver. S2 rebalance [23/03/2022]"
        this.aspd = 205
        break;
      case 'Iris':
        this.description = "Data gathered from EN ver. [03/04/2022]"
        this.aspd = 200
        break;
      case 'Stella':
        this.description = "Data gathered from EN ver. [05/04/2022]"
        this.aspd = 205
        break;
      case 'Haru':
        this.description = "Data gathered from EN ver. [06/04/2022]"
        this.aspd = 200
        break;
      case 'Nabi':
        this.description = "Data gathered from EN ver. [29/05/2022]"
        this.aspd = 200
        break;
      default :
        this.aspd = 200
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
    min-width: 715px;
    margin: 0 1em;
    padding-top: 3em;
  }
  .char-info {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1em;
    color: white;
    align-items: flex-start;
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
  .tooltip-container {
    position: relative;
  }
  .tooltip-container:hover {
    cursor: pointer;
  }
  .tooltip-msg {
    display: none;
    position: absolute;
    max-width: 200px;
    width: max-content;
    z-index: 999;
    top: 50px;
    right: 0;
    text-align: left;
    padding: 10px;
    border: 1px solid white;
    background: #000000a1;
  }
  thead {
    position: sticky;
    top: -1px;
  }
  th {
    border-bottom: 0;
    vertical-align: middle;
    width: 40px;
    border-top: 0;
    font-size: 0.9em;
  }
  td {
    padding: 0.7rem 0 0.3rem 0;
    color: white;
  }
  .table-skills { 
    border-spacing: 0px;
    border: 1px solid white;
    margin-top: 2em;
  }
  thead > tr > td:first-child,
  tbody > tr > td:first-child {
    padding-left: 0.5rem;
  }
  tbody {
    text-align: center;
    font-size: 15px;
  }
  th {
    color: white;
    padding: 5px 0;
  }
   td {
    vertical-align: middle;
  }
  th.separator-th {
    width: 1px !important;
    background: #ffffff7a;
  }
  .separator-td {
    width: 1px;
    background: #ffffff7a;
  }
  .table-skills p {
    margin: 0;
  }

  /* Responsive */
  @media screen and (max-width: 768px) {
    .skills-details {
      min-width: 100%;
    }
    .tooltip-msg {
      width: 150px;
    }
  }
  @media screen and (max-width: 500px) {
    .char-info {
      flex-direction: column;
      align-items: center;
      height: 200px;
    }
    .description {
      margin-bottom: 0;
    }
    .dw-container,
    .cast-container {
      width: 240px;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
    }
    .checkmark {
      margin-right: 10px;
    }
  }
</style>