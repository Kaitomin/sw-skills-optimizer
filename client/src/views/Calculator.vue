<template>
  <div class="calculator">
    <div class="data">
      <div class="stats-container">
        <Stats 
          :target=selectedTarget
          :id="0"
          @total-dmg="displayGraph"
        />
        <Stats 
          :target=selectedTarget
          :id="1"
          @total-dmg="displayGraph"
        />
      </div>

      <div class="info">
        <p v-show="this.chartData.datasets[0].data[0] > this.chartData.datasets[0].data[1] ">Setup 1 / Setup 2 = <span style="color: green">{{ (this.chartData.datasets[0].data[0] / this.chartData.datasets[0].data[1]).toFixed(4) }}%</span></p>
        <p v-show="this.chartData.datasets[0].data[0] < this.chartData.datasets[0].data[1] ">Setup 1 / Setup 2 = <span style="color: red">{{ (this.chartData.datasets[0].data[0] / this.chartData.datasets[0].data[1]).toFixed(4) }}%</span></p>
      </div>

      <div class="target-container">
        <label for="target">Target</label>
        <select name="target" id="target" v-model="target" @change="getTarget()">
          <optgroup label="HH">
            <option value="raphakumba">Raphakumba</option>
          </optgroup>
          <optgroup label="VS">
            <option value="flemma_p1">Flemma P1</option>
            <option value="flemma_p2">Flemma P2</option>
            <option value="flemma_p3">Flemma P3</option>
          </optgroup>
          <optgroup label="BSN">
            <option value="tenebrisN_p1">Tenebris P1</option>
            <option value="tenebrisN_p2">Tenebris P2</option>
          </optgroup>
          <optgroup label="BSH">
            <option value="tenebrisH">Tenebris</option>
          </optgroup>
        </select>
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
        style="background-color: #ffffff12; border: 1px solid white"
      />
    </div>
 
  </div>
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
          backgroundColor: [
            'rgba(38, 67, 201, 0.45)',
            'rgba(38, 172, 201, 0.45)'
          ],
          borderColor: [
            'rgb(250, 250, 250)'
          ],
          
          // borderWidth: 1

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
      target: 'flemma_p1',
      selectedTarget: '',
      chartArr: []
    }
  },
  methods: {
    async getTarget() {
      const res = await TargetService.getTargetInfo(this.target)
      this.selectedTarget = res.data.target
    },
    displayGraph(event) {
      const index = event.id

      this.chartData.labels[index] = "Setup " + ++event.id;
      this.chartData.datasets[0].data[index] = event.dmg;
    },
  },
  computed: {
    
  },
  created() {
    this.getTarget()
  },
}
</script>

<style scoped>
  h1 {
    color: white;
  }
  .calculator {
    display: flex;
    justify-content: space-evenly;
  }
  .stats-container {
    display: flex;
    justify-content: center;
    padding: 1em 0;
  }
  .target-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 250px;
    margin: 0 auto;
  }
  .chart {
    width: 500px;
    height: 500px;
  }
  label {
    color: white;
    width: 125px;
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
  optgroup {
    background: black;
  }
  .info p {
    color: white;
    border: 1px solid white;
  }

  
</style>