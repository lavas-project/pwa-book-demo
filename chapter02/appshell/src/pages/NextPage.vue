<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="$router.go(-1)">Back to Home</button>
  </div>
</template>

<script>
export default {
  name: 'NextPage',
  data () {
    return {
      msg: 'This is NextPage'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
button {
  font-size: 16px;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
  background-color: #fff;
  color: #42b983;
}
</style>
