<template>
  <div class="rotations-container">
    <div class="actions">
      <button class="btn" @click="reset = true">Reset</button>
      <button class="btn" @click="deleteComponent">Delete</button>
    </div>

    <div class="chains-container">
      <div>
        <ChainSkill :data="filteredChains[0]" :pos="0" :skills="skills" :charCD="charCD" :thValue="true" :reset="reset" @reset="reset = false" @total-values="showTotal" @chains="getChains" :rotationId="id" />
        <ChainSkill :data="filteredChains[1]" :pos="1" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" />
        <ChainSkill :data="filteredChains[2]" :pos="2" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" />
        <ChainSkill :data="filteredChains[3]" :pos="3" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" />
        <ChainSkill :data="filteredChains[4]" :pos="4" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" />
        <ChainSkill :data="filteredChains[5]" :pos="5" :skills="skills" :charCD="charCD" :reset="reset" @total-values="showTotal" @chains="getChains" :rotationId="id" />
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

import ChainSkill from './ChainSkill.vue';

export default {
  props: ['skills', 'charCD', 'id', 'save', 'charId'],
  data() {
    return {
      reset: false,
      totalValues: [],
      allChains: [],
      filteredChains: []
    }
  },
  components: {
    ChainSkill
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
          if (ch.chains[0] == e.chains[0] && ch.chains[1][0] == e.chains[1][0]) {
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
        this.$store.commit('saveTemplate', {chains: this.allChains, ids: this.save.deleteId})
        this.$emit('save')
      }
    }
  },
  created() {
    if (this.$store.state.chainsArray) {
      this.filteredChains.length = 6

      // Get all chains
      this.allChains = this.$store.state.chainsArray
      // Filter by rotation id
      this.tmp = this.allChains.filter(ch => ch.chains[0] == this.id)

      // Add chains to rotation by pos
      for (let i = 0; i < 6; i++) {
        if (this.tmp[i]) {
          this.filteredChains[this.tmp[i].pos] = this.tmp[i]
        }
      }
    }
  },
}
</script>

<style scoped>
  .rotations-container {
    position: relative;
  }
  .chains-container > div:first-child {
    display: flex;
  }
  .rotations-container .actions {
    position: absolute;
    top: 60px;
    left: 10px;
    display: flex;
    flex-direction: column;
  }
</style>