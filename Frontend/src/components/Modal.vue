<template>
    <div v-if="show" class="modal-overlay" @click.self="onClose">
      <div class="modal-content">
        <header class="modal-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button class="close-btn" @click="onClose">✕</button>
        </header>
        <main class="modal-body">
          <slot>
            <!-- Conteúdo modal padrão -->
            <p>Conteúdo do modal</p>
          </slot>
        </main>
        <footer class="modal-footer">
          <slot name="footer">
            <button class="action-btn" @click="onClose">Fechar</button>
          </slot>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Modal",
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: "Título do Modal",
      },
    },
    emits: ["close"],
    methods: {
      onClose() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
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
}

.modal-content h3 {
  margin-bottom: 1rem;
}

.public-rooms ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.public-rooms li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.join-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.join-btn:hover {
  background: #43a047;
}

.modal-actions {
  margin: 1rem 0;
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
  </style>