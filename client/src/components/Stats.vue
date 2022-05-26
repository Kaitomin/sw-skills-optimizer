<template>
  <div class="stats">
    <h3>Setup {{id + 1}}</h3>
    <div>
      <label>ATK</label>
      <input type="number" min="0" max="150000" v-model="atk" @keypress="sanitizeValues($event)">
    </div>
    <div>
      <label>CDMG</label>
      <input type="number" min="0" max="200000" v-model="cdmg" @keypress="sanitizeValues($event)">
    </div>
    <div>
      <label>AB</label>
      <input type="number" min="0" max="100" v-model="ab" @keypress="sanitizeValues($event)">
    </div>
    <div>
      <label>BDMG</label>
      <input type="number" min="0" max="350" v-model="bdmg" @keypress="sanitizeValues($event)">
    </div>
    <div>
      <label>Skill</label>
      <input type="number" min="0" max="40000" v-model="skill" @keypress="sanitizeValues($event)">
    </div>
    <div class="color-picker">
      <input type="color" name="color" v-model="color">
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
      dmg: 0,
      color: '#22e0c4',
      keysAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    }
  },
  methods: {
    calculateDmg() {

      // Check inputs
      this.atk = this.checkInput(this.atk, 0, 150000)
      this.cdmg = this.checkInput(this.cdmg, 0, 200000)
      this.ab = this.checkInput(this.ab, 0, 100)
      this.bdmg = this.checkInput(this.bdmg, 0, 350)
      this.skill = this.checkInput(this.skill, 0, 40000)

      // Calculate target defense rate
      const targetDef = this.enemyDefRate(this.target, this.ab)

      // Final dmg 
      this.dmg = (this.atk + this.cdmg) * (1 - targetDef) * (this.skill / 100) * (1 + this.bdmg / 100) * (1 - +this.target.dmgReduction / 100)
      this.$emit('total-dmg', {id: this.id, dmg: this.dmg, color: this.color});
    },
    enemyDefRate(enemy, ab) {
      return (+enemy.defense * (1 - ab / 100)) / ((+enemy.defense * (1 - ab / 100)) + +enemy.level * 50);
    },
    sanitizeValues(e) {
      if (!this.keysAllowed.includes(e.key)) e.preventDefault()
    },
    checkInput(val, min, max) {
      if (val < min) return min
      if (val > max) return max

      return val
    }
  },
  updated() {
    this.calculateDmg(this.atk, this.cdmg, this.ab, this.bdmg, this.skill)
  },
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
    padding: 1em 2em;
    display: flex;
    flex-direction: column;
    background: #ffffff21;
    border: 1px solid white;
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
    text-align: left;
  }
  .stats > div input{ 
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0);  
    background: #ffffff2e;
    padding: 8px 0 5px 0;
    font-size: 16px;
    color: #fff;
  }
  .stats > div input:focus{ 
    border: none;	
    outline: none;
    border-bottom: 1px solid #3ce7d7;	
  }
  .stats input[type='color'] {
    width: 65px;
    height: 25px;
    border-bottom: 0;
    border: 1px solid white;
    padding: 0;
  }
  .stats input[type='color']:hover {
    cursor: pointer;
  }
  .color-picker {
    text-align: left;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

</style>