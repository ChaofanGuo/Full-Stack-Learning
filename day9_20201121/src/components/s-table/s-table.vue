<template>
    <div v-bind="$attrs" class="s-table-wrapper">
        <div class="column-config"><slot :row="scope"></slot></div>
        <table class="s-table">
            <thead class="s-table-header">
            <tr class="s-table-header-row">
                <s-table-head v-for="(column, index) in columns" :key="'head-' + index" :options="column.componentOptions.propsData" :vNode="column" @sort="sortData"></s-table-head>
            </tr>
            </thead>
            <tbody>
            <tr class="s-table-body-row" v-for="(row, index) in data" :key="'cell-' + index">
                <s-table-cell v-for="(column, index) in columns" :key="index" :column="column" :data="row"></s-table-cell>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import {formatDate} from "@/util";

  export default {
    name: "s-table",
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        columns: [],
        scope: {}
      }
    },
    methods: {
      sortData(dir, prop) {
        console.log(dir, prop)
        this.data.sort((a, b) => {
          if (dir > 0) {
            return a[prop] - b[prop]
          } else {
            return b[prop] - a[prop]
          }
        })
      }
    },
    created() {
      debugger
      this.columns = this.$slots.default
    },
    components: {
      's-table-head': {
        props: {
          options: {
            type: Object
          },
          vNode: [Array, String, Number, Object]
        },
        data() {
          return {
            sort: null,
            label: '',
            prop: '',
            width: ''
          }
        },
        created() {
          let {prop, label, sortable, width} = this.options
          this.prop = prop
          this.label = label
          this.width = width
          if (sortable !== undefined) {
            this.sort = 'asc'
            if (typeof sortable === 'string') {
              if (sortable.length === 0) {
                this.sort = 'asc'
              } else {
                this.sort = sortable
              }
            }
          } else {
            this.sort = null
          }
        },
        render(h) {
          let children = [
            h('span', this.label),
          ]
          if (this.sort !== null) {
            children.push(
              h('span', {
                class: {
                  'sort-arrow': true,
                  'asc': this.sort === 'asc',
                  'desc': this.sort === 'desc'
                },
                attrs: this.vNode.data.attrs,
                on: {
                  click: () => {
                    console.log('about emit')
                    if (this.sort) {
                      this.sort = this.sort === 'asc' ? 'desc' : 'asc'
                      let dir = this.sort === 'asc' ? 1 : -1
                      this.$emit('sort', dir, this.prop)
                    }
                  }
                }
              })
            )
          }
          let style = {}
          if (this.width && this.width.length > 0) {
            style.width = `${this.width}${this.width > 0 && this.width < 100 ? '%' : 'px'}`
          }
          return h('th', {
            class: 's-table-header-column',
            style,
            attrs: this.vNode.data.attrs
          }, children)
        }
      },
      's-table-cell': {
        props: {
          column: [Array, String, Number, Object],
          data: [Object]
        },
        render(h) {
          let content = this.data[this.column.componentOptions.propsData.prop]
          if (content instanceof Date) {
            content = formatDate(content, '')
          }
          return h('td', content)
        }
      }
    }
  }
</script>

<style>
    .column-config {
        display: none;
    }

    .sort-arrow {
        display: inline-block;
    }

    .sort-arrow:after {
        content: ">";
        display: inline-block;
        margin-left: 10px;
    }

    .sort-arrow.asc:after {
        transform: rotate(90deg);
    }

    .sort-arrow.desc:after {
        transform: rotate(-90deg);
    }

    .s-table {
        width: 100%;
    }
</style>
