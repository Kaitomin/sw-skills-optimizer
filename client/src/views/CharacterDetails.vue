<template>
  <div class="skills-container" :class="name.toLowerCase()" :style="[containerHeight, characterThemeColors, { '--character-bg': `url(${require(`@/assets/img/${this.name.toLowerCase()}_bg.webp`)})` }]">
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
      colors: {
        '--erwin-primary': '#001938f0',
        '--erwin-secondary': '#00224ce6',
        '--erwin-tertiary': '#00295c',

        '--iris-primary': '#380000f0',
        '--iris-secondary': '#4c0000e6',
        '--iris-tertiary': '#5c0000',

        '--dana-primary': '#160038f0',
        '--dana-secondary': '#1d004ce6',
        '--dana-tertiary': '#1f005c',

        '--stella-primary': '#250038f0',
        '--stella-secondary': '#2f004ce6',
        '--stella-tertiary': '#30005c',

        '--chii-primary': '#380019f0',
        '--chii-secondary': '#4c0025e6',
        '--chii-tertiary': '#5c0026',

        '--ephnel-primary': '#003827f0',
        '--ephnel-secondary': '#004c32e6',
        '--ephnel-tertiary': '#005c3a',

        '--lily-primary': '#380038f0',
        '--lily-secondary': '#4b004ce6',
        '--lily-tertiary': '#5c005b',

        '--nabi-primary': '#002e38f0',
        '--nabi-secondary': '#00414ce6',
        '--nabi-tertiary': '#004b5c',

        '--haru-primary': '#382400f0',
        '--haru-secondary': '#4c3100e6',
        '--haru-tertiary': '#5c3300',

      }
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
    characterThemeColors() {
      return {
        '--primary': this.colors[`--${this.name.toLowerCase()}-primary`],
        '--secondary': this.colors[`--${this.name.toLowerCase()}-secondary`],
        '--tertiary': this.colors[`--${this.name.toLowerCase()}-tertiary`],
      }
    }
  },
  created() {
    // if (this.name === "tmpChar" && !this.$root.userRole) {
      // this.$router.push('/')
    // } else {
      try {
        // Get character rotations from store
        const charRotations = `${this.name.toLowerCase()}Rotations`

        this.components = this.$store.getters.getRotations(charRotations)
        this.rotationLimit = Array.from(this.components).length
      } catch {
        // Character does not exist in store
        this.$router.push('/')
      }
    // }
  },
  mounted() {
    // Get client window Y to set background height
    setTimeout(() => {
      this.containerH = document.querySelector('.skills-container').offsetHeight + 'px'
    }, 1000)
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
  /* --------------------- */
  /* SkillsTable component */
  /* --------------------- */
  .skills-container {
    display: flex;
    justify-content: space-around;
  }
  .skills-container:before {
    height: var(--container-height);
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

  /* Character Theme */
  .skills-container:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    z-index: -999;
    opacity: 0;
    background: var(--character-bg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .skills-container :deep(.skills-details) .char-info {
    background-color: var(--primary);
  }
  .skills-container :deep(.skills-details) .table-skills th:first-child {
    width: 10%;
  }
  .skills-container :deep(.skills-details) .table-skills th {
    background-color: var(--tertiary);
    width: 5%;
  }
  .skills-container :deep(.skills-details) .table-skills tbody tr {
    background-color: var(--secondary);
  }
  .skills-container :deep(.skills-details) .table-skills tbody > tr:nth-of-type(odd) {
    background-color: var(--primary);
  }


  


  /* ------------------- */
  /* Rotation component */
  /* ------------------- */
  .skills-rotation {
    padding-top: 3em;
  }
  .skills-rotation :deep(.chains-container) .table:first-child .info {
    border-left: 1px solid white;
  }
  .skills-rotation :deep(.chains-container) .table:last-child .info {
    border-right: 1px solid white;
  }
  .skills-rotation :deep(.info) {
    background-color: var(--secondary);
  }
  .chain-bonus {
    padding: 0.5em;
    margin-bottom: 1em;
    background-color: var(--primary);
  }
  button.rotation {
    display: inline-block;
    width: 120px;
    height: 40px;
    color: white;
    margin-bottom: 1em;
    border: 1px solid white;
  }
  button.disabled-rotation {
    background: #5c5c5c;
    color: black;
    cursor: default;
  }
  .btn-info {
    color: white;
    border-radius: 0;
    background-color: var(--primary);
    border-color: #ffffff !important;
  }
  .btn-info:hover {
    cursor: pointer;
    background: var(--secondary);
  }

  /* Character Theme */
  button.add-rotation {
    background-color: var(--primary);
    transition: background-color 0.2s;
  }
  button.add-rotation:hover {
    background-color: var(--secondary);
  }
  .skills-container :deep(.skills-rotation) .chains-container .dropdown-toggle {
    color: white;
    border: 1px solid white;
    background-color: var(--secondary);
  }

  .skills-container :deep(.skills-rotation) .chains-container .dropdown-toggle:hover {
    background-color: var(--secondary);
  }





  /* ---------- */
  /* Responsive */
  /* ---------- */
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