<template>
    <transition name="toast">
      <div v-if="show" class="toast" :class="type">
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'Toast',
    props: {
      show: Boolean,
      message: String,
      type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error', 'info'].includes(value)
      }
    }
  }
  </script>
  
  <style scoped>
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .success {
    background-color: #10B981;
  }
  
  .error {
    background-color: #EF4444;
  }
  
  .info {
    background-color: #3B82F6;
  }
  
  .toast-enter-active, .toast-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-enter-from, .toast-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  </style>