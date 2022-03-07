<template>
  <table class="table">
    <tr>
      <td v-if="thValue"></td>
      <!-- Chain -->
      <td>
        <div class="chains-container">
          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                <span v-if="!c1_s1">Skill 1</span>
                <img v-else :src="getImgUrl(c1_s1.icon)" alt="">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                 <li 
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s1 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" alt="">
                </li>
                <li @click="c1_s1 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                <span v-if="!c1_s2">Skill 2</span>
                <img v-else :src="getImgUrl(c1_s2.icon)" alt="">
              <span class="caret"></span></button>
              <ul class="dropdown-menu">
                 <li 
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s2 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" alt="">
                </li>
                <li @click="c1_s2 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
          <div class="chains-sub">
            <div class="dropdown">
              <button class="btn dropdown-toggle" type="button" data-toggle="dropdown">
                <span v-if="!c1_s3">Skill 3</span>
                <img v-else :src="getImgUrl(c1_s3.icon)" alt="">
              <span class="caret"></span></button>
              <ul class="dropdown-menu">
                 <li 
                  v-for="skill in skills" 
                  :key="skill._id"
                  @click="c1_s3 = skill"
                 >
                  <img :src="getImgUrl(skill.icon)" alt="">
                </li>
                 <li @click="c1_s3 = ''"><i class="fa-solid fa-ban"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <th v-if="thValue">DMG</th>
      <td>{{ calcTotal(c1_s1, c1_s2, c1_s3, 'dmg') }}%</td>
    </tr>
    <tr>
      <th v-if="thValue">Cast</th>
      <td>{{ calcTotal(c1_s1, c1_s2, c1_s3, 'cast') }}</td>
    </tr>
    <tr>
      <th v-if="thValue">CD</th>
      <td>{{ calcHighestCD(c1_s1.cd, c1_s2.cd, c1_s3.cd) }}s</td>
    </tr>
    <tr>
      <th v-if="thValue">DMG/Cast</th>
      <td>{{ calcDmgRatio(c1_s1, c1_s2, c1_s3, 'cast') }}</td>
    </tr>
    <tr>
      <th v-if="thValue">DMG/CD</th>
      <td>{{ calcDmgRatio(c1_s1, c1_s2, c1_s3, 'cd') }}</td>
    </tr>
    <!-- End Chain -->
  </table>
  
  
</template>

<script>

import { v4 as uuidv4 } from 'uuid';

export default {
  props: ['skills', 'charCD', 'thValue', 'reset', 'data', 'pos', 'rotationId'],
  data() {
    return {
      id: '',
      c1_s1: '',
      c1_s2: '',
      c1_s3: '',
      totalDmg: 0,
      totalCast: 0,
      highestCd: 0,
      dmgCast: 0,
      dmgCd: 0,
      chains: []
    }
  },
  methods: {
    getImgUrl(iconUrl) {
      return require('@/assets/uploads/skills/' + iconUrl)
    },
    calcTotal(s1, s2, s3, val) {
      // Filter undefined skills & dupes
      const filteredSkills = [s1, s2, s3].filter(s => s);
      const arrSkills = [...new Set([...filteredSkills])];

      if (val === 'dmg') {
        this.totalDmg = Array.from(arrSkills).reduce((prev, curr) => {
          return +prev + +curr.dmg;
        }, 0);
        return this.totalDmg;
      } else if (val === 'cast') {
          this.totalCast = Array.from(arrSkills).reduce((prev, curr) => {
            return +prev + +curr.cast;
          }, 0);
        return this.totalCast;
      }
    },
    calcDmgRatio(s1, s2, s3, value) {
      if (!s1 && !s2 && !s3) return this.dmgCast = this.dmgCd = 0;

      if (value === 'cast') {
        this.dmgCast = (this.totalDmg / this.totalCast).toFixed(2);
        return this.dmgCast;
      } else if (value === 'cd') {
        this.dmgCd = (this.totalDmg / this.highestCd).toFixed(2);
        return this.dmgCd;
      }
    },
    calcHighestCD(s1 = 0, s2 = 0, s3 = 0) {
      const newCd = this.applyCdr([s1, s2, s3]);

      this.highestCd = Math.max(...newCd).toFixed(2);
      return this.highestCd;
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
  },
  computed: {
    skillValue() {
      return {
        c1_s1: this.c1_s1,
        c1_s2: this.c1_s2,
        c1_s3: this.c1_s3
      }
    }
  },
  watch: {
    reset() {
      if (this.reset) {
        this.c1_s1 = this.c1_s2 = this.c1_s3 = ''
        this.$emit('reset');
      }
    },
    skillValue() {
      this.chains = [this.rotationId, [this.id, this.c1_s1, this.c1_s2, this.c1_s3]]
      this.$emit('chains', {chains: this.chains, pos: this.pos})
    }
  },
  created() {
    if (!this.data) {
      this.id = uuidv4()
      this.chains = [this.rotationId, [this.id, this.c1_s1, this.c1_s2, this.c1_s3]]
    } else {
      this.id = this.data.chains[1][0]
      this.c1_s1 = this.data.chains[1][1]
      this.c1_s2 = this.data.chains[1][2]
      this.c1_s3 = this.data.chains[1][3]

      // Copy array by reference (reference lost using JSON.parse in Vuex)
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
      id: this.id,
      dmgCast: this.dmgCast,
      dmgCd: this.dmgCd
    })
  }
}
</script>

<style scoped>
  .table > tr:first-child > td {
    border-top: none;
  }
  .chains-container {
    display: flex;
    flex-direction: column-reverse;
  }
  .chains-container input {
    width: 50px;
  }
  .chains-container .chains-sub {
    display: flex;
    justify-content: center;
    align-content: center;
    margin: 3px 0;
  }
  .chains-container .chains-sub button.dropdown-toggle::after {
    content: none;
  }
  .chains-container .chains-sub img{
    width: 45px;
  }
  .chains-container .chains-sub .btn {
    padding: 0 10px;
    height: 60px;
  }
  ul.dropdown-menu {
    min-width: 0;
  }
  ul.show {
    display: grid;
    grid-template-columns: repeat(4, 50px);
    grid-gap: 5px 1px;
    background: #cfcfcf;
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
  ul.dropdown-menu li {
    font-size: 40px;
  }
</style>