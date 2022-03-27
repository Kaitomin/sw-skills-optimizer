<template>
  <div class="skills-container" :class="name.toLowerCase()">
    <!-- Skills -->
    <div class="skills-details">
      <h1>Skills</h1>
      <div v-if="char">
        <div class="char-info">
          <div class="cdInput">
            <input type="range" id="charCD" min="0" max="55" step="1" v-model="charCD" />
            <p id="cdInput">Character CDR : {{ charCD +'%' }}</p>
          </div>
          <div class="dw-container">
            <p>Desire Worker</p>
            <!-- <input type="checkbox" class="dw-input" :checked="checked" @click="toggleDesire" /> -->
            <span class="checkmark dw-input" :checked="checked" @click="toggleDesire"><i class="fa-solid fa-check disabled"></i></span>
          </div>
        </div>
        <table class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips" 
              @mouseout="hideTooltips"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Total DMG in %</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Number of frames [205%  aspd - 60fps]</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR <br> & chain 15% CDR bonus calculation</span><br>[{{ +charCD + 15}}%]</th>
              <th class="separator-th"></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cast')">DMG/Cast<span class="tooltip-msg">Ratio between DMG & Cast aka DPS, <br> the higher the better</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">DMG/CD<span class="tooltip-msg">Ratio between DMG & skill CD after character CDR calculation. <br> Generally the higher the more you should spam the skill when off CD</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd15')">DMG/CD<span class="tooltip-msg">Ratio between DMG & skill CD after character CDR & <br> chain +15% CDR bonus calculation. <br> Generally the higher the more you should spam the skill when off CD</span><br>[{{ +charCD + 15 }}% ]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skills" :key="skill._id">
              <td>
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + 'icon'">
                <p>{{ skill.skillName }}</p>
              </td>
              <td>{{ skill.dmg }}%</td>
              <td>{{ skill.cast }}</td>
              <td>{{ calcCD(skill) }}s</td>
              <td>{{ calcCD15(skill) }}s</td>
              <td class="separator-td"></td>
              <td class="dmg-cast">{{ Math.round(skill.dmg/skill.cast) }}</td>
              <td>{{ Math.round(skill.dmg/calcCD(skill)) }}</td>
              <td>{{ Math.round(skill.dmg/calcCD15(skill)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
    </div>
    <!-- Rotations -->
    <div class="skills-rotation">
      <h1>Rotations</h1>
      <p><i>3rd row automatically takes into account 15% CDR chain bonus</i></p>
      <p><i>No selectable 2nd row bonus nor 3rd row DMG% bonus for now</i></p>
      <!-- <button class="btn btn-info" @click="saveTemplate">Save templates</button> -->
      <Rotation
        v-for="component in components"
        :key="component[0]"
        :id="component[0]"
        :skills="skills"
        :charCD="charCD"
        :save="save"
        :charId="id"
        @save="setSave"
        @delete-component="deleteComponent(component)"
      />     
      <button class="rotation" :class="rotationLimit <= 3 ? 'add-rotation' : 'disabled-rotation'" @click="addRotation">Add rotation</button>
    </div>
  </div>
  
</template>

<script>

import CharacterService from '../services/CharacterService';
import Rotation from '../components/Rotation.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  props: ['id', 'name'],
  data() {
    return {
      char: '',
      charCD: '44',
      checked: false,
      skillsDefault: [],
      skills: [],
      components: new Map(),
      rotationLimit: 0,
      deleteId: [],
      save: { save: false, deleteId: this.deleteId },
      sortOrder: false,
      hover: false
    }
  },
  components: { Rotation },
  methods: {
    getImgUrl(iconUrl) {
      return require('@/assets/uploads/skills/' + iconUrl)
    },
    toggleDesire() {
      this.checked = !this.checked;
      
      if (this.checked) {
        document.querySelector('.fa-check').classList.remove('disabled')
        document.querySelector('.dw-input').classList.add('checked')

        Array.from(this.skills).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg * 1.6)
          } else {
            skill.dmg = Math.round(skill.dmg * 1.2)
          }
        })
      } else {
        document.querySelector('.fa-check').classList.add('disabled')
        document.querySelector('.dw-input').classList.remove('checked')

        this.skills = JSON.parse(JSON.stringify(this.skillsDefault))
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
        case 'dmg-cast':
          this.skills.sort((a, b) => this.sortOrder ? Math.round(a.dmg/a.cast) - Math.round(b.dmg/b.cast) : Math.round(b.dmg/b.cast) - Math.round(a.dmg/a.cast))
          break;
        case 'dmg-cd':
          this.skills.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD(a)) - Math.round(b.dmg/this.calcCD(b)) : Math.round(b.dmg/this.calcCD(b)) - Math.round(a.dmg/this.calcCD(a)))
          break;
        case 'dmg-cd15':
          this.skills.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD15(a)) - Math.round(b.dmg/this.calcCD15(b)) : Math.round(b.dmg/this.calcCD15(b)) - Math.round(a.dmg/this.calcCD15(a)))
          break;
        default:
          this.skills.sort((a, b) => this.sortOrder ? +a[criteria] - +b[criteria] : +b[criteria] - +a[criteria])
          break;
      }
    },
    addRotation() {
      if (this.rotationLimit <= 3) {
        this.components.set(uuidv4(), Rotation)
        this.rotationLimit += 1;
      }
    },
    deleteComponent(c) {
      // Add component id to delete to array
      if (!this.deleteId.includes(c[0])) this.deleteId.push(c[0])  

      this.components = new Map(Array.from(this.components).filter(comp => comp[0] != c[0]));
      this.rotationLimit -= 1;
    },
    // Commit all changes
    saveTemplate() {
      this.save = {save: true, deleteId: this.deleteId}
      this.$store.commit('saveAllRotations', JSON.stringify(Array.from(this.components.entries())));
    },
    // Reset save props after saveTemplate()
    setSave() {
      this.save.save = false
    },
    sortTab() {
      let tbody = document.querySelector('tbody');
      let tr = Array.from(document.querySelectorAll('tbody tr'));

      tr.forEach(tr => tr.remove())
      tr.sort((a, b) => {
        return a.querySelector('td.dmg-cast').textContent - b.querySelector('td.dmg-cast').textContent
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
    }
  },
  created() {
    // Get character skills
    const getInfo = () => {
      CharacterService.getCharacterInfo(this.name)
      .then(res => {
        this.char = res.data.character;
        this.skills = JSON.parse(JSON.stringify(res.data.skills));
        this.skillsDefault = JSON.parse(JSON.stringify(res.data.skills));
        this.displayTooltips
      })
      .catch(err => console.log('Error :', err));
    };
    getInfo();

    // Get rotations templates
    if (this.$store.state.allTemplates) {
      this.components = this.$store.state.allTemplates;
    }
  },
}

</script>

<style scoped>
  h1 {
    margin-bottom: 2.5rem;
    color: white;
    border: 1px solid white;
    font-size: 2em;
  }
  .checked {
    background-color: #0064e1 !important;
  }
  /* Skills container */
  .skills-container {
    display: flex;
    justify-content: space-around;
    /* flex-direction: column; */
  }
  .skills-container p {
    margin-bottom: 0;
  }
  .skills-container p,
  .skills-container label,
  .skills-container table {
    color: white;
  }
  /* SKills details */
  .skills-details {
    min-width: 715px;
    margin: 0 1em;
  }
  .skills-details .char-info {
    display: flex;
    justify-content: space-evenly;
    align-items: end;
    margin-bottom: 2em;
  }
  .skills-details .dw-container {
    display: block;
    position: relative;
    cursor: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .skills-details .dw-container .checkmark {
    position: absolute;
    top: -20px;
    left: 40px;
    height: 20px;
    width: 20px;
    background-color: #eee;
  }

  .skills-details .dw-container i {
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
  .skills-details .tooltip-container {
    position: relative;
  }
  .skills-details .tooltip-msg {
    display: none;
    position: absolute;
    width: max-content;
    z-index: 999;
    top: 50px;
    left: 0;
    text-align: left;
    padding: 10px;
    border: 1px solid white;
    background: #000000a1;
  }
  .skills-details .table thead th {
    border-bottom: 0;
    vertical-align: middle;
    width: 40px;
    border-top: 0;
  }
  .skills-details .table td {
    padding: 0.7rem 0 0.3rem 0;
    /* border-top: 0; */
  }
  .table-skills { 
    border-spacing: 0px;
    border: 1px solid white;
  }
  .table-skills thead > tr > td:first-child,
  .table-skills tbody > tr > td:first-child {
    padding-left: 0.5rem;
  }

  .table-skills tbody {
    text-align: center;
    font-size: 15px;
  }
  .table-skills img {
    width: 50px;
  }
  .table-skills th {
    color: white;
    padding: 5px 0;
  }
  .table-skills td {
    vertical-align: middle;
  }
  .table-skills th.separator-th {
    width: 1px !important;
    background: #ffffff7a;
  }
  .table-skills .separator-td {
    width: 1px;
    background: #ffffff7a;
  }
  .table-skills p {
    margin: 0;
  }

  /* Skills rotations */
  .skills-rotation {
    width: 715px;
    margin: 0 1em;
  }
  button.rotation {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: white;
    border: 0;
  }
  button.disabled-rotation {
    background: #5c5c5c;
    color: black;
  }
  
  .skills-rotation input {
    width: 50px;
  }

  @media screen and (max-width: 1400px) {
    .skills-container {
      flex-direction: column;
      align-items: center;
    }
  }
  @media screen and (max-width: 750px) {
    .skills-container {
      min-width: 100%;
    }
    .skills-rotation {
      width: 100%;
    }
  }
  
</style>