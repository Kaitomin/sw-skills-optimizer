<template>
  <div class="rotations-container">
    <div class="actions">
      <button class="btn" @click="reset = true">Reset</button>
      <button class="btn" @click="deleteComponent">Delete</button>
    </div>

    <div class="chains-container">
      <div>
        <ChainSkill :data="filteredChains[0]" :pos="0" :skills="skills" :charCD="charCD" :thValue="true" :reset="reset" @reset="reset = false" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
        <ChainSkill :data="filteredChains[1]" :pos="1" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
        <ChainSkill :data="filteredChains[2]" :pos="2" :skills="skills" :charCD="charCD" :thValue368="true" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
        <ChainSkill :data="filteredChains[3]" :pos="3" :skills="skills" :charCD="charCD" :thValue640="true" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
        <ChainSkill :data="filteredChains[4]" :pos="4" :skills="skills" :charCD="charCD" :thValue368="true" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
        <ChainSkill :data="filteredChains[5]" :pos="5" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" :name="name" />
      </div>
    </div>
    
    <div class="total-values">
      <p>Total DMG/Cast - {{ totalDmgCast }}</p>
      <p>Total DMG/CD - {{ totalDmgCd }}</p>
    </div>

    <hr>
  </div>
</template>

<script>

import { defineAsyncComponent } from 'vue'

export default {
  props: ['skills', 'charCD', 'id', 'save', 'charId', 'name'],
  data() {
    return {
      reset: false,
      totalValues: [],
      allChains: [],
      filteredChains: []
    }
  },
  components: {
    ChainSkill: defineAsyncComponent(() => import('./ChainSkill.vue'))
  },
  methods: {
    deleteComponent() {
      this.$emit('delete-component');
    },
    showTotal(e) {
      let index = this.totalValues.findIndex((a) => a.id === e.id);

      // If not found, add new array
      if (index == '-1') {
        this.totalValues.push(e);
        return;
      }

      // Replace existing array
      this.totalValues.splice(index, 1, e);
    },
    getChains(e) {
      let found = false

      if (this.allChains.length > 0) {
        this.allChains.forEach((ch, index) => {

          if (ch.chains[0] == e.chains[0] && ch.chains[2][0] == e.chains[2][0]) {       
            this.allChains.splice(index, 1, e)
            found = true
            return
          }
        });
      }
    
      if (!found) this.allChains.push(e);
    },
  },
  computed: {
    totalDmgCast() {
      return (this.totalValues.reduce((prev, curr) => {
        return prev + +curr.dmgCast;
      }, 0)).toFixed(2);
    },
    totalDmgCd() {
      return (this.totalValues.reduce((prev, curr) => {
        return prev + +curr.dmgCd;
      }, 0)).toFixed(2);
    },
  },
  watch: {
    save() {
      if (this.save.save) {
        this.$store.commit('saveChains', {chains: this.allChains, ids: this.save.deleteId, name: this.name})
        this.$emit('save')
      }
    },
  },
  created() {
    let tmp;
    switch (this.name) {
      case 'Lily':
        this.allChains = this.$store.getters.lilyChains
        tmp = this.allChains.filter(ch => ch.chains[0] == this.id)  
        for (let i = 0; i < 6; i++) {
          if (!tmp[i]) continue
          this.filteredChains[tmp[i].pos] = tmp[i]    
        }
        break;
      case 'Iris':
        this.allChains = this.$store.getters.irisChains
        tmp = this.allChains.filter(ch => ch.chains[0] == this.id)  
        for (let i = 0; i < 6; i++) {
          if (!tmp[i]) continue
          this.filteredChains[tmp[i].pos] = tmp[i]    
        }
        break;
    }
  },
}
</script>

<style scoped>
  .rotations-container {
    position: relative;
  }
  .chains-container > div {
    display: flex;
  }
  .actions {
    position: absolute;
    top: 60px;
    left: 10px;
    display: flex;
    flex-direction: column;
  }
  .btn {
    background: #00000052;
    color: white;
    border: 1px solid white;
  }
  .btn:hover {
    background: #e9e9e9;
    color: black;
    border: 1px solid white;
  }
  .actions > button:first-child {
    margin-bottom: 1em;
  }
  p {
    color: white;
  }
  @media screen and (max-width: 640px) {
    .rotations-container {
      padding: 0 5px;
    }
    .actions {
      top: 15px;
    }
    .btn {
      height: 65px;
    }
    .chains-container > div {
      display: grid;
      grid-template-columns: 1fr 1.05fr 1fr;
    }
  }
  @media screen and (max-width: 368px) {
    .chains-container > div {
      grid-template-columns: 60% 40%;
    }
  }
</style>