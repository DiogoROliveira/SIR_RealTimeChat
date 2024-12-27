<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nome de Usuário</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Entrar</button>
        <p class="switch">
          Ainda não tem uma conta? <router-link to="/register">Registre-se</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Login",
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post("http://localhost:3000/login", {
            username: this.username,
            password: this.password,
          });
          alert("Login bem-sucedido!");
          localStorage.setItem("token", response.data.token); 
          this.$router.push("/chat"); 
        } catch (error) {
          alert("Erro ao fazer login. Verifique suas credenciais.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login {
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
  