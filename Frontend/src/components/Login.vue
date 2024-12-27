<template>
  <div class="page-container">
    <div class="login-form-container">
      <div class="login-card">
        <div class="card-header">
          <!-- Ícone de voltar dentro do header -->
          <div class="back-button-container">
            <router-link to="/" class="back-button">
              <span class="btn-icon">←</span> Voltar
            </router-link>
          </div>

          <h2>Bem-vindo</h2>
          <p class="subtitle">Faça login para continuar</p>
        </div>
        
        <form @submit.prevent="loginUser" class="space-y-6">
          <div class="form-group">
            <label for="username">Nome de utilizador</label>
            <div class="input-container">
              <input 
                v-model="username" 
                type="text" 
                id="username" 
                required 
                placeholder="Digite o seu nome de utilizador"
                autocomplete="username"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Palavra-passe</label>
            <div class="input-container">
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                required 
                placeholder="Digite a sua palavra-passe"
                autocomplete="current-password"
              />
            </div>
          </div>

          <button type="submit" class="login-button" :class="{ 'loading': isLoading }">
            {{ isLoading ? 'A entrar...' : 'Entrar' }}
          </button>
        </form>

        <div class="card-footer">
          <p class="error-message" v-if="errorMessage" role="alert">
            {{ errorMessage }}
          </p>
          <p class="register-link">
            Ainda não tem conta? 
            <router-link to="/register">Registe-se aqui</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async loginUser() {
      try {
        this.isLoading = true;
        this.errorMessage = '';

        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('token', data.token);
          this.$router.push('/rooms');
        } else {
          this.errorMessage = data.error || 'Credenciais inválidas';
        }
      } catch (error) {
        console.error("Erro no login:", error);
        this.errorMessage = "Erro ao tentar fazer login. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
  min-height: 100vh;
  width: 100%;
  padding: 1rem;
}

.login-form-container {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-out;
  width: 100%;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.card-header h2 {
  color: #1a365d;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input-container {
  position: relative;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-button {
  width: 100%;
  padding: 0.875rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1.5rem;
}

.login-button:hover {
  background: #2563eb;
}

.login-button:active {
  transform: scale(0.98);
}

.login-button.loading {
  background: #93c5fd;
  cursor: not-allowed;
}

.card-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fee2e2;
  border-radius: 0.375rem;
  animation: shake 0.5s ease-in-out;
}

.register-link {
  color: #64748b;
  font-size: 0.875rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}


.back-button-container {
  position: absolute;
  left: -40px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #3b82f6;
  font-weight: 500;
  transition: color 0.2s;
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.5rem; /* Tamanho da seta */
}

.back-button:hover {
  color: #2563eb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 640px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .page-container {
    padding: 1rem;
  }
}
</style>
