<template>
  <div class="stats">
    <h3>Setup {{id + 1}}</h3>
    <div>
      <label>ATK</label>
      <input type="number" min="0" max="100000" v-model="atk">
    </div>
    <div>
      <label>CDMG</label>
      <input type="number" min="0" max="200000" v-model="cdmg">
    </div>
    <div>
      <label>AB</label>
      <input type="number" min="0" max="100" v-model="ab">
    </div>
    <div>
      <label>BDMG</label>
      <input type="number" min="0" max="400" v-model="bdmg">
    </div>
    <div>
      <label>Skill %</label>
      <input type="number" min="0" max="100000" v-model="skill">
    </div>
  </div>
</template>

<script>

export default {
  props: ['target', 'id'],
  data() {
    return {
      atk: 50000,
      cdmg: 80000,
      ab: 50,
      bdmg: 200,
      skill: 7500,
      dmg: 0
    }
  },
  methods: {
    calculateDmg() {
      // Calculate target defense rate
      const targetDef = this.enemyDefRate(this.target, this.ab)

      // Final dmg 
      this.dmg = (this.atk + this.cdmg) * (1 - targetDef) * (this.skill / 100) * (1 + this.bdmg / 100) * (1 - +this.target.dmgReduction)
      this.$emit('total-dmg', {id: this.id, dmg: this.dmg});
     
    },
    enemyDefRate(enemy, ab) {
      return (+enemy.defense * (1 - ab / 100)) / ((+enemy.defense * (1 - ab / 100)) + +enemy.level * 50);
    }
  },
  created() {
  },
  updated() {
    this.calculateDmg(this.atk, this.cdmg, this.ab, this.bdmg, this.skill)
  }
}
</script>

<style scoped>
  h3 {
    border-bottom: 1px solid;
    padding-bottom: 0.5em;
    color: white;
    font-size: 1.25rem;
  }
  .stats {
    border-left: 2px solid #3ce7d770;
    padding: 1em 2em;
    display: flex;
    flex-direction: column;
    background: #ffffff12;
  }
  label {
    color: white;
    width: 125px;
  }
  input {
    width: 85px;
    text-align: center;
  }
  .stats > div {
    position: relative;
    margin-bottom: 15px;
  }
  .stats > div label{
    font-size: 16px;
    color: #fff;	
    transition: all 0.5s ease-in-out;
  }
  .stats > div input{ 
    border: 0;
    border-bottom: 1px solid #555;  
    background: transparent;
    padding: 8px 0 5px 0;
    font-size: 16px;
    color: #fff;
  }
  .stats > div input:focus{ 
    border: none;	
    outline: none;
    border-bottom: 1px solid #3ce7d7;	
  }


</style>