<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-content confirmation-modal">
        <div class="confirmation-header">
          <h3>{{ title }}</h3>
          <button @click="$emit('cancel')" class="close-icon">&times;</button>
        </div>
        
        <div class="confirmation-body">
          <p>{{ message }}</p>
        </div>
        
        <div class="confirmation-footer">
          <button @click="$emit('confirm')" class="confirm-btn">
            {{ confirmText }}
          </button>
          <button @click="$emit('cancel')" class="cancel-btn">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'ConfirmationModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: 'Confirmação'
      },
      message: {
        type: String,
        required: true
      },
      confirmText: {
        type: String,
        default: 'Confirmar'
      },
      cancelText: {
        type: String,
        default: 'Cancelar'
      }
    }
  }
</script>
  
<style scoped>
  .confirmation-modal {
    max-width: 400px;
    padding: 1.5rem;
    background-color: #1a1a2e;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .confirmation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .close-icon {
    background: none;
    border: none;
    scale: 1.2;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
  }
  
  .confirmation-header h3 {
    margin: 0;
    color: #4facfe;
  }
  
  .confirmation-body {
    margin-bottom: 1.5rem;
  }
  
  .confirmation-body p {
    margin: 0;
    color: #fff;
  }
  
  .confirmation-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .confirm-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .confirm-btn:hover {
    background-color: #c82333;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background-color: #5a6268;
  }
</style>