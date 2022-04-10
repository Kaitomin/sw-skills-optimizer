import { createStore } from 'vuex'

const store = createStore({
  state: {
    chainsArray: JSON.parse(localStorage.getItem('chains')) ?? [],
    lilyChains: JSON.parse(localStorage.getItem('lily-chains')) ?? [],
    irisChains: JSON.parse(localStorage.getItem('iris-chains')) ?? [],
    stellaChains: JSON.parse(localStorage.getItem('stella-chains')) ?? [],
    haruChains: JSON.parse(localStorage.getItem('haru-chains')) ?? [],
    ephnelChains: JSON.parse(localStorage.getItem('ephnel-chains')) ?? [],
    rotations: new Map(JSON.parse(localStorage.getItem('rotations'))),
    lilyRotations: new Map(JSON.parse(localStorage.getItem('lily-rotations'))),
    irisRotations: new Map(JSON.parse(localStorage.getItem('iris-rotations'))),
    stellaRotations: new Map(JSON.parse(localStorage.getItem('stella-rotations'))),
    haruRotations: new Map(JSON.parse(localStorage.getItem('haru-rotations'))),
    ephnelRotations: new Map(JSON.parse(localStorage.getItem('ephnel-rotations')))
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
      if (template.name == 'Haru') {
        if (template.ids.length > 0) {
          state.haruChains = state.haruChains.filter(c => !template.ids.includes(c.chains[0]))
          localStorage.setItem('haru-chains', JSON.stringify(state.haruChains))
        } else {
          state.haruChains = template.chains
          localStorage.setItem('haru-chains', JSON.stringify(state.haruChains))
        }
      }
      if (template.name == 'Ephnel') {
        if (template.ids.length > 0) {
          state.ephnelChains = state.ephnelChains.filter(c => !template.ids.includes(c.chains[0]))
          localStorage.setItem('ephnel-chains', JSON.stringify(state.ephnelChains))
        } else {
          state.ephnelChains = template.chains
          localStorage.setItem('ephnel-chains', JSON.stringify(state.ephnelChains))
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
      if (template.name == 'Haru') {
        state.haruRotations = template.rotations
        localStorage.setItem('haru-rotations', state.haruRotations);
        return
      }
      if (template.name == 'Ephnel') {
        state.ephnelRotations = template.rotations
        localStorage.setItem('ephnel-rotations', state.ephnelRotations);
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
    haruChains (state) {
      return state.haruChains;
    },
    ephnelChains (state) {
      return state.ephnelChains;
    },
    lilyRotations (state) {
      return state.lilyRotations;
    },
    irisRotations (state) {
      return state.irisRotations;
    },
    stellaRotations (state) {
      return state.stellaRotations;
    },
    haruRotations (state) {
      return state.haruRotations;
    },
    ephnelRotations (state) {
      return state.ephnelRotations;
    }
  }
})

export default store