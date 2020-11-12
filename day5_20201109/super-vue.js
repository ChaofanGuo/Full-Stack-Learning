function defineReactive(obj, key, val) {
  observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}`)
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set(value) {
      console.log(`set ${key}`)
      if (value !== val) {
        observe(value)
        val = value
        dep.notify()
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  return new Observer(obj)
}

class Observer {
  constructor(obj) {
    if (Array.isArray(obj)) {

    } else {
      this.walk(obj)
    }
  }

  walk(obj) {
    for(let key of Object.keys(obj)) {
      defineReactive(obj, key, obj[key])
    }
  }
}

function proxy(vm) {
  for(let key of Object.keys(vm.$data)) {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(value) {
        vm.$data[key] = value
      }
    })
  }
}

class SuperVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    observe(this.$data)
    proxy(this)

    // todo: $mount
    if (options.el) {
      this.$mount(options.el)
    }
  }

  $mount(el) {
    this.$el = document.querySelector(el)

    const updateComponent = () => {
      // const {render} = this.$options
      // const el = render.call(this)
      // const parent = this.$el.parentElement
      // parent.insertBefore(el, this.$el.nextSibling)
      // parent.removeChild(this.$el)
      // this.$el = el

      const {render} = this.$options
      const vnode = render.call(this, this.$createElement)
      this._update(vnode)
    }

    new Watcher(this, updateComponent)
  }

  $createElement(tag, props, children) {
    return {tag, props, children}
  }

  _update(vnode) {
    const prevVnode = this._vnode

    if (!prevVnode) {
      this.__patch__(this.$el, vnode)
    } else {
      this.__patch__(prevVnode, vnode)
    }
  }

  __patch__(oVnode, nVnode) {
    // debugger
    if (oVnode.nodeType) {
      const parent = oVnode.parentElement
      const refEle = oVnode.nextSibling
      const el = this.createEle(nVnode)
      parent.insertBefore(el, refEle)
      parent.removeChild(oVnode)
    } else  {
      const el = nVnode.el = oVnode.el
      if (oVnode.tag === nVnode.tag) {
        const oldChildren = oVnode.children
        const newChildren = nVnode.children

        if (typeof newChildren === 'string' || typeof newChildren === 'number') {
          if (typeof oldChildren === 'string' || typeof oldChildren === 'number') {
            if (newChildren !== oldChildren) {
              el.textContent = newChildren
            }
          } else {
            el.textContent = newChildren
          }
        } else {
          if (typeof oldChildren === 'string') {
            el.innerHTML = ''
            for(let child of newChildren) {
              el.appendChild(this.createEle(child))
            }
          } else {
            this.updateChildren(el, oldChildren, newChildren)
          }
        }
      }
    }

    this._vnode = nVnode
  }

  updateChildren(parent, oldChildren, newChildren) {
    const len = Math.min(oldChildren.length, newChildren.length)
    for(let i = 0; i < len; i ++) {
      this.__patch__(oldChildren[i], newChildren[i])
    }

    if (newChildren.length > len) {
      for(let child of newChildren.slice(len)) {
        const el = this.createEle(child)
        parent.appendChild(el)
      }
    } else if (newChildren.length < len) {
      for(let child of oldChildren.slice(len)) {
        parent.removeChild(child.el)
      }
    }
  }

  createEle(vnode) {
    const el = document.createElement(vnode.tag)

    if (vnode.props) {
      for(const key of Object.keys(vnode.props)) {
        el.setAttribute(key, vnode.props[key])
      }
    }

    if (vnode.children) {
      if (typeof vnode.children === 'string' || typeof vnode.children === 'number') {
        el.textContent = vnode.children
      } else if (typeof vnode.children === 'object') {
        for(let node of vnode.children) {
          const child = this.createEle(node)
          el.appendChild(child)
        }
      }
    }

    vnode.el = el

    return el
  }
}

class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compile(this.$el)
  }

  compile(el) {
    for(let node of el.childNodes) {
      if (node.nodeType === 1) {
        this.compileElement(node)
      } else if (this.isInter(node)) {
        node.originTextContent = node.textContent
        this.compileText(node, RegExp.$1)
      }

      if (node.childNodes.length > 0) {
        this.compile(node)
      }
    }
  }

  isInter(node) {
    return node.nodeType === 3 && /{{(.+)}}/.test(node.textContent)
  }

  compileText(node, exp) {
    this.update(node, `this.$vm.${exp}`, 'inter')
  }

  compileElement(node) {
    for(const {name, value} of node.attributes) {
      // s-text | s-html | s-model
      if (name.startsWith('s-')) {
        const key = name.substr(2)
        this[key] && this[key](node, value)
      }
      // :attr
      else if (name.startsWith(':')) {
        const key = name.substr(1)
        this.attr(node, key, value)
      }
      // @event
      else if (name.startsWith('@')) {
        const event = name.substr(1)
        this.action(node, event, this.$vm[value])
      }
    }
  }

  // s-text
  text(node, exp) {
    this.update(node, `this.$vm.${exp}`, 'text')
  }

  // s-html
  html(node, exp) {
    this.update(node, `this.$vm.${exp}`, 'html')
  }

  // s-model
  model(node, exp) {
    node.addEventListener('input', event => eval(`this.$vm.${exp} = node.value`))
    this.update(node, `this.$vm.${exp}`, 'model')
  }

  // :attr
  attr(node, attr, exp) {
    exp = `this.$vm.${exp}`
    node.setAttribute(attr, eval(exp))
    new Watcher(this.$vm, exp, val => {
      node.setAttribute(attr, val)
    })
  }

  // @event
  action(node, event, fn) {
    node.addEventListener(event, fn)
  }

  update(node, exp, dir) {
    const fn = this[`${dir}Updater`]
    fn && fn(node, eval(exp))

    new Watcher(this.$vm, exp, val => {
      fn && fn(node, val)
    })
  }

  interUpdater(node, val) {
    node.textContent = node.originTextContent.replace(/{{.+}}/, val)
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  modelUpdater(node, val) {
    node.value = val
  }
}

class Watcher {
  constructor(vm, expOrFun) {
    this.vm = vm
    this.getter = expOrFun

    this.get()
  }

  get() {
    Dep.target = this
    this.getter.call(this.vm)
    Dep.target = null
  }

  update() {
    this.get()
  }
}

class Dep {
  constructor() {
    this.deps = new Set()
  }

  addDep(dep) {
    this.deps.add(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
