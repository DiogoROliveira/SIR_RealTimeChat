<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h3>Entrar em Grupo Privado</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="accessCode">Código de Acesso</label>
            <input
              type="text"
              id="accessCode"
              v-model="accessCode"
              required
              placeholder="Digite o código de acesso"
              class="input-field"
            />
          </div>
  
          <p v-if="error" class="error-message">{{ error }}</p>
  
          <div class="modal-actions">
            <button 
              type="submit" 
              class="action-btn"
              :disabled="loading"
            >
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
            <button 
              @click="$emit('close')" 
              class="close-btn"
              type="button"
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>

  const API_URL = 'http://localhost:3000';

  export default {
    name: 'JoinPrivateRoom',

    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
  
    data() {
      return {
        accessCode: '',
        error: '',
        loading: false
      }
    },
  
    methods: {
      async handleSubmit() {
        if (!this.accessCode.trim()) return;
        
        this.loading = true;
        this.error = '';
        
  
        try {
          const response = await fetch(`${API_URL}/rooms/${this.accessCode}/joinP`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({ accessCode: this.accessCode })
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Erro ao entrar na sala');
          }
  
          const data = await response.json();
          this.$emit('success', data.room);
          this.$emit('close');
          this.accessCode = '';
          
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .error-message {
    color: #dc2626;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }
  
  .input-field {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    margin-top: 0.25rem;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  /* Reutilizando os estilos existentes do Dashboard */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #1e1e2f;
    color: #fff;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-actions {
    margin: 1rem 0;
  }
  
  .action-btn, .close-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-btn {
    background: #4facfe;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .action-btn:hover {
    background: #0077c2;
  }
  
  .action-btn:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
  
  .close-btn {
    background: #ef4444;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .close-btn:hover {
    background: #dc2626;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #fff;
  }
  </style>