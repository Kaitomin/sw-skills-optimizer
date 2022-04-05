import { createStore } from 'vuex'

const store = createStore({
  state: {
    chainsArray: JSON.parse(localStorage.getItem('chains')) ?? [],
    lilyChains: JSON.parse(localStorage.getItem('lily-chains')) ?? [],
    irisChains: JSON.parse(localStorage.getItem('iris-chains')) ?? [],
    stellaChains: JSON.parse(localStorage.getItem('stella-chains')) ?? [],
    rotations: new Map(JSON.parse(localStorage.getItem('rotations'))),
    lilyRotations: new Map(JSON.parse(localStorage.getItem('lily-rotations'))),
    irisRotations: new Map(JSON.parse(localStorage.getItem('iris-rotations'))),
    stellaRotations: new Map(JSON.parse(localStorage.getItem('stella-rotations')))
  },
  mutations: {
    saveChains(state, template) {
      if (template.name == 'Lily') {
        if (template.ids.length > 0) {
          state.lilyChains = state.lilyChains.filter(c => !template.ids.includes(c.chains[0]))
          localStorage.setItem('lily-chains', JSON.stringify(state.lilyChains))
        } else {
          state.lilyChains = template.chains
          localStorage.setItem('lily-chains', JSON.stringify(state.lilyChains))
        }
      }
      if (template.name == 'Iris') {
        if (template.ids.length > 0) {
          state.irisChains = state.irisChains.filter(c => !template.ids.includes(c.chains[0]))
          localStorage.setItem('iris-chains', JSON.stringify(state.irisChains))
        } else {
          state.irisChains = template.chains
          localStorage.setItem('iris-chains', JSON.stringify(state.irisChains))
        }
      }
      if (template.name == 'Stella') {
        if (template.ids.length > 0) {
          state.stellaChains = state.stellaChains.filter(c => !template.ids.includes(c.chains[0]))
          localStorage.setItem('stella-chains', JSON.stringify(state.stellaChains))
        } else {
          state.stellaChains = template.chains
          localStorage.setItem('stella-chains', JSON.stringify(state.stellaChains))
        }
      }
    },
    saveRotations(state, template) {
      if (template.name == 'Lily') {
        state.lilyRotations = template.rotations
        localStorage.setItem('lily-rotations', state.lilyRotations);
        return
      }
      if (template.name == 'Iris') {
        state.irisRotations = template.rotations
        localStorage.setItem('iris-rotations', state.irisRotations);
        return
      }
      if (template.name == 'Stella') {
        state.stellaRotations = template.rotations
        localStorage.setItem('stella-rotations', state.stellaRotations);
        return
      }
    },
  },
  getters: {
    chainsArray (state) {
      return state.chainsArray;
    },
    rotations (state) {
      return state.rotations;
    },
    lilyChains (state) {
      return state.lilyChains;
    },
    irisChains (state) {
      return state.irisChains;
    },
    stellaChains (state) {
      return state.stellaChains;
    },
    lilyRotations (state) {
      return state.lilyRotations;
    },
    irisRotations (state) {
      return state.irisRotations;
    },
    stellaRotations (state) {
      return state.stellaRotations;
    }
  }
})

export default store