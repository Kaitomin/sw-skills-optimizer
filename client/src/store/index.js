import { createStore } from 'vuex'
// import Cookies from 'js-cookie'

const store = createStore({
  state: {
    // user: '',
    chainsArray: JSON.parse(localStorage.getItem('chains')) ?? [],
    allTemplates: new Map(JSON.parse(localStorage.getItem('template')))
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
    saveTemplate(state, template) {
      if (template.ids.length > 0) {
        state.chainsArray = state.chainsArray.filter(c => !template.ids.includes(c.chains[0]))
        localStorage.setItem('chains', JSON.stringify(state.chainsArray))
      } else {
        state.chainsArray = template.chains
        localStorage.setItem('chains', JSON.stringify(state.chainsArray))
      }
    },
    deleteTemplate(state, id) {
      state.chainsArray = state.chainsArray.filter(c => !id.includes(c.chains[0]))
      localStorage.setItem('chains', JSON.stringify(state.chainsArray)) 
    },
    saveAllRotations(state, template) {
      state.allTemplates = template
      localStorage.setItem('template', state.allTemplates);
    },
  }
})

export default store