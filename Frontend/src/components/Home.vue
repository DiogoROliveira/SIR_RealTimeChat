<template>
  <div class="home-container">
    <div class="background-animation"></div>
    
    <header class="header">
      <div class="logo-container">
        <div class="logo-circle">
          <span class="logo-text">RT</span>
        </div>
      </div>
      <h1 class="title">Real Time Chat</h1>
      <p class="subtitle">Conecte-se instantaneamente, comunique-se sem limites.</p>
    </header>

    <main class="main">
      <div class="features">
        <div class="feature">
          <i class="feature-icon">🚀</i>
          <h3>Rápido & Seguro</h3>
          <p>Mensagens instantâneas com criptografia de ponta a ponta</p>
        </div>
        <div class="feature">
          <i class="feature-icon">👥</i>
          <h3>Salas Temáticas</h3>
          <p>Encontre pessoas com interesses em comum</p>
        </div>
        <div class="feature">
          <i class="feature-icon">💬</i>
          <h3>Chat em Tempo Real</h3>
          <p>Comunicação fluida e sem delays</p>
        </div>
      </div>

      <div v-if="!isAuthed" class="cta-buttons">
        <router-link to="/login" class="btn btn-login">
          Entrar
          <span class="btn-icon">→</span>
        </router-link>
        <router-link to="/register" class="btn btn-register">
          Criar Conta
          <span class="btn-icon">+</span>
        </router-link>
      </div>
      <div v-if="isAuthed" class="cta-buttons">
        <router-link to="/dashboard" class="btn btn-login">
          Ir para o Dashboard
          <span class="btn-icon">→</span>
        </router-link>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p class="copyright">&copy; 2024 Real Time Chat</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Sobre</a>
          <a href="#" class="footer-link">Privacidade</a>
          <a href="#" class="footer-link">Termos</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isAuthed: false,
    }
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = sessionStorage.getItem('token');
      if (token) {
        this.isAuthed = true;
      }
    }
  },
};
</script>

<style scoped>
/* Estilos base e reset */

:root, body {
  margin: 0;
  padding: 0;
  width: 100%;
}

.home-container {
  width:100%;
  height: 100vh;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
}

/* Animação de fundo */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(41, 196, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 41, 117, 0.1) 0%, transparent 50%);
  animation: backgroundPulse 15s ease-in-out infinite;
  z-index: 0;
}

/* Header */
.header {
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: pulse 2s infinite;
}

.logo-text {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #00f2fe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: slideIn 1s ease-out;
}

.subtitle {
  font-size: 1.2rem;
  color: #a8b2d1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  animation: fadeIn 1s ease-out 0.5s both;
}

/* Main Content */
.main {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.features {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 4rem;
}

.feature {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.feature p {
  color: #a8b2d1;
  line-height: 1.6;
}

/* Botões */
.cta-buttons {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-login {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.btn-register {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-register:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(5px);
}

/* Footer */
.footer {
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #a8b2d1;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  color: #a8b2d1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: white;
}

/* Animações */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(79, 172, 254, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
  }
}

@keyframes backgroundPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 768px) and (min-width: 375px) {
  .title {
    font-size: 2.5rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}
</style>