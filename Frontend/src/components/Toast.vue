<template>
  <transition name="toast">
    <div v-if="show" :class="['toast', type]">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'success',
      validator: function(value) {
        return ['success', 'error', 'warning', 'info'].indexOf(value) !== -1
      }
    },
    setTimeout: {
      type: Number,
      default: 3000
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  color: white;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast.warning {
  background-color: #ff9800;
}

.toast.info {
  background-color: #2196f3;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>