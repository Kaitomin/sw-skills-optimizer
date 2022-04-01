<template>
  <div class="skills-container" :class="name.toLowerCase()" :style="containerHeight">
    <!-- Skills table -->
    <SkillsTable 
      :charName="name"
      @skills-table="toggleDesire"
      @char-cdr="currentCDR"
    />
    <!-- Rotations -->
    <div class="skills-rotation">
      <h1>Rotations</h1>
      <div class="chain-bonus">
        <p><i>3rd row automatically takes into account 15% CDR chain bonus</i></p>
        <p><i>No selectable 2nd row bonus nor 3rd row DMG% bonus for now</i></p>
      </div>
      <button v-if="rotationLimit > 0" class="btn btn-info btn-save" @click="saveRotations">Save templates</button>
      <Rotation
        v-for="component in components"
        :key="component[0]"
        :id="component[0]"
        :skills="skills"
        :charCD="charCD"
        :save="save"
        :charId="id"
        :name="name"
        @save="setSave"
        @delete-component="deleteComponent(component)"
      />     
      <button class="rotation" :class="rotationLimit <= 2 ? 'add-rotation' : 'disabled-rotation'" @click="addRotation">Add rotation</button>
    </div>
  </div>
  
</template>

<script>

import Rotation from '../components/Rotation.vue';
import SkillsTable from '../components/SkillsTable.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  props: ['id', 'name'],
  data() {
    return {
      char: '',
      charCD: '44',
      skills: [],
      components: new Map(),
      rotationLimit: 0,
      deleteId: [],
      save: { save: false, deleteId: this.deleteId },
      sortOrder: false,
      containerH: ''
    }
  },
  components: { Rotation, SkillsTable },
  methods: {
    toggleDesire(skillsTable) {
      this.skills = skillsTable
    },
    currentCDR(charCDR) {
      this.charCD = charCDR
    },
    addRotation() {
      if (this.rotationLimit <= 2) {
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
    saveRotations() {
      this.save = {save: true, deleteId: this.deleteId}
      this.$store.commit('saveRotations', {
        name: this.name, 
        rotations: JSON.stringify(Array.from(this.components.entries()))
      });
    },
    // Reset save props after saveTemplate()
    setSave() {
      this.save.save = false
    },
  },
  computed: {
    containerHeight() {
      return {
        '--container-height': this.containerH
      }
    }
  },
  mounted() {
    // Get rotations templates
    switch (this.name) {
      case 'Lily':
        this.components = this.$store.getters.lilyRotations;
        this.rotationLimit = Array.from(this.components).length
        break;
      case 'Iris':
        this.components = this.$store.getters.irisRotations;
        this.rotationLimit = Array.from(this.components).length
        break;
    }
    setTimeout(() => {
      this.containerH = document.querySelector('.skills-container').offsetHeight + 'px'
    }, 500)
  },
  updated() {
    this.containerH = document.querySelector('.skills-container').offsetHeight + 'px'
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
  /* Skills container */
  .skills-container {
    display: flex;
    justify-content: space-around;
    /* flex-direction: column; */
  }
  .skills-container:before {
    height: var(--container-height);
    animation: 2s ease-in 0s fadeIn;
  }
  @-webkit-keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.5; }  
  }
  @keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.5; } 
  }

  .skills-container p {
    margin-bottom: 0;
  }
  .skills-container p,
  .skills-container label,
  .skills-container table {
    color: white;
  }
  .chain-bonus {
    margin-bottom: 1em;
  }
  button.rotation {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: white;
    border: 0;
    margin-bottom: 1em;
  }
  button.disabled-rotation {
    background: #5c5c5c;
    color: black;
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
  }
  @media screen and (max-width: 640px) {
    .skills-rotation {
      width: 100%;
    }
  }
  
</style>