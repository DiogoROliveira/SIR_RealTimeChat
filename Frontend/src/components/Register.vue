<template>
  <div class="page-container">
    <div class="register-form-container">
      <div class="register-card">
        <div class="card-header">
          <!-- Ícone de voltar dentro do header -->
          <div class="back-button-container">
            <router-link to="/" class="back-button">
              <span class="btn-icon">←</span> Voltar
            </router-link>
          </div>

          <h2>Criar Conta</h2>
          <p class="subtitle">Preencha os campos abaixo para criar uma conta.</p>
        </div>

        <form @submit.prevent="registerUser" class="space-y-6">
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
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar palavra-passe</label>
            <div class="input-container">
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                required
                placeholder="Confirme a sua palavra-passe"
                autocomplete="new-password"
              />
            </div>
          </div>

          <button type="submit" class="register-button" :class="{ 'loading': isLoading }">
            {{ isLoading ? 'A registar...' : 'Registar' }}
          </button>
        </form>

        <div class="card-footer">
          <p class="error-message" v-if="errorMessage" role="alert">
            {{ errorMessage }}
          </p>
          <p class="login-link">
            Já tem uma conta?
            <router-link to="/login">Inicie sessão aqui</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const API_URL = '';
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As palavras-passe não coincidem!';
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = '';

        const response = await fetch(`${API_URL}/register`, {
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
          this.$router.push('/login');
        } else {
          this.errorMessage = data.error || 'Erro ao registar a conta';
        }
      } catch (error) {
        console.error("Erro no registo:", error);
        this.errorMessage = "Erro ao tentar registar a conta. Tente novamente.";
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

.register-form-container {
  width: 100%;
  max-width: 440px;
}

.register-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #00f2fe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #a8b2d1;
  font-size: 0.875rem;
}

.back-button-container {
  margin-bottom: 1rem;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button {
  color: #a8b2d1;
  text-decoration: none;
  font-weight: 600;
}

.back-button:hover {
  color: #fff;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a8b2d1;
}

.input-container input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 5px rgba(79, 172, 254, 0.5);
  outline: none;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.register-button:hover {
  box-shadow: 0 6px 15px rgba(79, 172, 254, 0.4);
}

.register-button.loading {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  cursor: not-allowed;
}

.error-message {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.card-footer {
  margin-top: 1rem;
  text-align: center;
}

.login-link {
  color: #a8b2d1;
}

.login-link a {
  color: #4facfe;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
