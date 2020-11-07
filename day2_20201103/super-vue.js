function defineReactive(obj, key, val) {
  observe(val)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      // console.log(`get ${key}`)
      Dep.target && dep.addDep(Dep.target)

      return val
    },
    set(value) {
      // console.log(`set ${key}`)
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

    this.$methods = options.methods
    for(let name of Object.keys(options.methods)) {
      this[name] = options.methods[name].bind(this)
    }

    observe(this.$data)
    proxy(this)

    this.$compile = new Compile(options.el, this)
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
  constructor(vm, exp, updater) {
    this.$vm = vm
    this.$exp = exp
    this.$updater = updater

    Dep.target = this
    eval(exp)
    Dep.target = null
  }

  update() {
    this.$updater.call(this.$vm, eval(this.$exp))
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
