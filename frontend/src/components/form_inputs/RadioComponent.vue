<script setup>
import { ref } from 'vue';


const props = defineProps({
  modelValue: {
    type: [Boolean, String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  dark: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isTouched = ref(false);
const isFocused = ref(false);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
  isTouched.value = true;
};

const handleInput = () => {
  isTouched.value = true;
};

const updateValue = (val) => {
  emit('update:modelValue', val)
}

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({
  triggerValidation
});
</script>

<template>
  <div class="flex gap-4 justify-around">
    <label v-for="(option, index) in options" :key="index"
      class="flex items-center p-4 rounded-lg cursor-pointer transition-colors duration-200">
      <input class="sr-only peer" type="radio" :id="`${name}-${index}`" :name="name" :value="option.value"
        @focus="handleFocus" @blur="handleBlur" @input="handleInput" :checked="modelValue === option.value"
        @change="updateValue(option.value)" />
      <div
        class="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500 flex items-center justify-center transition-all duration-200">
        <div class="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
        </div>
      </div>
      <span class="ml-[6px] font-medium text-lg font-jura tracking-tighter transition-colors duration-200"
        :class="dark ? 'text-gray-100/90 group-hover:text-blue-300' : 'text-black group-hover:text-blue-600'">
        {{ option.label }}
      </span>
    </label>
  </div>
</template>
