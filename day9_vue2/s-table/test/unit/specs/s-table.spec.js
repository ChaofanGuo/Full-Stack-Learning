import Vue from 'vue'
import sTable from '@/components/s-table'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(sTable)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.s-table .msg').textContent)
      .toEqual('bla bla bla')
  })
})
