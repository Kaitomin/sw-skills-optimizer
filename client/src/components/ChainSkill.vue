<template>
  <table class="table">
    <tr>
      <td v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))"></td>
      <!-- Chain -->
      <td>
        <div class="chains-container">

          <div v-if="name=='Nabi'">
            <input type="number" min="0" max="15" v-model="nabiBomb.counter" @keypress="sanitizeValues($event)">
          </div>

          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span v-if="!c1_s1">Skill 1</span>
                <img v-else :src="getImgUrl(c1_s1.icon)" :alt="c1_s1.skillName + ' icon'" width="48" height="48">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                 <li 
                  class="dropdown-item"
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s1 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
                </li>
                <li @click="c1_s1 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span v-if="!c1_s2">Skill 2</span>
                <img v-else :src="getImgUrl(c1_s2.icon)" :alt="c1_s2.skillName + ' icon'" width="48" height="48">
              <span class="caret"></span></button>
              <ul class="dropdown-menu">
                 <li
                  class="dropdown-item"
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s2 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
                </li>
                <li @click="c1_s2 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span v-if="!c1_s3">Skill 3</span>
                <img v-else :src="getImgUrl(c1_s3.icon)" :alt="c1_s3.skillName + ' icon'" width="48" height="48">
              <span class="caret"></span></button>
              <ul class="dropdown-menu">
                 <li
                  class="dropdown-item"
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s3 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
                </li>
                 <li @click="c1_s3 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">DMG</th>
      <td>{{ calcTotal(c1_s1, c1_s2, c1_s3, 'dmg') }}%</td>
    </tr>
    <tr class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">Cast</th>
      <td :class="castChecked && (c1_s1.castCancel < c1_s1.cast || c1_s2.castCancel < c1_s2.cast || c1_s3.castCancel < c1_s3.cast) ? 'cancel-active' : ''">{{ calcTotal(c1_s1, c1_s2, c1_s3, 'cast') }}s</td>
    </tr>
    <tr class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">CD</th>
      <td>{{ calcHighestCD(c1_s1.cd, c1_s2.cd, c1_s3.cd) }}s</td>
    </tr>
    <tr v-if="name == 'Chii'" class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">Marks</th>
      <td>{{ calcMarks(c1_s1, c1_s2, c1_s3) }}</td>
    </tr>
    <tr class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">DPS</th>
      <td>{{ calcDmgRatio(c1_s1, c1_s2, c1_s3, 'cast') }}%</td>
    </tr>
    <tr class="info">
      <th v-if="thValue || (thValue640 && (clientWidth > 368 && clientWidth <= 640)) || (thValue368 && (clientWidth <= 368))">DMG/CD</th>
      <td>{{ calcDmgRatio(c1_s1, c1_s2, c1_s3, 'cd') }}</td>
    </tr>
    <!-- End Chain -->
  </table>  
</template>

<script>

import { v4 as uuidv4 } from 'uuid';

export default {
  props: ['skills', 'charCD', 'thValue', 'thValue640','thValue368', 'reset', 'data', 'pos', 'rotationId', 'name', 'dwChecked', 'castChecked', 'ephDmg'],
  data() {
    return {
      chainId: '',
      c1_s1: '',
      c1_s2: '',
      c1_s3: '',
      totalDmg: 0,
      totalCast: 0,
      highestCd: 0,
      dmgCast: 0,
      dmgCd: 0,
      nabiBomb: {
        counter: 0,
        modifier: 300
      },
      chains: [],
      keysAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    }
  },
  methods: {
    getImgUrl(iconUrl) {
      try {
        return require('@/assets/uploads/skills/' + iconUrl.split('.')[0] + '.png')
      } catch (e) {
        return
      }
    },
    calcTotal(s1, s2, s3, val) {
      // Filter undefined skills & dupes
      const filteredSkills = [s1, s2, s3].filter(s => s);
      const arrSkills = [...new Set([...filteredSkills])];

      this.nabiBomb.counter = this.checkInput(this.nabiBomb.counter, 0, 15)

      if (this.name != 'Ephnel') {
        if (val === 'dmg') {
          this.totalDmg = Array.from(arrSkills).reduce((prev, curr) => {
            return +prev + +curr.dmg;
          }, 0) + (this.nabiBomb.counter * this.nabiBomb.modifier);
          return this.totalDmg;
        } else if (this.castChecked && val === 'cast') {
            this.totalCast = Array.from(arrSkills).reduce((prev, curr) => {
              return +prev + +curr.castCancel;
            }, 0);
          return (this.totalCast/60).toFixed(2);
        } else if (val === 'cast') {
          this.totalCast = Array.from(arrSkills).reduce((prev, curr) => {
              return +prev + +curr.cast;
            }, 0);
          return (this.totalCast/60).toFixed(2);
        }
      }

      if (this.name == 'Ephnel') {     
        if (val === 'dmg') {
          switch (this.ephDmg) {
            case 'release':
              this.totalDmg = Array.from(arrSkills).reduce((prev, curr) => {
                return +prev + +curr.dmgRelease;
              }, 0);
              break;
            case 'bullet':
              this.totalDmg = Array.from(arrSkills).reduce((prev, curr) => {
                return +prev + +curr.dmgBullet;
              }, 0);
              break;
            default :
              this.totalDmg = Array.from(arrSkills).reduce((prev, curr) => {
                return +prev + +curr.dmg;
              }, 0);
              break;
          }
        return this.totalDmg;

        } else if (this.castChecked && val === 'cast') {
          this.totalCast = Array.from(arrSkills).reduce((prev, curr) => {
            return +prev + +curr.castCancel;
          }, 0);
          return (this.totalCast/60).toFixed(2);
        } else if (val === 'cast') {
          this.totalCast = Array.from(arrSkills).reduce((prev, curr) => {
              return +prev + +curr.cast;
            }, 0);
          return (this.totalCast/60).toFixed(2);
        }
      }

    },
    calcDmgRatio(s1, s2, s3, value) {
      if (!s1 && !s2 && !s3) return this.dmgCast = this.dmgCd = 0;

      if (value === 'cast') {
        this.dmgCast = Math.round(this.totalDmg / (this.totalCast/60));
        return this.dmgCast;
      } else if (value === 'cd') {
        if (this.highestCd == 0) return '0'
        this.dmgCd = (this.totalDmg / this.highestCd).toFixed(2);
        return this.dmgCd;
      }
    },
    calcHighestCD(s1 = 0, s2 = 0, s3 = 0) {
      const newCd = this.applyCdr([s1, s2, s3]);

      this.highestCd = Math.max(...newCd).toFixed(2);
      return this.highestCd;
    },
    // Chii marks count
    calcMarks(s1, s2, s3) {
      if (!s1 && !s2 && !s3) return 0;

      let tmp = new Set([s1, s2, s3])

      let arrCount = Array.from(tmp).reduce((prev, curr) => +prev + (curr.mark ? +curr.mark : 0), 0);

      return arrCount
    },
    applyCdr(arr) {
      arr.forEach((val, index) => {
        if (index == 2) {          
          arr[index] -= +val * (+this.charCD + 15) / 100;
          return;
        }
        arr[index] -= val * this.charCD / 100;
      })
      return arr;
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
  computed: {
    skillValue() {
      return {
        c1_s1: this.c1_s1,
        c1_s2: this.c1_s2,
        c1_s3: this.c1_s3,
        nabiBomb: this.nabiBomb.counter

      }
    },
    clientWidth() {
      return window.innerWidth
    }
  },
  watch: {
    reset() {
      if (this.reset) {
        this.c1_s1 = this.c1_s2 = this.c1_s3 = ''
        this.nabiBomb.counter = 0
        this.$emit('reset');
      }
    },
    skillValue() {
      if (this.name == 'Nabi') {
        this.chains = [this.rotationId, this.name, [this.chainId, this.c1_s1, this.c1_s2, this.c1_s3, this.nabiBomb.counter]]
      } else {
        this.chains = [this.rotationId, this.name, [this.chainId, this.c1_s1, this.c1_s2, this.c1_s3]]
      }
      this.$emit('chains', {chains: this.chains, pos: this.pos})
    },
    skills() {
      this.skills.forEach(skill => {
        if (skill._id == this.c1_s1._id) {
          this.c1_s1 = skill
        }
        if (skill._id == this.c1_s2._id) {
          this.c1_s2 = skill
        }
        if (skill._id == this.c1_s3._id) {
          this.c1_s3 = skill
        }
      });
    },
    dwChecked() {
      if (this.dwChecked) this.nabiBomb.modifier = 360
      else this.nabiBomb.modifier = 300
    }
  },
  created() {
    if (!this.data) {
      this.chainId = uuidv4()
      if (this.name == 'Nabi') {
        this.chains = [this.rotationId, this.name, [this.chainId, this.c1_s1, this.c1_s2, this.c1_s3, this.nabiBomb.counter]]
      } else {
        this.chains = [this.rotationId, this.name, [this.chainId, this.c1_s1, this.c1_s2, this.c1_s3]]
      }
    } else {
      this.chainId = this.data.chains[2][0]
      this.c1_s1 = this.data.chains[2][1]
      this.c1_s2 = this.data.chains[2][2]
      this.c1_s3 = this.data.chains[2][3]
      // Nabi bomb
      if (this.data.chains[2][4]) {
        this.nabiBomb.counter = this.data.chains[2][4]
      }

      // Copy array by reference (reference is lost using JSON.parse in Vuex)
      if (this.c1_s1._id == this.c1_s2._id) {
        this.c1_s1 = this.c1_s2
      }
      if (this.c1_s1._id == this.c1_s3._id) {
        this.c1_s1 = this.c1_s3
      }
      if (this.c1_s3._id == this.c1_s2._id) {
        this.c1_s3 = this.c1_s2
      }
    }
  },
  updated() {
    this.$emit('total-values', {
      id: this.chainId,
      name: this.name,
      dmgCast: this.dmgCast,
      dmgCd: this.dmgCd
    })
  }
}
</script>

<style scoped>
  .table {
    color: white;
  }
  td, th {
    padding: 0.6rem 0.2rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
  }
  .table > tr:first-child > td {
    border-top: none;
  }
  .chains-container {
    display: flex;
    flex-direction: column-reverse;
  }
  input {
    width: 100%;
    background: #006b8073;
    border: 0;
    color: white;
    text-align: center;
    border-radius: 0.25rem;
  }
  .chains-sub {
    display: flex;
    justify-content: center;
    align-content: center;
    margin: 3px 0;
  }
  button.dropdown-toggle::after {
    content: none;
  }
  .btn {
    height: 72px;
    width: 72px;
  }
  ul.dropdown-menu {
    padding: 0.2rem 0.5rem;
    min-width: 0;
  }
  ul.show {
    display: grid;
    grid-template-columns: repeat(4, 50px);
    grid-gap: 1px 5px;
    background: #ffffff47;
    transform: translate3d(-120px, 38px, 0) !important;
    top: 25px !important;
    left: -5px !important;
  }
  ul.dropdown-menu li {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  li {
    font-size: 40px;
  }
  .dropdown-item:hover {
    background: none;
  }
  .fa-ban {
    color: red;
    font-size: 48px;
  }
  .cancel-active {
    color: #00fdce;
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

  /* Responsive */
  @media screen and (max-width: 640px) { 
    .chains-container {
      align-items: end; 
    }
    td {
      text-align: right;
    }
  }
  @media screen and (max-width: 368px) { 
    .chains-container {
      align-items: center; 
    }
    td {
      text-align: center;
    }
  }
</style>