<template>
  <keep-alive>
    <div class="calculator-container">
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

          <div class="target-container">
            <div 
              v-for="target in targets" 
              :class="{'selected-target': target.slug == selectedTarget.slug}"
              @click="getTarget(target.slug)"
            >
              {{ target.name }}
            </div>
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
            style="background-color: #2d343f; border: 1px solid white"
          />

          <div class="info">
            <div v-if="chartData.value">
              {{ chartData.value.datasets[0].data[0] ? chartData.value.datasets[0].data[0].toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0 }} │
              {{ chartData.value.datasets[0].data[1] ? chartData.value.datasets[0].data[1].toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0 }}
            </div>
            <p>Raw difference = <span :class="setupDiff >= 0 ? 'positive' : 'negative'">{{ setupDiff.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></p>
            <p>Ratio = <span :class="setupRatio >= 1 ? 'positive' : 'negative'">{{ setupRatio }}</span></p>
          </div>
        </div>

        <div class="notes">
          <div>
            <p>⬥ ATK = character max attack value</p>
            <p>⬥ Skill % can be found on character's skills page (don't forget to activate DW and/or specific dmg modifier e.g Chii's mark, Ephnel's bullet)</p>
            <p>⬥ Difference & ratio are calculated with Setup 1 as reference ("Setup 1 does more/less dmg than Setup 2")</p>
            <p>⬥ Damage formula taken from : <a href="https://github.com/Mush-0/sw-dmg-chart/blob/main/dmgCalc.js" target="_blank">https://github.com/Mush-0/sw-dmg-chart/blob/main/dmgCalc.js</a></p>
            <p>⬥ Boss infos table (credits to FeAr & AFN)</p>
          </div>  
          <table class="table boss-table" border="1">
            <thead>
              <tr>
                <th style="width: 30%">Enemy</th>
                <th style="width: 15%">Level</th>
                <th style="width: 15%">Defense</th>
                <th style="width: 15%">Evasion</th>
                <th style="width: 15%">Reduction</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="target in targets">
                <td>{{ target.name }}</td>
                <td>{{ target.level }}</td>
                <td>{{ target.defense }}</td>
                <td>{{ target.evasion }}</td>
                <td>{{ target.dmgReduction }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </keep-alive>
</template>

<script setup>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  import TargetService from '../services/TargetService';
  import Stats from '../components/Stats.vue';
  import { computed, ref } from 'vue';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  const props = defineProps({
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
  })

  const chartData = ref({
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
  })

  const chartOptions = {
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
      }
    }
  }

  const bg = ref('#2d343f');

  let target = 'flemma_p1'
  let selectedTarget = ref('')
  let targets = ref([])
  let save = false
  
  // const assignTarget = (e) => {
  //   if (!e.target.dataset.target) return 

  //   const div = document.querySelectorAll('.target-container > div')

  //   div.forEach(d => {
  //     d.dataset.target == e.target.dataset.target ? 
  //       d.classList.add('selected-target') : 
  //       d.classList.remove('selected-target')
  //   })

  //   target = e.target.dataset.target;
  //   getTarget(target)
  // }

  const getTarget = async(t) => {
    const res = await TargetService.getTargetInfo(t)
    selectedTarget.value = res.data.target
  }
  
  const getTargets = async() => {
    const res = await TargetService.getTargets()
    targets.value = res.data.target
  }

  const displayGraph = (event) => {
    const index = event.id

    chartData.value.labels[index] = "Setup " + ++event.id
    chartData.value.datasets[0].data[index] = event.dmg
    chartData.value.datasets[0].backgroundColor[index] = event.color
  }

  const saveSetups = () => {
    save = true
    $router.go()
  }

  const setSave = () => save = false

  const setupDiff = computed(() => chartData.value.datasets[0].data[0] - chartData.value.datasets[0].data[1])
  const setupRatio = computed(() => {
    const ratio = chartData.value.datasets[0].data[0] / chartData.value.datasets[0].data[1]

    if (ratio <= 0 || !isFinite(ratio)) return 0
    return ratio.toFixed(6)
  })

  getTarget(target)
  getTargets()
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
    background: #2d343f;
  }
  @-webkit-keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.4; }  
  }
  @keyframes fadeIn { 
    0% { opacity: 0; }
    100% { opacity: 0.4; } 
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
  button.btn-save {
    grid-area: save;
    color: white;
    padding: 5px 0;
    background-color: v-bind(bg);
    height: 50px;
    font-weight: 900;
    border-left: 1px solid white;
    border-top: 0;
    border-right: 1px solid white;
    border-bottom: 1px solid white;
  }
  button.btn-save:hover {
    background: #2d343fce;
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
    background: v-bind(bg);
  }
  .target-container > div:hover {
    cursor: pointer;
    background: #2d343fce;
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
    background: v-bind(bg);
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
    background: v-bind(bg);
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
    background: #00b5b1 !important;
  }
  .positive {
    color: #00ff14;
  }
  .negative {
    color: #fff700;
  }
  .boss-table {
    margin: 0;
    max-width: 650px;
    text-align: center;
    color: white;
    background: v-bind(bg);
  }
  .boss-table thead {
    background: #0000006b;
  }

  /* ---------- */
  /* Responsive */
  /* ---------- */
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
    .boss-table {
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 566px) {
    .stats-container {
      grid-template-areas: "setup1" 
                           "setup2"
                           "save";
      gap: 10px 0;
    }
    .stats-container > div[data-v-19334bbc]:first-child {
      border-right: 1px solid white;
    }
    button.btn-save {
      border-top: 1px solid white;
    }
    .notes {
      text-align: center;
    }
  }
</style>