<template>
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

      <!-- Chii marks -->
      <div class="chii-explosion">
        <div class="chii-counter" >
          <p>Marks</p>
          <p class="mark-count active-mark" @click="detonateMarks(0)">0</p>
          <p class="mark-count" @click="detonateMarks(1)">1</p>
          <p class="mark-count" @click="detonateMarks(2)">2</p>
          <p class="mark-count" @click="detonateMarks(3)">3</p>
          <p class="mark-count" @click="detonateMarks(4)">4</p>
          <p class="mark-count" @click="detonateMarks(5)">5</p>
          <p class="mark-count" @click="detonateMarks(6)">6</p>
          <p class="mark-count" @click="detonateMarks(7)">7</p>
        </div>
      </div>
      
      <table v-if="clientWidth > 550" class="table table-striped table-skills">
        <thead>
          <tr 
            @mouseover="displayTooltip"
            @mouseout="hideTooltip"
          >
            <th scope="col" class="tooltip-container" style="width:30%">Skill<span class="tooltip-msg">[x/💥/y] refers to mark <br>x = application <br>💥= detonation <br> y = reapplication</span></th>
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
            <td :class="castChecked && (+skill.castCancel < +skill.cast) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ castChecked ? skill.castCancel : skill.cast }}]</td>
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
      selectedMark: '0',
      currentMarkCount: '0',
      skillsTable: [],
      skillsTableDefault: [],
      aspd: '',
      note: '(DW coefficient is applied by default)',
      description: ''
    }
  },
  methods: {
    toggleCastCancel() {
      this.castChecked = !this.castChecked;
      this.$emit('cast-cancel', this.castChecked)
    },
    detonateMarks(count) {
      this.selectedMark = count

      // Active mark count
      document.querySelectorAll('.mark-count').forEach(mark => {
        if (mark.textContent == this.selectedMark) mark.classList.add('active-mark')
        else mark.classList.remove('active-mark')
      })

      // Remove previous marks
      this.skillsTable.forEach(skill => {
        skill.dmg = Math.round(skill.dmg / 1.2)
        skill.dmg = +skill.dmg - (this.currentMarkCount * skill.mark)
      })
            
      // Add marks
      this.skillsTable.forEach(skill => {
        skill.dmg = +skill.dmg + (this.selectedMark * skill.mark)
        skill.dmg = Math.round(skill.dmg * 1.2)
      })
      

      this.currentMarkCount = count;
      this.$emit('skills-table', {
        skillsTable: this.skillsTable,
      })
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
    displayTooltip(e) { useDisplayTooltip(e) },
    hideTooltip(e) { useHideTooltip(e) },
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
      this.skillsTable.forEach(skill => skill.dmg = Math.round(skill.dmg * 1.2))
      this.displayTooltip
      this.$emit('skills-table', {
        skillsTable: this.skillsTable,
      })
    })
    .catch(() => this.$router.push('/'));

    this.description = "Data by Anave & Darkblue from EN [18/06/2024]"
    this.aspd = 250
  },
}
</script>

<style scoped>
  .char-info {
    border-radius: 5px 5px 0 0;
    padding: 10px 0;
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

  .chii-explosion {
    margin-bottom: 1em;
    border-left: 1px solid #95989e;
    border-right: 1px solid #95989e;
    border-bottom: 1px solid #95989e;
    padding: 0.5rem 1rem;
    color: white;
    background-color: #2d343f;
    border-radius: 0 0 5px 5px;
  }
  .chii-explosion p {
    margin-bottom: 0;
    padding: 0.5em 0.5em;
    border-radius: 5px;
  }
  .chii-explosion p:first-child {
    box-shadow: inset 0 0 1px 1px white;
    background: #80003c;
  }
  .chii-explosion p:not(:first-child):hover {
    cursor: pointer;
  }
  .chii-counter {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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