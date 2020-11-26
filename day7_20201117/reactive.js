// you can you up
function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

const baseHandler = {
  get(target, key) {
    const res = Reflect.get(target, key)
    console.log('get', key, res)
    track(target, key)
    return isObject(res) ? reactive(res) : res
  },
  set(target, key, value) {
    debugger
    const res = Reflect.set(target, key, value)
    console.log('set', key, res)
    trigger(target, key)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    console.log('del', key, res)
    trigger(target, key)
    return res
  }
}

function reactive(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  return new Proxy(obj, baseHandler)
}

function effect(callbackFn) {
  const e = createReactiveEffect(callbackFn)
  e()
  return e
}

const effectStack = []
function createReactiveEffect(fn) {
  return function () {
    try {
      effectStack.push(fn)
      return fn()
    } finally {
      effectStack.pop()
    }
  }
}

const targetMap = new WeakMap()
function track(target, key) {
  const effect = effectStack[effectStack.length - 1]
  if (effect) {
    let depMap = targetMap.get(target)
    if (!depMap) {
      depMap = new Map()
      targetMap.set(target, depMap)
    }
    let deps = depMap.get(key)
    if (!deps) {
      deps = new Set()
      depMap.set(key, deps)
    }

    deps.add(effect)
  }
}

function trigger(target, key) {
  const depMap = targetMap.get(target)
  if (!depMap) {
    return
  }
  const deps = depMap.get(key)
  if (deps && deps.size > 0) {
    for(let dep of deps) {
      dep()
    }
  }
}


const state = reactive({foo: 'foo', bar: {n: 1}})

effect(() => {
  console.log('eff1', state.foo)
})
effect(() => {
  console.log('eff2', state.foo)
})

debugger
state.foo = 'new foo'
