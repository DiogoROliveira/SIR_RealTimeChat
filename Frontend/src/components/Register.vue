<template>
    <div class="register">
      <h2>Registrar</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Registrar</button>
        <p class="switch">
          Já tem uma conta? <router-link to="/login">Faça Login</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Register",
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await axios.post("http://localhost:3000/register", {
            username: this.username,
            password: this.password,
          });
          alert("Registro bem-sucedido! Faça login para continuar.");
          this.$router.push("/login");
        } catch (error) {
          alert("Erro ao registrar. Tente novamente.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 400px;
    margin: 50px auto;
    text-align: center;
  }
  .form-group {
    margin-bottom: 20px;
  }
  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #369671;
  }
  .switch {
    margin-top: 20px;
  }
  </style>
  