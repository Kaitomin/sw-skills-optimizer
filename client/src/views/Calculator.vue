<template>
  <keep-alive>
    <div class="calculator-container" :style="containerHeight">
      <div class="calculator">
        <div class="data">
          <div class="stats-container">
            <Stats 
              :target=selectedTarget
              :id="0"
              :save=save
              @total-dmg="displayGraph"
              @saveSetup=setSave
              
            />
            <Stats 
              :target=selectedTarget
              :id="1"
              :save=save
              @total-dmg="displayGraph"
              @saveSetup=setSave
            />
            <button class="btn-save" @click="saveSetups">Save setups</button>
          </div>

          <div class="target-container" @click="assignTarget">
            <div data-target="aculus_edgar">Aculus/Edgar N</div>
            <div data-target="junk_queen">Junk Queen N</div>
            <div data-target="junk_queen_h">Junk Queen H</div>
            <div data-target="flemma_p1" class="selected-target">Flemma P1</div>
            <div data-target="flemma_p2">Flemma P2</div>
            <div data-target="flemma_p3">Flemma P3</div>
            <div data-target="tenebrisN_p1">Tenebris N P1</div>
            <div data-target="tenebrisN_p2">Tenebris N P2</div>
            <div data-target="tenebrisH">Tenebris H</div>
            <div data-target="raphakumba">Raphakumba</div>
            <div data-target="flemma_solo">Flemma Solo</div>
          </div>
        </div>

        <div class="chart">
          <Bar
            :chart-options="chartOptions"
            :chart-data="chartData"
            :chart-id="chartId"
            :dataset-id-key="datasetIdKey"
            :plugins="plugins"
            :css-classes="cssClasses"
            :styles="styles"
            :width="width"
            :height="height"
            style="background-color: #00000047; border: 1px solid white"
          />

          <div class="info">
            <div>
              {{ this.chartData.datasets[0].data[0] ? this.chartData.datasets[0].data[0].toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0 }} │
              {{ this.chartData.datasets[0].data[1] ? this.chartData.datasets[0].data[1].toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0 }}
            </div>
            <p>Raw difference = <span :class="setupDiff >= 0 ? 'positive' : 'negative'">{{ setupDiff.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></p>
            <p>Ratio = <span :class="setupRatio >= 1 ? 'positive' : 'negative'">{{ setupRatio }}</span></p>
          </div>
        </div>

        <div class="notes">
          <div>
            <p>⬥ ATK = max attack (DW context)</p>
            <p>⬥ Skill % can be found on character's skills page (don't forget to activate DW and/or specific dmg modifier e.g Chii's mark, Ephnel's bullet)</p>
            <p>⬥ Difference & ratio are calculated with Setup 1 as reference ("Setup 1 does more/less dmg than Setup 2")</p>
            <p>⬥ Damage formula taken from : <a href="https://github.com/Mush-0/sw-dmg-chart/blob/main/dmgCalc.js" target="_blank">https://github.com/Mush-0/sw-dmg-chart/blob/main/dmgCalc.js</a></p>
            <p>⬥ Boss infos table (credits to Eden)</p>
          </div>  
          <table class="table boss-table" border="1">
            <thead>
              <tr>
                <th>Enemy</th>
                <th>Level</th>
                <th>Defense</th>
                <th colspan="">Reduction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Raphakumba</td>
                <td>68</td>
                <td>2060</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Aculus/Edgar N (LF)</td>
                <td>72</td>
                <td>1074</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Junk Queen N</td>
                <td>72</td>
                <td>2423</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Junk Queen H</td>
                <td>77</td>
                <td>4505</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Flemma P1</td>
                <td>76</td>
                <td>2676</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>Flemma P2</td>
                <td>77</td>
                <td>3306</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>Flemma P3</td>
                <td>77</td>
                <td>4505</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Flemma Solo</td>
                <td>68</td>
                <td>2440</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Tenebris N P1</td>
                <td>80</td>
                <td>2800</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Tenebris N P2</td>
                <td>81</td>
                <td>3430</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Tenebris H</td>
                <td>81</td>
                <td>4630</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      
      </div>
    </div>
  </keep-alive>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

import TargetService from '../services/TargetService';
import Stats from '../components/Stats';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar, Stats },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{
          barThickness: 50,
          maxBarThickness: 75,
          data: [],
          backgroundColor: [],
          borderColor: [
            'rgb(250, 250, 250)'
          ],
        }],
        hoverOffset: 10
      },
      chartOptions: {
        responsive: true,
        layout: {
          padding: 20
        },
        elements: {
          bar: {
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            }
          },
          y: {
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            borderColor: 'white',
            borderWidth: 1,
          },
        }
      },
      setups: [],
      containerH: '',
      target: 'flemma_p1',
      selectedTarget: '',
      save: false
    }
  },
  methods: {
    assignTarget(e) {
      if (!e.target.dataset.target) return 

      const div = document.querySelectorAll('.target-container > div')

      div.forEach(d => {
        d.dataset.target == e.target.dataset.target ? d.classList.add('selected-target') : d.classList.remove('selected-target')
      })

      this.target = e.target.dataset.target;
      this.getTarget(this.target)
    },
    async getTarget(t) {
      const res = await TargetService.getTargetInfo(t)
      this.selectedTarget = res.data.target
    },
    displayGraph(event) {
      const index = event.id

      this.chartData.labels[index] = "Setup " + ++event.id
      this.chartData.datasets[0].data[index] = event.dmg
      this.chartData.datasets[0].backgroundColor[index] = event.color
    },
    saveSetups() {
      this.save = true
      this.$router.go()
    },
    setSave() {
      this.save = false
    }
  },
  computed: {
    setupDiff() {
      return (this.chartData.datasets[0].data[0] - this.chartData.datasets[0].data[1])
    },
    setupRatio() {
      const ratio = ((this.chartData.datasets[0].data[0] / this.chartData.datasets[0].data[1]))
      if (ratio <= 0 || !isFinite(ratio)) return 0
      return ratio.toFixed(6)
    },
    containerHeight () {
      return {
        '--container-height': this.containerH
      }
    },
  },
  created() {
    this.getTarget(this.target)
  },
  mounted() {
    setTimeout(() => {
      this.containerH = document.querySelector('.calculator-container').offsetHeight + 'px'
    }, 500)
  }
}
</script>

<style scoped>
  h1 {
    color: white;
  }
  label {
    color: white;
    width: 125px;
  }
  optgroup {
    background: black;
  }
  .calculator-container:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: var(--container-height);
    z-index: -999;
    opacity: 0.6;
    background: url('../assets/img/bg_3840.webp');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
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
  .calculator {
    display: grid;
    justify-content: space-between;
    padding: 3em 0.5em;
    margin:0 auto;
    max-width: 1200px;
    grid-template-areas: 'data chart'
                          'notes notes';
  }
  .data {
    grid-area: data;
  }
  .chart {
    grid-area: chart;
    margin: 0 auto;
  }
  .stats-container {
    display: grid;
    padding: 0 0 1em 0;
    grid-template-areas: "setup1 setup2"
                          "save save";
  }
  .stats-container > div:first-child {
    grid-area: setup1;
    border-right: 0;
  }
  .stats-container > div:nth-child(2) {
    grid-area: setup2
  }
  .stats-container > button.btn-save {
    grid-area: save;
    color: white;
    padding: 5px 0;
    background: #00000047;
    border-left: 1px solid white;
    border-top: 0;
    border-right: 1px solid white;
    border-bottom: 1px solid white;
  }
  .stats-container > button.btn-save:hover {
    background: #00000000;
    /* -webkit-transition: background 0.1s linear;
    -ms-transition: background 0.1s linear;
    transition: background 0.1s linear; */

  }
  .target-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    color: white;
    margin: 0 auto;
  }
  .target-container > div {
    border: 1px solid white;
    padding: 5px 10px;
    cursor: default;
    background: #00000047;
  }
  .target-container > div:hover {
    cursor: pointer;
    background: #00000000;
  }
  .target-container label {
    font-size: 16px;
    color: #fff;	
    transition: all 0.5s ease-in-out;
  }
  .target-container select { 
    border: 0;
    border-bottom: 1px solid #555;  
    background: transparent;
    padding: 8px 0 5px 0;
    font-size: 16px;
    color: #fff;
  }
  .target-container select:focus { 
    border: none;	
    outline: none;
    border-bottom: 1px solid #3ce7d7;	
  }
  .chart {
    width: 500px;
    height: auto;
  }
  .info {
    color: white;
    font-size: 0.9rem;
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    border-right: 1px solid white;
    background: #00000047;
  }
  .info p {
    margin-bottom: 0;
  }
  .notes {
    grid-area: notes;
    color: white;
    border-top: 1px dashed white;
    margin-top: 3em;
    padding-top: 1em;
    text-align: left;
  }
  .notes > div {
    padding: 10px;
    background: #00000047;
    margin-bottom: 1em;
  }
  .notes p {
    margin-bottom: 0;
  }
  .notes a {
    color: #0de7fd;
    text-decoration: none;
  }
  .selected-target {
    background: #00ffff38 !important;
  }
  .positive {
    color: #00ff14;
  }
  .negative {
    color: #fff700;
  }
  .boss-table {
    margin: 0;
    width: 500px;
    text-align: center;
    color: white;
    background: #00000073;
  }
  .boss-table thead {
    background: #0000006b;
  }

  @media screen and (max-width: 1080px) {
    .calculator {
      justify-content: center;
      grid-template-areas: 'data'
                            'chart'
                            'notes';
    }
    .data {
      display: flex;
      flex-direction: column;
    }
    .target-container {
      margin-bottom: 1em;
    }
  }

  @media screen and (max-width: 566px) {
    .stats-container {
      flex-direction: column;
    }
    .stats {
      /* width: 100%; */
      /* margin: 0 auto; */
    }
    .notes {
      text-align: center;
    }
  }
</style>