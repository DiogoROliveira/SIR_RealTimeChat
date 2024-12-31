<template>
    <div class="capacity-slider">
      <label for="capacitySlider">Capacidade</label>
      <input
        type="range"
        id="capacitySlider"
        v-model.number="internalValue"
        :min="min"
        :max="max"
        @input="updateValue"
      />
      <span>{{  internalValue }}</span>
    </div>
</template>
  
<script>
  export default {
    props: {
      modelValue: {  
        type: Number,
        required: true,
        default: 10,
      },
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 100
      }
    },
    data() {
      return {
        internalValue: Number(this.modelValue)
      };
    },
    methods: {
      updateValue() {
        this.$emit('update:modelValue', Number(this.internalValue)); 
      }
    },
    watch: {
      modelValue(newVal) { 
        this.internalValue = Number(newVal);
      }
    }
  };
</script>
  
<style scoped>
  .capacity-slider {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .capacity-slider label {
    margin-bottom: 0.5rem;
  }
  
  .capacity-slider input[type="range"] {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .capacity-slider span {
    font-size: 1.2rem;
    color: #4facfe;
  }
</style>
  