function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      // console.log(`get ${key}`)
      return val
    },
    set(value) {
      // console.log(`set ${key}`)
      observe(value)
      val = value

      // update()
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }
  return new Observer(obj)
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => Object.defineProperty(vm, key, {
    get() {
      return vm.$data[key]
    },
    set(value) {
      vm.$data[key] = value
    }
  }))
}

class Observer {
  constructor(obj) {
    if (Array.isArray(obj)) {

    } else {
      this.walk(obj)
    }
  }

  walk(obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
  }
}


class SuperVue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    observe(this.$data)
    proxy(this)

    // todo: compile
    new Compile(options.el, this)
  }
}

class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compile(this.$el)
  }

  compile(el) {
    const childNodes = el.childNodes

    childNodes.forEach(node => {
      if (node.nodeType === 1) {
        this.compileElement(node)
      } else if (this.isInter(node)) {
        this.compileText(node)
      }

      if (node.childNodes) {
        this.compile(node)
      }
    })
  }

  isInter(node) {
    return node.nodeType === 3 && /{{(.+)}}/.test(node.textContent)
  }

  compileText(node) {
    this.update(node, `this.$vm.${RegExp.$1}`, 'text')
  }

  compileElement(node) {
    let nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value

      if(attrName.startsWith('s-')) {
        const key = attrName.substr(2)
        this[key] && this[key](node, exp)
      } else if (attrName.startsWith(':')) {

      }
    })
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

  }

  update(node, exp, dir) {
    const fn = this[dir + 'Updater']
    fn && fn(node, eval(exp))
    new Watcher(this.$vm, exp, (val) => {
      fn && fn(node, eval(exp))
    })
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }
}

class Watcher {
  constructor(vm, exp, update) {
    this.$vm = vm
    this.exp = exp
    this.update = update
  }

  update() {
    this.update.call(this.$vm, this.exp)
  }
}

class dep {

}