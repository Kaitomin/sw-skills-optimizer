<template>
  <!-- Skills -->
    <div class="skills-details">
      <h1>Skills</h1>
      <div v-if="char">
        <p class="description"><i>{{ description }} <br>(click on criteria to sort the table)</i></p>
        <div class="char-info">
          <div class="cdInput">
            <input type="range" name="charCD" id="charCD" min="0" max="55" step="1" @change="$emit('char-cdr', charCD)" v-model="charCD" /><br>
            <label id="cdInput" for="charCD">Character CDR : {{ charCD +'%' }}</label>
          </div>

          <div v-if="charName == 'Ephnel'" class="dw-container" @click="toggleEphnelDesire">
            <p>Desire Worker</p>
          </div>
          <div v-else class="dw-container" @click="toggleDesire">
            <p>Desire Worker</p>
          </div>

          <div class="cast-container" @click="toggleCastCancel">
            <p>Animation cancel</p>
          </div>
        </div>

        <!-- Ephnel Bullet & Release -->
        <div v-if="charName == 'Ephnel'" class="ephnel-buff">
          <div class="ephnel-bullet" @click="toggleBullet">
            <p>Bullet</p>
          </div>
          <div class="ephnel-release" @click="toggleRelease">
            <p>Bullet + Release</p>
          </div>
        </div>
        
        <table v-if="clientWidth > 550" class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips"
              @mouseout="hideTooltips"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Skill multiplier</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] {{ aspd }}%  aspd - 60fps</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation</span><br>[{{ +charCD + 15}}%]</th>
              <th class="separator-th"></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dps')">DPS<span class="tooltip-msg">Damage % per second</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR. <br> Theoretically, the higher the more you should spam the skill when off CD. <br> In practice, you should balance with DPS</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg-cd15')">DMG/CD<span class="tooltip-msg">Skill spam efficiency including character CDR & chain 15% CDR bonus. Theoretically, the higher the more you should spam the skill when off CD. In practice, you should balance with DPS</span><br>[{{ +charCD + 15 }}% ]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + ' icon'" width="48" height="48">
                <p>{{ skill.skillName }}</p>
              </td>

              <td v-if="charName == 'Ephnel'">{{ ephnelCalcDmg(skill) }}%</td>
              <td v-else>{{ skill.dmg }}%</td>

              <td :class="castChecked && (skill.castCancel < skill.cast) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ castChecked ? skill.castCancel : skill.cast }}]</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s</td>
              <td>{{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s</td>
              <td class="separator-td"></td>

              <td v-if="charName == 'Ephnel'" class="dps">
                {{
                  (castChecked && ephnelRelease) ? Math.round(skill.dmgRelease/(skill.castCancel / 60)) :
                  (castChecked && ephnelBullet ) ? Math.round(skill.dmgBullet/(skill.castCancel / 60)) :
                  (castChecked) ? Math.round(skill.dmg/(skill.castCancel / 60)) :
                  (ephnelRelease) ? Math.round(skill.dmgRelease/(skill.cast / 60)) :
                  (ephnelBullet) ? Math.round(skill.dmgBullet/(skill.cast / 60)) :
                  Math.round(skill.dmg/(skill.cast / 60))
                }}%
              </td>
              <td v-else class="dps">{{ castChecked ? Math.round(skill.dmg/(skill.castCancel / 60)) : Math.round(skill.dmg/(skill.cast / 60)) }}%</td>

              <td v-if="charName == 'Ephnel'">
                {{ 
                  ephnelRelease ? Math.round(skill.dmgRelease/calcCD(skill)) :
                  ephnelBullet ? Math.round(skill.dmgBullet/calcCD(skill)) : 
                  Math.round(skill.dmg/calcCD(skill))
                }}
              </td>
              <td v-else>{{ Math.round(skill.dmg/calcCD(skill)) }}</td>

              <td v-if="charName == 'Ephnel'">
                {{ 
                  ephnelRelease ? Math.round(skill.dmgRelease/calcCD15(skill)) :
                  ephnelBullet ? Math.round(skill.dmgBullet/calcCD15(skill)) : 
                  Math.round(skill.dmg/calcCD15(skill)) 
                }}
              </td>
              <td v-else>{{ Math.round(skill.dmg/calcCD15(skill)) }}</td>
            </tr>
          </tbody>
        </table>
        <table v-else class="table table-striped table-skills">
          <thead>
            <tr 
              @mouseover="displayTooltips" 
              @mouseout="hideTooltips"
            >
              <th scope="col">Skill</th>
              <th scope="col" class="tooltip-container" @click="sortBy('dmg')">DMG<span class="tooltip-msg">Skill multiplier (DPS)</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cast')">Cast<span class="tooltip-msg">Cast time in seconds [frames] (DPS) {{ aspd }}%  aspd - 60fps</span></th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR calculation (DMG/CD{{charCD}})</span><br>[{{ charCD }}%]</th>
              <th scope="col" class="tooltip-container" @click="sortBy('cd')">CD<span class="tooltip-msg">Skill CD after character CDR & chain 15% CDR bonus calculation (DMG/CD{{+charCD + 15}})</span><br>[{{ +charCD + 15}}%]</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in skillsTable" :key="skill._id">
              <td>
                <img :src="getImgUrl(skill.icon)" :alt="skill.skillName + 'icon'">
                <p>{{ skill.skillName }}</p>
              </td>

              <td v-if="charName == 'Ephnel'">{{ ephnelCalcDmg(skill) }}% 
                <br> 
                  ({{
                    (castChecked && ephnelRelease) ? Math.round(skill.dmgRelease/(skill.castCancel / 60)) :
                    (castChecked && ephnelBullet ) ? Math.round(skill.dmgBullet/(skill.castCancel / 60)) :
                    (castChecked) ? Math.round(skill.dmg/(skill.castCancel / 60)) :
                    (ephnelRelease) ? Math.round(skill.dmgRelease/(skill.cast / 60)) :
                    (ephnelBullet) ? Math.round(skill.dmgBullet/(skill.cast / 60)) :
                    Math.round(skill.dmg/(skill.cast / 60))
                  }}%)
              </td>
              <td v-else>{{ skill.dmg }}% <br> ({{ Math.round(skill.dmg/(skill.cast / 60).toFixed(2)) }}%)</td>

              <td :class="(castChecked && (skill.castCancel < skill.cast)) ? 'cancel-active' : ''">{{ castChecked ? (skill.castCancel / 60).toFixed(2) : (skill.cast / 60).toFixed(2)}}s <br> [{{ skill.cast }}]</td>

              <td v-if="charName == 'Ephnel'">
                {{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s
                <br>
                  {{ 
                    ephnelRelease ? Math.round(skill.dmgRelease/calcCD(skill)) :
                    ephnelBullet ? Math.round(skill.dmgBullet/calcCD(skill)) : 
                    Math.round(skill.dmg/calcCD(skill))
                  }}
              </td>
              <td v-else>{{ skill.cd == 0 ? '0.00' : calcCD(skill) }}s <br>({{ Math.round(skill.dmg/calcCD(skill)) }})</td>

               <td v-if="charName == 'Ephnel'">
                {{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s
                <br>
                  {{ 
                    ephnelRelease ? Math.round(skill.dmgRelease/calcCD15(skill)) :
                    ephnelBullet ? Math.round(skill.dmgBullet/calcCD15(skill)) : 
                    Math.round(skill.dmg/calcCD15(skill)) 
                  }}
              </td>
              <td v-else>{{ skill.cd == 0 ? '0.00' : calcCD15(skill) }}s <br>({{ Math.round(skill.dmg/calcCD15(skill)) }})</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
    </div>
</template>

<script>
import CharacterService from '../services/CharacterService';

export default {
  props: ['charName'],
  data() {
    return {
      char: '',
      charCD: '44',
      checked: false,
      castChecked: false,
      sortOrder: false,
      skillsTable: [],
      aspd: '',
      description: '',
      ephnelBullet: false,
      ephnelRelease: false
    }
  },
  methods: {
    getImgUrl(iconUrl) {
      try {
        return require('@/assets/uploads/skills/' + iconUrl)
      } catch (e) {
        return 
      }
    },
    toggleDesire() {
      this.checked = !this.checked;
      
      if (this.checked) {
        document.querySelector('.dw-container').classList.add('active')
        

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg * 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg * 1.2)
          }
        })
        this.$emit('skills-table', this.skillsTable)
      } else {
        document.querySelector('.dw-container').classList.remove('active')

        Array.from(this.skillsTable).map(skill => {
          if (skill.dwBoost) {
            skill.dmg = Math.round(skill.dmg / 1.58)
          } else {
            skill.dmg = Math.round(skill.dmg / 1.2)
          }
        })
        this.$emit('skills-table', this.skillsTable)
      }
    },
    toggleEphnelDesire() {
      this.checked = !this.checked;
      this.ephnelDW()
    },
    ephnelDW() {
      if (this.checked) {
        document.querySelector('.dw-container').classList.add('active')

        if (this.ephnelRelease) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgRelease = Math.round(skill.dmgRelease * 1.58)
            } else {
              skill.dmgRelease = Math.round(skill.dmgRelease * 1.2)
            }
          })
        } else if (this.ephnelBullet) {
           Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgBullet = Math.round(skill.dmgBullet * 1.58)
            } else {
              skill.dmgBullet = Math.round(skill.dmgBullet * 1.2)
            }
          })
        } else {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmg = Math.round(skill.dmg * 1.58)
            } else {
              skill.dmg = Math.round(skill.dmg * 1.2)
            }
          })
        }

        this.$emit('skills-table', this.skillsTable)
      } else {
        document.querySelector('.dw-container').classList.remove('active')

        if (this.ephnelRelease) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.58)
            } else {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.2)
            }
          })
        } else if (this.ephnelBullet) {
           Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.58)
            } else {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.2)
            }
          })
        } else {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmg = Math.round(skill.dmg / 1.58)
            } else {
              skill.dmg = Math.round(skill.dmg / 1.2)
            }
          })
        }
        this.$emit('skills-table', this.skillsTable)
      }
    },
    toggleCastCancel() {
      this.castChecked = !this.castChecked;

      if (this.castChecked) {
        document.querySelector('.cast-container').classList.add('active')

        this.$emit('cast-cancel', this.castChecked)
      } else {
        document.querySelector('.cast-container').classList.remove('active')
        this.$emit('cast-cancel', this.castChecked)
      }
    },
    // Ephnel Bullet & Release
    toggleBullet() {
      this.ephnelBullet = !this.ephnelBullet

      if (this.ephnelBullet) {
        document.querySelector('.ephnel-bullet').classList.add('active-dmg')
        
        // Disable Ephnel Release checkbox
        document.querySelector('.ephnel-release').classList.remove('active-dmg')

        if (this.checked && !this.ephnelRelease) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmg = Math.round(skill.dmg / 1.58)
            } else {
              skill.dmg = Math.round(skill.dmg / 1.2)
            }
          })
        }

        if (this.checked && this.ephnelRelease) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.58)
            } else {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.2)
            }
          })
        }

        this.ephnelRelease = false
        this.$emit('ephnel-dmg', 'bullet')

        if (this.checked) this.ephnelDW()

      } else {
        document.querySelector('.ephnel-bullet').classList.remove('active-dmg')

        if (this.checked) {
           Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.58)
            } else {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.2)
            }
          })
          this.ephnelDW()
        }

        this.$emit('ephnel-dmg', '')
      }
    },
    toggleRelease() {
      this.ephnelRelease = !this.ephnelRelease

      if (this.ephnelRelease) {
        document.querySelector('.ephnel-release').classList.add('active-dmg')

        // Disable Ephnel Bullet checkbox
        document.querySelector('.ephnel-bullet').classList.remove('active-dmg')
        
        if (this.checked && !this.ephnelBullet) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmg = Math.round(skill.dmg / 1.58)
            } else {
              skill.dmg = Math.round(skill.dmg / 1.2)
            }
          })
        }

        if (this.checked && this.ephnelBullet) {
          Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.58)
            } else {
              skill.dmgBullet = Math.round(skill.dmgBullet / 1.2)
            }
          })
        }

        this.ephnelBullet = false
        this.$emit('ephnel-dmg', 'release')

        if (this.checked) this.ephnelDW()

      } else {
        document.querySelector('.ephnel-release').classList.remove('active-dmg')

        if (this.checked) {
           Array.from(this.skillsTable).map(skill => {
            if (skill.dwBoost) {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.58)
            } else {
              skill.dmgRelease = Math.round(skill.dmgRelease / 1.2)
            }
          })
          this.ephnelDW()
        }
        this.$emit('ephnel-dmg', '')
      }
    },
    ephnelCalcDmg(skill) {
      if (this.ephnelRelease) {
        return skill.dmgRelease
      }
      if (this.ephnelBullet) {
        return skill.dmgBullet
      }
      return skill.dmg
    },
    calcCD(skill) {
      if (skill.cd == 0) return Infinity
      return (+skill.cd - (+skill.cd * this.charCD/100)).toFixed(2);
    },
    calcCD15(skill) {
      if (skill.cd == 0) return Infinity
      return (+skill.cd - ((+skill.cd * this.charCD/100) + (+skill.cd * 0.15))).toFixed(2);
    },
    sortBy(criteria) {
      this.sortOrder = !this.sortOrder;

      if (this.charName != 'Ephnel') {  
        switch(criteria) {
          case 'dps':
            if (this.castChecked) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.castCancel/60)) - Math.round(b.dmg/(b.castCancel/60)) : Math.round(b.dmg/(b.castCancel/60)) - Math.round(a.dmg/(a.castCancel/60)))
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.cast/60)) - Math.round(b.dmg/(b.cast/60)) : Math.round(b.dmg/(b.cast/60)) - Math.round(a.dmg/(a.cast/60)))
            }
            break;
          case 'dmg-cd':
            this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD(a)) - Math.round(b.dmg/this.calcCD(b)) : Math.round(b.dmg/this.calcCD(b)) - Math.round(a.dmg/this.calcCD(a)))
            break;
          case 'dmg-cd15':
            this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD15(a)) - Math.round(b.dmg/this.calcCD15(b)) : Math.round(b.dmg/this.calcCD15(b)) - Math.round(a.dmg/this.calcCD15(a)))
            break;
          case 'cast':
            if (this.castChecked) {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.castCancel - +b.castCancel : +b.castCancel - +a.castCancel)
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.cast - +b.cast : +b.cast - +a.cast)
            }
            break;
          default:
            this.skillsTable.sort((a, b) => this.sortOrder ? +a[criteria] - +b[criteria] : +b[criteria] - +a[criteria])
            break;
        }
      }

      if (this.charName == 'Ephnel') {
        switch(criteria) {
          case 'dmg': {
            if (this.ephnelRelease) {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.dmgRelease - +b.dmgRelease : +b.dmgRelease - +a.dmgRelease)
            } else if (this.ephnelBullet) {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.dmgBullet - +b.dmgBullet : +b.dmgBullet - +a.dmgBullet)
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.dmg - +b.dmg : +b.dmg - +a.dmg)
            }
            break;
          }
          case 'dps':
            if (this.castChecked && this.ephnelRelease) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgRelease/(a.castCancel/60)) - Math.round(b.dmgRelease/(b.castCancel/60)) : Math.round(b.dmgRelease/(b.castCancel/60)) - Math.round(a.dmgRelease/(a.castCancel/60)))
            } else if (this.castChecked && this.ephnelBullet) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgBullet/(a.castCancel/60)) - Math.round(b.dmgBullet/(b.castCancel/60)) : Math.round(b.dmgBullet/(b.castCancel/60)) - Math.round(a.dmgBullet/(a.castCancel/60)))
            } else if (this.castChecked) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.castCancel/60)) - Math.round(b.dmg/(b.castCancel/60)) : Math.round(b.dmg/(b.castCancel/60)) - Math.round(a.dmg/(a.castCancel/60)))
            } else if (this.ephnelRelease) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgRelease/(a.cast/60)) - Math.round(b.dmgRelease/(b.cast/60)) : Math.round(b.dmgRelease/(b.cast/60)) - Math.round(a.dmgRelease/(a.cast/60)))
            } else if (this.ephnelBullet) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgBullet/(a.cast/60)) - Math.round(b.dmgBullet/(b.cast/60)) : Math.round(b.dmgBullet/(b.cast/60)) - Math.round(a.dmgBullet/(a.cast/60)))
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/(a.cast/60)) - Math.round(b.dmg/(b.cast/60)) : Math.round(b.dmg/(b.cast/60)) - Math.round(a.dmg/(a.cast/60)))
            }
            break;
          case 'dmg-cd':
            if (this.ephnelRelease) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgRelease/this.calcCD(a)) - Math.round(b.dmgRelease/this.calcCD(b)) : Math.round(b.dmgRelease/this.calcCD(b)) - Math.round(a.dmgRelease/this.calcCD(a)))
            } else if (this.ephnelBullet) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgBullet/this.calcCD(a)) - Math.round(b.dmgBullet/this.calcCD(b)) : Math.round(b.dmgBullet/this.calcCD(b)) - Math.round(a.dmgBullet/this.calcCD(a)))
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD(a)) - Math.round(b.dmg/this.calcCD(b)) : Math.round(b.dmg/this.calcCD(b)) - Math.round(a.dmg/this.calcCD(a)))
            }
            break;
          case 'dmg-cd15':
            if (this.ephnelRelease) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgRelease/this.calcCD15(a)) - Math.round(b.dmgRelease/this.calcCD15(b)) : Math.round(b.dmgRelease/this.calcCD15(b)) - Math.round(a.dmgRelease/this.calcCD15(a)))
            } else if (this.ephnelBullet) {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmgBullet/this.calcCD15(a)) - Math.round(b.dmgBullet/this.calcCD15(b)) : Math.round(b.dmgBullet/this.calcCD15(b)) - Math.round(a.dmgBullet/this.calcCD15(a)))
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? Math.round(a.dmg/this.calcCD15(a)) - Math.round(b.dmg/this.calcCD15(b)) : Math.round(b.dmg/this.calcCD15(b)) - Math.round(a.dmg/this.calcCD15(a)))
            }
            break;
          case 'cast':
            if (this.castChecked) {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.castCancel - +b.castCancel : +b.castCancel - +a.castCancel)
            } else {
              this.skillsTable.sort((a, b) => this.sortOrder ? +a.cast - +b.cast : +b.cast - +a.cast)
            }
            break;
          default:
            this.skillsTable.sort((a, b) => this.sortOrder ? +a[criteria] - +b[criteria] : +b[criteria] - +a[criteria])
            break;
        }
      }
    },
    sortTab() {
      let tbody = document.querySelector('tbody');
      let tr = Array.from(document.querySelectorAll('tbody tr'));

      tr.forEach(tr => tr.remove())
      tr.sort((a, b) => {
        return a.querySelector('td.dps').textContent - b.querySelector('td.dps').textContent
      })
      tr.forEach(tr => tbody.append(tr))
    },
    displayTooltips(e) {
      if (e.target.classList.contains("tooltip-container")) {
        e.target.children[0].style.display = "block"
      }
    },
    hideTooltips(e) {
      if (e.target.classList.contains("tooltip-container")) {
        e.target.children[0].style.display = "none"
      }
    },
  },
  computed: {
    clientWidth() {
      return window.innerWidth
    }
  },
  created() {
    CharacterService.getCharacterInfo(this.charName)
    .then(res => {
      this.char = res.data.character;
      this.skillsTable = JSON.parse(JSON.stringify(res.data.skills));
      this.displayTooltips
      this.$emit('skills-table', this.skillsTable)
    })
    .catch(err => this.$router.push('/'));

    switch(this.charName) {
      case 'Lily': 
        this.description = "Data gathered from KR ver. S2 rebalance [23/03/2022]"
        this.aspd = 205
        break;
      case 'Iris':
        this.description = "Data gathered from EN ver. [03/04/2022]"
        this.aspd = 200
        break;
      case 'Stella':
        this.description = "Data gathered from EN ver. [05/04/2022]"
        this.aspd = 205
        break;
      case 'Haru':
        this.description = "Data gathered from EN ver. [06/04/2022]"
        this.aspd = 200
        break;
      case 'Ephnel':
        this.description = "Data gathered from EN ver. [12/04/2022]"
        this.aspd = 200
        break;
      default :
        this.aspd = 200
    }
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
  .description {
    color: white;
  }
  .checked {
    background-color: #0064e1 !important;
  }
  .active {
    background: #0064e178 !important;
    border: 1px solid white !important;
  }
  /* SKills details */
  .skills-details {
    min-width: 715px;
    margin: 0 1em;
    padding-top: 3em;
  }
  .char-info {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 1em;
    color: white;
  }
  .cancel-active {
    color: #00fdce;
  }
  .dw-container,
  .cast-container {
    padding: 0.5em 2em;
    border: 1px solid #ffffff;
    background: #ffffff08;
    box-sizing: border-box;
    transition: background 0.2s;
  }
  .dw-container p,
  .cast-container p {
    margin-bottom: 0;
  }
  .dw-container:hover,
  .cast-container:hover {
    cursor: pointer;
    background: #ffffff2b;
  }
  .checkmark {
    position: relative;
    height: 20px;
    width: 20px;
    background-color: #eee;
  }
  .disabled {
    opacity: 0;
  }
  .tooltip-container {
    position: relative;
  }
  .tooltip-container:hover {
    cursor: pointer;
  }
  .tooltip-msg {
    display: none;
    position: absolute;
    max-width: 200px;
    width: max-content;
    z-index: 999;
    top: 50px;
    right: 0;
    text-align: left;
    padding: 10px;
    border: 1px solid white;
    background: #000000a1;
  }
  thead {
    position: sticky;
    top: -1px;
  }
  th {
    border-bottom: 0;
    vertical-align: middle;
    width: 40px;
    border-top: 0;
    font-size: 0.9em;
  }
  td {
    padding: 0.7rem 0 0.3rem 0;
    color: white;
    /* border-top: 0; */
  }
  .table-skills { 
    border-spacing: 0px;
    border: 1px solid white;
    margin-top: 2em;
  }
  thead > tr > td:first-child,
  tbody > tr > td:first-child {
    padding-left: 0.5rem;
  }

  tbody {
    text-align: center;
    font-size: 15px;
  }
  th {
    color: white;
    padding: 5px 0;
  }
   td {
    vertical-align: middle;
  }
  th.separator-th {
    width: 1px !important;
    background: #ffffff7a;
  }
  .separator-td {
    width: 1px;
    background: #ffffff7a;
  }
  .table-skills p {
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    .skills-details {
      min-width: 100%;
    }
    .tooltip-msg {
      width: 150px;
    }
  }
  @media screen and (max-width: 500px) {
    .char-info {
      flex-direction: column;
      align-items: center;
      height: 200px;
    }
    .description {
      margin-bottom: 0;
    }
    .dw-container,
    .cast-container {
      width: 240px;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
    }
    .checkmark {
      margin-right: 10px;
    }
  }
</style>