<template>
  <div class="skills-container">
    <!-- Skills -->
    <div class="skills-details">
      <h1>Skills</h1>
      <div v-if="char">
        <div class="cdInput">
          <input type="range" id="charCD" min="0" max="55" step="1" v-model="charCD" />
          <p id="cdInput">Character CDR : {{ charCD +'%' }}</p>
        </div>
        <table class="table table-striped table-skills">
          <thead>
            <tr>
              <th scope="col">Skill</th>
              <th scope="col" @click="sortBy('dmg')">DMG</th>
              <th scope="col" @click="sortBy('cast')">Cast</th>
              <th scope="col" @click="sortBy('cd')">CD [{{ charCD }}%]</th>
              <th scope="col" @click="sortBy('cd')">CD [{{ +charCD + 15}}%]</th>
              <th class="separator-th"></th>
              <th scope="col">DMG/Cast</th>
              <th scope="col">DMG/CD [{{ charCD }}%]</th>
              <th scope="col">DMG/CD [{{ +charCD + 15 }}% ]</th>
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
              <td>{{ Math.round(skill.dmg/skill.cast) }}</td>
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
      <button class="btn btn-info" @click="saveTemplate">Save templates</button>
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
  props: ['id'],
  data() {
    return {
      char: '',
      charCD: '44',
      skills: [],
      components: new Map(),
      rotationLimit: 0,
      deleteId: [],
      save: {save: false, deleteId: this.deleteId}
    }
  },
  components: { Rotation },
  methods: {
    getImgUrl(iconUrl) {
      return require('@/assets/uploads/skills/' + iconUrl)
    },
    calcCD(skill) {
      return (+skill.cd - (+skill.cd * this.charCD/100)).toFixed(2);
    },
    calcCD15(skill) {
      return (+skill.cd - ((+skill.cd * this.charCD/100) + (+skill.cd * 0.15))).toFixed(2);
    },
    sortBy(criteria) {
      this.skills.sort((a, b) => {
        return +a[criteria] - +b[criteria];
      });
    },
    addRotation() {
      this.rotationLimit <= 3 ? this.components.set(uuidv4(), Rotation) : false;
      this.rotationLimit += 1;
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
    }
  },
  created() {
    // Get character skills
    const getInfo = () => {
      CharacterService.getCharacterInfo(this.id)
      .then(res => {
        this.char = res.data.character;
        this.skills = res.data.skills;
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
    margin-bottom: 4.5rem;
  }
  /* Skills container */
  .skills-container {
    display: flex;
    justify-content: space-around;
    /* flex-direction: column; */
  }

  /* SKills details */
  .skills-details {
    min-width: 715px;
    margin: 0 1em;
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
    background: #d10000;
    color: white;
    padding: 5px 0;
  }
  .table-skills td {
    vertical-align: middle;
  }
  .table-skills th.separator-th {
    width: 1px !important;
  }
  .table-skills .separator-td {
    width: 1px;
    background: #80808014;;
  }
  .table-skills p {
    margin: 0;
  }

  /* Skills rotations */
  .skills-rotation {
    width: 715px;
  }
  button.rotation {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: white;
    border: 0;
  }
  button.add-rotation {
    background: #d10000;
  }
  button.disablerotation {
    background: #5c5c5c;
  }
  
  .skills-rotation input {
    width: 50px;
  }
  
</style>