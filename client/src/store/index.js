import { createStore } from 'vuex'

const store = createStore({
  state: {
    // Chains
    lilyChains: JSON.parse(localStorage.getItem('lily-chains')) ?? [],
    irisChains: JSON.parse(localStorage.getItem('iris-chains')) ?? [],
    stellaChains: JSON.parse(localStorage.getItem('stella-chains')) ?? [],
    haruChains: JSON.parse(localStorage.getItem('haru-chains')) ?? [],
    ephnelChains: JSON.parse(localStorage.getItem('ephnel-chains')) ?? [],
    chiiChains: JSON.parse(localStorage.getItem('chii-chains')) ?? [],
    nabiChains: JSON.parse(localStorage.getItem('nabi-chains')) ?? [],
    // Rotations
    lilyRotations: new Map(JSON.parse(localStorage.getItem('lily-rotations'))),
    irisRotations: new Map(JSON.parse(localStorage.getItem('iris-rotations'))),
    stellaRotations: new Map(JSON.parse(localStorage.getItem('stella-rotations'))),
    haruRotations: new Map(JSON.parse(localStorage.getItem('haru-rotations'))),
    ephnelRotations: new Map(JSON.parse(localStorage.getItem('ephnel-rotations'))),
    chiiRotations: new Map(JSON.parse(localStorage.getItem('chii-rotations'))),
    nabiRotations: new Map(JSON.parse(localStorage.getItem('nabi-rotations'))),
    // Calculator setups
    calculatorSetups: JSON.parse(localStorage.getItem('calculator-setups')) ?? []
  },
  mutations: {
    // Character chains
    saveChains(state, template) {
      const charChains = `${template.name.toLowerCase()}Chains`
      const storageStr  = `${template.name.toLowerCase()}-chains`

      // Replace existing rotation else add new one
      if (template.ids.length > 0) {
        state[charChains] = state[charChains].filter(c => !template.ids.includes(c.chains[0]))
        localStorage.setItem(storageStr, JSON.stringify(state[charChains]))
      } else {
        state[charChains] = template.chains
        localStorage.setItem(storageStr, JSON.stringify(state[charChains]))
      }
    },
    // Character rotations
    saveRotations(state, template) {
      const charRotations = `${template.name.toLowerCase()}Rotations`
      const storageStr = `${template.name.toLowerCase()}-rotations`

      state[charRotations] = template.rotations
      localStorage.setItem(storageStr, state[charRotations]);
    },
    // Calculator setups
    saveSetup(state, setup) {
      const index = setup.id

      if (state.calculatorSetups.length < 2) {
        state.calculatorSetups.push(setup)
        localStorage.setItem('calculator-setups', JSON.stringify(state.calculatorSetups))
      } else {
        state.calculatorSetups[index] = setup
        localStorage.setItem('calculator-setups', JSON.stringify(state.calculatorSetups))
      }
    }
  },
  getters: {
    // Character chains
    getChains: (state) => (charChains) => {
      return state[charChains]
    },
    // Character rotations
    getRotations: (state) => (charRotations) => {
      return state[charRotations]
    },
    // Calculator setups
    getSetup: (state) => (setupId) => {
      return state.calculatorSetups[setupId]
    }
  }
})

export default store