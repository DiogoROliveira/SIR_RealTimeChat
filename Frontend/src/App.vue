<template>
  <router-view />
</template>

<script setup>

</script>

<style>
/* Removido o "scoped" para que os estilos sejam globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>