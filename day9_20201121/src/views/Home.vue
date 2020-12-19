<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <s-table :data="list" style="width:100%">
      <s-table-column prop="date" label="日期" sortable width="55" @sort="() => console.log(arguments)"></s-table-column>
      <s-table-column prop="name" label="名称"></s-table-column>
      <s-table-column prop="address" label="地址"></s-table-column>
      <s-table-column prop="actions" label="操作">
        <template slot-scope="scope">
            <button v-for="(action, index) in scope.row.actions" :key="index" @click="listAction(scope.row, action)">{{actionMap[action]}}</button>
        </template>
      </s-table-column>
    </s-table>
  </div>
</template>

<script>
// @ is an alias to /src
import Table from '@/components/s-table/s-table'
import TableColumn from '@/components/s-table/s-table-column'

export default {
  name: 'Home',
  data() {
    return {
      actionMap: {
        0: '修改',
        1: '删除'
      },
      list: [
        {
          date: new Date('2020-11-01'),
          name: 'User1',
          address: '上海市',
          actions: [0]
        },
        {
          date: new Date('2020-11-02'),
          name: 'User2',
          address: '上海市',
          actions: [1]
        },
        {
          date: new Date('2020-11-03'),
          name: 'User3',
          address: '上海市',
          actions: [0]
        },
        {
          date: new Date('2020-11-04'),
          name: 'User4',
          address: '上海市',
          actions: [1]
        },
        {
          date: new Date('2020-11-05'),
          name: 'User5',
          address: '上海市',
          actions: [0]
        },
        {
          date: new Date('2020-11-06'),
          name: 'User6',
          address: '上海市',
          actions: [1]
        },
        {
          date: new Date('2020-11-07'),
          name: 'User7',
          address: '上海市',
          actions: [0]
        },
        {
          date: new Date('2020-11-08'),
          name: 'User8',
          address: '上海市',
          actions: [1]
        },
        {
          date: new Date('2020-11-09'),
          name: 'User9',
          address: '上海市',
          actions: [0]
        }
      ]
    }
  },
  methods: {
    listAction(row, action) {
      console.log(row, action)
    },
    remove(item) {
      item.delete = true
    },
    change(item) {
      item.address += 1
    }
  },
  components: {
    's-table': Table,
    's-table-column': TableColumn
  }
}
</script>
