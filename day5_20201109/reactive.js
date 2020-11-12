
function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}`)
      return val
    },
    set(value) {
      console.log(`set ${key}`)
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
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

function _set(obj, key, val) {
  defineReactive(obj, key, val)
}

function _del(obj, key) {

}

function test() {
  const obj = {
    foo: 'foo',
    bar: 'bar',
    baz: {
      a: 'a'
    }
  }

  observe(obj)

  obj.foo
  obj.foo = 'new foo'
  obj.bar
  obj.bar = 'new bar'
  obj.baz.a
  obj.baz.a = 'new a'
}
test()

