<template>
    <div id="app">
        <p @click="() => {this.$store.commit('add')}">{{$store.state.counter}}</p>
        <p @click="() => {this.$store.dispatch('add')}">async : {{$store.state.counter}}</p>
        <p>double: {{$store.getters.doubleCounter}}</p>
        <p>double proxy: {{$store.proxyGetters.doubleCounter}}</p>
        <p>double computed: {{$store.computedGetters.doubleCounter}}</p>
        <div id="nav">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$store.computedGetters)
  }
}
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
