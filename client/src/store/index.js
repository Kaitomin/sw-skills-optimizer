import { createStore } from 'vuex'

const store = createStore({
  state: {
    chainsArray: JSON.parse(localStorage.getItem('chains')) ?? [],
    lilyChains: JSON.parse(localStorage.getItem('lily-chains')) ?? [],
    irisChains: JSON.parse(localStorage.getItem('iris-chains')) ?? [],
    rotations: new Map(JSON.parse(localStorage.getItem('rotations'))),
    lilyRotations: new Map(JSON.parse(localStorage.getItem('lily-rotations'))),
    irisRotations: new Map(JSON.parse(localStorage.getItem('iris-rotations')))
  },
  mutations: {
    // currentUser(state, user) {
      // console.log('payload user :', user)
      // state.user = user
      // console.log('state.user :', state.user)
      // console.log('cookies :', Cookies.get())
    // },
    // addChain(state, chain) {
      // console.log('state :', state.chainsArray)
      // console.log('received chain :', ...chain)

      // if (state.chainsArray.length == 0) state.chainsArray.push([...chain])
      // let found = false
      // state.chainsArray.forEach((element, index) => {
      //   if (element[0] == chain[0] && element[1][0] == chain[1][0]) {
      //     console.log('exists')
      //     state.chainsArray.splice(index, 1, [...chain])
      //     // found = true
      //     return
      //   } else {
      //     state.chainsArray.push([...chain])
      //   }
      // });
      // if (!found) {
      //   state.chainsArray.push(chain);
      // }
      // localStorage.setItem('chains', JSON.stringify(state.chainsArray));
    // },
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
    },
    // deleteTemplate(state, id) {
      // state.chainsArray = state.chainsArray.filter(c => !id.includes(c.chains[0]))
      // localStorage.setItem('chains', JSON.stringify(state.chainsArray)) 
    // },
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
    lilyRotations (state) {
      return state.lilyRotations;
    },
    irisRotations (state) {
      return state.irisRotations;
    }
  }
})

export default store