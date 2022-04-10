<template>
  <div class="skills-container" :class="name.toLowerCase()" :style="containerHeight">
    <!-- Skills table -->
    <SkillsTable 
      :charName="name"
      @skills-table="toggleDesire"
      @char-cdr="currentCDR"
      @cast-cancel="toggleCastCancel"
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
        :castChecked="castChecked"
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

import { v4 as uuidv4 } from 'uuid';
import { defineAsyncComponent } from 'vue'
import Rotation from '@/components/Rotation.vue'

export default {
  props: ['id', 'name'],
  data() {
    return {
      char: '',
      charCD: '44',
      skills: [],
      castChecked: false,
      components: new Map(),
      rotationLimit: 0,
      deleteId: [],
      save: { save: false, deleteId: this.deleteId },
      sortOrder: false,
      containerH: ''
    }
  },
  components: { 
    // Rotation: defineAsyncComponent(() => import('@/components/Rotation.vue')), 
    Rotation,
    SkillsTable: defineAsyncComponent(() => import('@/components/SkillsTable.vue'))
  },
  methods: {
    toggleDesire(skillsTable) {
      this.skills = skillsTable
    },
    toggleCastCancel(cast) {
      this.castChecked = cast
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
      this.$router.go()
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
    },
  },
  created() {
    if (this.name == 'Ephnel') {
      this.$router.push('/')
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
      case 'Stella':
        this.components = this.$store.getters.stellaRotations;
        this.rotationLimit = Array.from(this.components).length
        break;
      case 'Haru':
        this.components = this.$store.getters.haruRotations;
        this.rotationLimit = Array.from(this.components).length
        break;
      case 'Ephnel':
        this.components = this.$store.getters.ephnelRotations;
        this.rotationLimit = Array.from(this.components).length
        break;
      default: 
        this.components = null
        this.rotationLimit = null
    }
    setTimeout(() => {
      this.containerH = document.querySelector('.skills-container').offsetHeight + 'px'
    }, 500)
  },
  updated() {
    this.containerH = document.querySelector('.skills-container').offsetHeight + 'px'
  },
  unmounted() {
    this.components = null
    this.rotationLimit = null
  }
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

  p {
    margin-bottom: 0;
  }
  p, label, table {
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
    border-radius: 5px;
  }
  button.disabled-rotation {
    background: #5c5c5c;
    color: black;
  }
  .btn-info {
    color: white;
    background-color: #0064e1 !important;
    border-color: #0064e1 !important
  }
  .btn-info:hover {
    color: none;
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