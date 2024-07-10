<template>
  <div id="app">
    <header>
      <h1>Pokédex</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
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

header {
  background-color: #ffcb05;
  padding: 20px;
  border-bottom: 2px solid #3b4cca;
}

header h1 {
  margin: 0;
  color: #3b4cca;
}

main {
  padding: 20px;
}
</style>
