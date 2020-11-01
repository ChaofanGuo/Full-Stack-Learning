import Vue from 'vue'
import Store from './super-store'

Vue.use(Store)

export default new Store.SuperStore({
  state: {
    counter: 0
  },
  getters: {
    doubleCounter(state) {
      return state.counter * 2
    }
  },
  mutations: {
    add(state) {
      state.counter ++
    }
  },
  actions: {
    add({commit}) {
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  modules: {
  }
})
