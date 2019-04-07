<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <bottom-navigation></bottom-navigation>
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation'

export default {
  name: 'App',
  components: {
    BottomNavigation
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
  padding-top: 60px;
}
</style>
