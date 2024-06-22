<template>
  <div class="skills-container" :class="name.toLowerCase()">
    <!-- Skills table -->
    <EphnelTable 
      v-if="name == 'Ephnel'"
      :charName="name"
      @skills-table="toggleDesire"
      @ephnel-dmg="toggleEphDmg"
      @char-cdr="currentCDR"
      @cast-cancel="toggleCastCancel"
    />
    <ChiiTable 
      v-else-if="name == 'Chii'"
      :charName="name"
      @skills-table="toggleDesire"
      @char-cdr="currentCDR"
      @cast-cancel="toggleCastCancel"
    />
    <SkillsTable 
      v-else
      :charName="name"
      @skills-table="toggleDesire"
      @char-cdr="currentCDR"
      @cast-cancel="toggleCastCancel"
    />
    <!-- Rotations -->
    <div class="skills-rotation">
      <div class="chain-bonus">
        <p><i>3rd row automatically takes into account 15% CDR chain bonus</i></p>
        <p><i>No selectable 2nd row bonus nor 3rd row DMG% bonus for now</i></p>
        <p v-if="name=='Nabi'" class="nabi-note">Enter number of bombs detonated below each chain</p>
      </div>
      <button v-if="rotationLimit > 0" class="btn btn-info btn-save" @click="saveRotations"><i class="fa-solid fa-floppy-disk"></i> Save templates</button>
      <Rotation
        v-for="component in components"
        :key="component[0]"
        :id="component[0]"
        :ephDmg="ephDmg"
        :skills="skills"
        :dwChecked="dwChecked"
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
      dwChecked: false,
      castChecked: false,
      components: new Map(),
      rotationLimit: 0,
      deleteId: [],
      save: { save: false, deleteId: this.deleteId },
      sortOrder: false,
      containerH: '',
      ephDmg: '',
    }
  },
  components: { 
    Rotation,
    SkillsTable: defineAsyncComponent(() => import('@/components/SkillsTable.vue')),
    ChiiTable: defineAsyncComponent(() => import('@/components/ChiiTable.vue')),
    EphnelTable: defineAsyncComponent(() => import('@/components/EphnelTable.vue')),
  },
  methods: {
    toggleDesire(payload) {
      this.skills = payload.skillsTable
      this.dwChecked = payload.dwChecked
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
    toggleEphDmg(val) {
      this.ephDmg = val
    },
    deleteComponent(c) {
      // Add component id to delete to array
      if (!this.deleteId.includes(c[0])) this.deleteId.push(c[0])  

      this.components = new Map(Array.from(this.components).filter(comp => comp[0] != c[0]));
      this.rotationLimit -= 1;

      if (this.components.size <= 0) {
        this.clearLocalStorage()
        return
      }
      
      this.saveRotations()
    },
    // Commit all changes
    saveRotations() {
      this.save = { save: true, deleteId: this.deleteId }
      this.$store.commit('saveRotations', {
        name: this.name, 
        rotations: JSON.stringify(Array.from(this.components.entries()))
      });
      this.$router.go()
    },
    clearLocalStorage() {
      this.$store.commit('clearLocalStorage', {
        name: this.name
      })
    },
    // Reset save props after saveTemplate()
    setSave() {
      this.save.save = false
    },
  },
  created() {
    // For testing
    if (this.name == 'tmpChar') this.$router.push('/')

    try {
      // Get character rotations from store
      const charRotations = `${this.name.toLowerCase()}Rotations`

      this.components = this.$store.getters.getRotations(charRotations)
      this.rotationLimit = Array.from(this.components).length
    } catch {
      // Character does not exist in store
      this.$router.push('/')
    }
  },
  unmounted() {
    this.components = null
    this.rotationLimit = null
  }
}

</script>

<style scoped>
  .skills-rotation {
    padding-top: 3em;
  }

  /* --------------------- */
  /* SkillsTable component */
  /* --------------------- */
  .skills-container {
    display: flex;
    justify-content: space-around;
  }
  
  .skills-container:before {
    animation: 2s ease-in 1s fadeIn forwards;
  }
  p {
    margin-bottom: 0;
  }
  p, 
  label, 
  table {
    color: white;
  }
  p.nabi-note {
    font-style: italic;
    color: cyan;
  }

  /* Animation */
  @-webkit-keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 1; }  
  }

  @keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 1; } 
  }

  /* ------------------- */
  /* Rotation component */
  /* ------------------- */
  .chain-bonus {
    padding: 0.5em;
    margin-bottom: 1em;
  }
  button.rotation {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: white;
    margin-bottom: 1em;
    border: 1px solid white;
    border-radius: 5px;
  }
  button.disabled-rotation {
    background: #5c5c5c;
    color: black;
    cursor: default;
  }
  .btn-info {
    color: white;
    border-radius: 5px;
    border-color: #95989e !important;
    background-color: #48515e !important;
  }
  .btn-info:hover {
    cursor: pointer;
  }

  button.add-rotation {
    background-color: #48515e;
    border-color: #95989e;
    transition: background-color 0.2s;
  }

  /* ---------- */
  /* Responsive */
  /* ---------- */
  @media screen and (max-width: 1600px) {
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