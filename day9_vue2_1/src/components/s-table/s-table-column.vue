<template>
    <th v-bind="$attrs" class="s-table-header-column">{{label}}</th>
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
      }
    },
    mounted() {
      if (this.width) {
        this.$el.style.width = parseInt(this.width) + 'px'
      }
    }
  }
</script>

<style scoped>

</style>
