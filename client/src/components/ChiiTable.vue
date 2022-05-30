<template>
  <!-- Skills -->
    <div class="skills-details">
      <div v-if="char">
        <p class="description"><i>{{ description }} <br>(click on criteria to sort the table)</i></p>
        <div class="char-info">
          <div class="cdInput">
            <input type="range" name="charCD" id="charCD" min="0" max="55" step="1" @change="$emit('char-cdr', charCD)" v-model="charCD" /><br>
            <label id="cdInput" for="charCD">Character CDR : {{ charCD +'%' }}</label>
          </div>

          <div class="dw-container" @click="toggleDesire">
            <p>Desire Worker</p>
          </div>

          <div class="cast-container" @click="toggleCastCancel">
            <p>Animation cancel</p>
          </div>
        </div>

        <!-- Chii marks -->
        <div class="chii-explosion">
          <div class="chii-counter" >
            <p>Detonation</p>
            <p class="mark-count active-mark" @click="detonateMarks(0)">0</p>
            <p class="mark-count" @click="detonateMarks(1)">1</p>
            <p class="mark-count" @click="detonateMarks(2)">2</p>
            <p class="mark-count" @click="detonateMarks(3)">3</p>
            <p class="mark-count" @click="detonateMarks(4)">4</p>
            <p class="mark-count" @click="detonateMarks(5)">5</p>
          </div>
        </div>
        
        <table v-if="clientWidth > 550" class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips"
              @mouseout="hideTooltips"
            >
              <th scope="col" class="tooltip-container">Skill<span class="tooltip-msg">[Marks count]</span></th>
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
                <p>{{ skill.skillName }} <span v-if="skill.mark > 0">[{{ skill.mark }}]</span> </p>
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
              <th scope="col" class="tooltip-container">Skill<span class="tooltip-msg">[Marks count]</span></th>
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
      checked: false,
      castChecked: false,
      sortOrder: false,
      marksCount: '0',
      marksCountTmp: '0',
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
      this.checked = !this.checked;
      
      if (this.checked) {
        document.querySelector('.dw-container').classList.add('active')
        
        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg * 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg * 1.2)
          }
        })
        this.$emit('skills-table', this.skillsTable)
      } else {
        document.querySelector('.dw-container').classList.remove('active')

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg / 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg / 1.2)
          }
        })
        this.$emit('skills-table', this.skillsTable)
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
    // Chii marks
    detonateMarks(count) {
      this.marksCount = count;

      // Active mark count
      document.querySelectorAll('.mark-count').forEach(mark => {
        if (mark.textContent == this.marksCount) {
          mark.classList.add('active-mark')
        } else {
          mark.classList.remove('active-mark')
        }
      })

      // Remove previous marks
      this.skillsTable.forEach(skill => {
        if (skill.skillName == "Claws Out") {
          if (this.checked) {
            skill.dmg = Math.round(skill.dmg / 1.2)
            skill.dmg = +skill.dmg - (this.marksCountTmp * 606)
          } else {
            skill.dmg = +skill.dmg - (this.marksCountTmp * 606)
          }
        }
        if (skill.skillName == "Soul Strike") {
          if (this.checked) {
            skill.dmg = Math.round(skill.dmg / 1.2)
            skill.dmg = +skill.dmg - (this.marksCountTmp * 422)
          } else {
            skill.dmg = +skill.dmg - (this.marksCountTmp * 422)
          }
        }
      })

      // Add marks
      this.skillsTable.forEach(skill => {
        if (skill.skillName == "Claws Out") {
          if (this.checked) {
            skill.dmg = +skill.dmg + (this.marksCount * 606)
            skill.dmg = Math.round(skill.dmg * 1.2)
          } else {
            skill.dmg = +skill.dmg + (this.marksCount * 606)
          }
        }
        if (skill.skillName == "Soul Strike") {
          if (this.checked) {
            skill.dmg = +skill.dmg + (this.marksCount * 422)
            skill.dmg = Math.round(skill.dmg * 1.2)
          } else {
            skill.dmg = +skill.dmg + (this.marksCount * 422)
          }
        }
      })

      this.marksCountTmp = count;
      this.$emit('skills-table', this.skillsTable)
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
      this.$emit('skills-table', this.skillsTable)
    })
    .catch(err => this.$router.push('/'));

    switch(this.charName) {
      case 'Chii':
        this.description = "Data gathered by Yukawa from KR ver. S2 rebalance [23/03/2022]"
        this.aspd = 201
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
    align-items: center;
    margin-bottom: 1em;
    color: white;
  }
  .cancel-active {
    color: #00fdce;
  }
  .dw-container,
  .cast-container {
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
    /* border-top: 0; */
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
  .chii-explosion {
    margin-bottom: 1em;
    border-top: 1px solid white;
    padding-top: 1em;
    color: white;
  }
  .chii-explosion p {
    margin-bottom: 0;
    padding: 0.5em 0.5em;
  }
  .chii-explosion p:first-child {
    box-shadow: inset 0 0 1px 1px white;
  }
  .chii-explosion p:not(:first-child):hover {
    cursor: pointer;
  }
  .chii-counter {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 0 5px;
    align-items: flex-end;
    width: 450px;
    margin: 0 auto;
  }
  .active-mark {
    background: #80003cde;
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
    .chii-counter p:not(:first-child) {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .chii-counter {
      grid-template-columns: repeat(6, 1fr);
      grid-template-areas:
        'detonate detonate detonate detonate detonate detonate'
        'm1 m2 m3 m4 m5 m6'
        ;
      width: 100%;
    }
    .chii-counter p:first-child {
      grid-area: detonate;
    }
    .chii-counter p:nth-child(2) {
      grid-area: m1;
    }
    .chii-counter p:nth-child(3) {
      grid-area: m2;
    }
    .chii-counter p:nth-child(4) {
      grid-area: m3;
    }
    .chii-counter p:nth-child(5) {
      grid-area: m4;
    }
    .chii-counter p:nth-child(6) {
      grid-area: m5;
    }
    .chii-counter p:nth-child(7) {
      grid-area: m6;
    }
  }

  @media screen and (max-width: 368px) {
    .chii-counter {
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas:
        'detonate detonate detonate'
        'm1 m2 m3'
        'm4 m5 m6'
        ;
      width: 100%;
    }
  }
</style>