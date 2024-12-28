<template>
    <div class="home">
      <h1>Bem-vindo ao Chat App</h1>
      <p>Conecte-se e comece a conversar em tempo real!</p>
      <router-link to="/login" class="btn">Fazer Login</router-link>
      <router-link to="/register" class="btn">Registrar-se</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "Home",
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    margin-top: 50px;
  }
  .btn {
    display: inline-block;
    margin: 10px;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  .btn:hover {
    background-color: #369671;
  }
  </style>
  