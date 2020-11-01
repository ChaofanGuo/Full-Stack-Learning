let _Vue

// const encryptCode = '天王盖地虎'

class SuperStore {
  constructor(options) {
    this._vm = new _Vue({
      data: options.state,
      // data: {
      //   $state: options.state
      // },
      computed: options.getters
    })
    // Use Object.defineProperty
    this._getters = getterDefineProperty(options.getters, this.state)

    // Use Proxy
    this._proxyGetters = getterProxy(options.getters, this.state)

    // Use Vue computed
    this._computedGetters = {}
    for(let key in options.getters) {
      Object.defineProperty(this._computedGetters, key, {
        get: () => {
          return this._vm[key]
        }
      })
    }
    /*
    Object.defineProperty(this, '_getters', {
      get(key) {
        debugger
        return options.getters[key](this.state)
      }
    })
    */
    this._mutations = options.mutations
    this._actions = options.actions

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    // return this._vm.$data.$state
    return this._vm.$data
  }

  set state(value) {
    console.error('Please use replaceState to reset state')
  }

  get getters() {
    return this._getters
  }

  get proxyGetters() {
    return this._proxyGetters
  }

  get computedGetters() {
    return this._computedGetters
  }

  commit(type, payload) {
    const mutation = this._mutations[type]
    if (!mutation) {
      console.log('unknown mutation!')
      return
    }
    mutation(this.state, payload)
  }

  dispatch(type, payload) {
    const action = this._actions[type]
    if (!action) {
      console.error('unknown action!')
      return
    }
    action(this, payload)
  }
}

function getterDefineProperty(getters, state) {
  let delegate = {}
  for(let key in getters) {
    Object.defineProperty(delegate, key, {
      configurable: false,
      get() {
        return getters[key](state)
      }
    })
  }
  return delegate
}

function getterProxy(getters, state) {
  return new Proxy(getters, {
    get(target, property) {
      let fun = target[property]
      if (fun && typeof fun === 'function') {
        return fun(state)
      } else {
        return undefined
      }
    }
  })
}

function install(Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default {SuperStore, install}
