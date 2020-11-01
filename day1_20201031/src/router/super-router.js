
let _Vue

export default class SuperRouter{
  constructor(options) {
    this.$options = options

    const initial = window.location.hash.slice(1)
    _Vue.util.defineReactive(this, 'current', initial)

    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange() {
    this.current = window.location.hash.slice(1)
  }
}

SuperRouter.install = function(Vue) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true,
        default: '/'
      }
    },
    render: function(h) {
      console.log(this)
      return h('a', {
        attrs: {
          href: `#${this.to}`
        }
      },
        this.$slots.default)
    }
  })
  Vue.component('router-view', {
    render: function(h) {
      let component = null
      const route = this.$router.$options.routes.find(route => route.path === this.$router.current)
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })
}