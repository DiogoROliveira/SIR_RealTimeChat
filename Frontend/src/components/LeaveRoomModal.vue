<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Confirmar Saída</h3>
          <button @click="$emit('close')" class="close-icon">&times;</button>
        </div>
        
        <div class="modal-body">
          <p>Tem certeza que deseja sair da sala "{{ roomName }}"?</p>
          <p class="warning-text">Esta ação não pode ser desfeita</p>
        </div>
  
        <div class="modal-footer">
          <button @click="$emit('close')" class="cancel-btn">Cancelar</button>
          <button @click="$emit('confirm')" class="confirm-btn">Sair da Sala</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LeaveRoomModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      roomName: {
        type: String,
        required: true
      }
    }
  };
  </script>

<style scoped>

/* Modal Overlay */
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

/* Modal Content */
.modal-content {
  background: #1e1e2f;
  color: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #4facfe;
}

.close-icon {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-icon:hover {
  color: #ef4444;
}

/* Modal Body */
.modal-body {
  margin-bottom: 1.5rem;
}

.modal-body p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.warning-text {
  color: #ef4444;
  font-size: 0.9rem;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.cancel-btn, .confirm-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.confirm-btn {
  background: #ef4444;
  color: #fff;
  border: none;
}

.confirm-btn:hover {
  background: #dc2626;
}

</style>