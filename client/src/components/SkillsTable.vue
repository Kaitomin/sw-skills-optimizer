<template>
  <!-- Skills -->
    <div class="skills-details">
      <h1>Skills</h1>
      <div v-if="char">
        <div class="char-info">
          <div class="cdInput">
            <input type="range" name="charCD" id="charCD" min="0" max="55" step="1" @change="$emit('char-cdr', charCD)" v-model="charCD" /><br>
            <label id="cdInput" for="charCD">Character CDR : {{ charCD +'%' }}</label>
          </div>
          <div class="dw-container">
            <p>Desire Worker</p>
            <span class="checkmark dw-input" :checked="checked" @click="toggleDesire"><i class="fa-solid fa-check disabled"></i></span>
          </div>
        </div>
        <table v-if="clientWidth > 550" class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips"
              @mouseout="hideTooltips"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Total DMG in %</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] {{ aspd }}%  aspd - 60fps - Full animation</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation</span><br>[{{ +charCD + 15}}%]</th>
              <th class="separator-th"></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dps')">DPS<span class="tooltip-msg">DMG % per second</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">DMG/CD<span class="tooltip-msg">Ratio between DMG & skill CD after character CDR calculation. Generally the higher the more you should spam the skill when off CD</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd15')">DMG/CD<span class="tooltip-msg">Ratio between DMG & skill CD after character CDR & chain +15% CDR bonus calculation. Generally the higher the more you should spam the skill when off CD</span><br>[{{ +charCD + 15 }}% ]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="45" height="45">
                <p>{{ skill.skillName }}</p>
              </td>
              <td>{{ skill.dmg }}%</td>
              <td>{{ (skill.cast / 60).toFixed(2)}}s <br> [{{ skill.cast }}]</td>
              <td>{{ calcCD(skill) }}s</td>
              <td>{{ calcCD15(skill) }}s</td>
              <td class="separator-td"></td>
              <td class="dps">{{ Math.round(skill.dmg/(skill.cast / 60).toFixed(2)) }}</td>
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
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Total DMG in % (DPS)</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] (DPS) {{ aspd }}}%  aspd - 60fps - Full animation</span></th>
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
              <td>{{ skill.dmg }}% <br> ({{ Math.round(skill.dmg/(skill.cast / 60).toFixed(2)) }})</td>
              <td>{{(skill.cast / 60).toFixed(2)}}s <br> [{{ skill.cast }}]</td>
              <td>{{ calcCD(skill) }}s <br>({{ Math.round(skill.dmg/calcCD(skill)) }})</td>
              <td>{{ calcCD15(skill) }}s <br>({{ Math.round(skill.dmg/calcCD15(skill)) }})</td>
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
      checked: false,
      sortOrder: false,
      skillsTable: [],
      skillsDefaultTable: [],
      aspd: ''
    }
  },
  methods: {
    getImgUrl(iconUrl) {
      try {
        return require('@/assets/uploads/skills/' + iconUrl.split('.')[0] + '.webp')
      } catch (e) {
        return 
      }
    },
    toggleDesire() {
      this.checked = !this.checked;
      
      if (this.checked) {
        document.querySelector('.fa-check').classList.remove('disabled')
        document.querySelector('.dw-input').classList.add('checked')

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg * 1.6)
          } else {
            skill.dmg = Math.round(skill.dmg * 1.2)
          }
        })
        this.$emit('skills-table', this.skillsTable)
      } else {
        document.querySelector('.fa-check').classList.add('disabled')
        document.querySelector('.dw-input').classList.remove('checked')

        this.skillsTable = JSON.parse(JSON.stringify(this.skillsDefaultTable))
        this.$emit('skills-table', this.skillsTable)
      }
    },
    calcCD(skill) {
      return (+skill.cd - (+skill.cd * this.charCD/100)).toFixed(2);
    },
    calcCD15(skill) {
      return (+skill.cd - ((+skill.cd * this.charCD/100) + (+skill.cd * 0.15))).toFixed(2);
    },
    sortBy(criteria) {
      this.sortOrder = !this.sortOrder;

      switch(criteria) {
        case 'dps':
          this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.cast/60).toFixed(2)) - Math.round(b.dmg/(b.cast/60).toFixed(2)) : Math.round(b.dmg/(b.cast/60).toFixed(2)) - Math.round(a.dmg/(a.cast/60).toFixed(2)))
          break;
        case 'dmg-cd':
          this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD(a)) - Math.round(b.dmg/this.calcCD(b)) : Math.round(b.dmg/this.calcCD(b)) - Math.round(a.dmg/this.calcCD(a)))
          break;
        case 'dmg-cd15':
          this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD15(a)) - Math.round(b.dmg/this.calcCD15(b)) : Math.round(b.dmg/this.calcCD15(b)) - Math.round(a.dmg/this.calcCD15(a)))
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
      this.skillsDefaultTable = JSON.parse(JSON.stringify(res.data.skills));
      this.displayTooltips
      this.$emit('skills-table', this.skillsTable)
    })
    .catch(err => console.log('Error :', err));

    switch(this.charName) {
      case 'Lily': 
        this.aspd = 205
        break;
      case 'Iris':
        this.aspd = 200
        break;
      default :
        this.aspd = 200
    }
  },
}
</script>

<style scoped>
  h1 {
    margin-bottom: 2rem;
    color: white;
    border: 1px solid white;
    font-size: 2em;
    padding: 5px 0;
  }
  .checked {
    background-color: #0064e1 !important;
  }
  /* SKills details */
  .skills-details {
    min-width: 715px;
    margin: 0 1em;
  }
  .char-info {
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    margin-bottom: 0.5em;
    color: white;
  }
  .dw-container {
    display: block;
    position: relative;
    cursor: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .dw-container p {
    margin-bottom: 0;
  }
  .checkmark {
    position: absolute;
    top: -20px;
    left: 40px;
    height: 20px;
    width: 20px;
    background-color: #eee;
  }
  .dw-container i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: white;
  }
  .disabled {
    opacity: 0;
  }
  .tooltip-container {
    position: relative;
  }
  .tooltip-msg {
    display: none;
    position: absolute;
    width: 200px;
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
  }
  td {
    padding: 0.7rem 0 0.3rem 0;
    color: white;
    /* border-top: 0; */
  }
  .table-skills { 
    border-spacing: 0px;
    border: 1px solid white;
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

  @media screen and (max-width: 768px) {
    .skills-details {
      min-width: 100%;
    }
    .tooltip-msg {
      width: 150px;
    }
  }
</style>