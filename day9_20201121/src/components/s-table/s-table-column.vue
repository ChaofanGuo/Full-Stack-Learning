<template>
    <th><slot></slot></th>
</template>

<script>
  export default {
    name: "s-table-column",
    props: {
      prop: {
        type: String,
        required: true
      },
      label: {
        type: String
      },
      width: {
        type: [Number, String]
      },
      sortable: {
        type: [Boolean, String]
      }
    },
    data() {
      return {
        row: {}
      }
    },
    render(h) {
      return h('div', this.$slots.default)
    }
  }
</script>

<style scoped>

</style>
