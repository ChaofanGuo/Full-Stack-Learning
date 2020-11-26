<template>
    <div v-bind="$attrs" class="s-table-wrapper">
        <table class="s-table">
            <thead class="s-table-header">
                <tr class="s-table-header-row">
                    <slot></slot>
                </tr>
            </thead>
            <tbody>
                <tr class="s-table-body-row" v-for="(row, index) in data" :key="index">
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
        columns: []
      }
    },
    created() {
      this.columns = this.$slots.default
    },
    components: {
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

<style scoped>
    .s-table {
        width: 100%;
    }
</style>
