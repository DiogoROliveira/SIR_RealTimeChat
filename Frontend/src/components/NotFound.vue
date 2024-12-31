<template>
  <div class="page-container">
    <div class="background-animation"></div>
    
    <div class="not-found-content">
      <div class="logo-circle">
        <span class="logo-text">RT</span>
      </div>
      
      <h1 class="title">404</h1>
      <p class="subtitle">Página não encontrada</p>
      
      <router-link to="/" class="btn btn-primary">
        Voltar para a página inicial
        <span class="btn-icon">→</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(41, 196, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 41, 117, 0.1) 0%, transparent 50%);
  animation: backgroundPulse 15s ease-in-out infinite;
  z-index: 0;
}

.not-found-content {
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  animation: pulse 2s infinite;
}

.logo-text {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.title {
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #00f2fe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: slideIn 1s ease-out;
}

.subtitle {
  font-size: 1.5rem;
  color: #a8b2d1;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.5s both;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 2rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(5px);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(79, 172, 254, 0); }
  100% { box-shadow: 0 0 0 0 rgba(79, 172, 254, 0); }
}

@keyframes backgroundPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 640px) {
  .title {
    font-size: 4rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>