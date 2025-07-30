<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  labelData: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { type: [String, Number], default: '' },
  disabled: { type: Boolean, default: false },
  dark: { type: Boolean, default: true },
  errorMessage: { type: String, default: '' },
  infoMessage: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'blur']);

const localValue = ref(props.modelValue);
const isTouched = ref(false);
const isFocused = ref(false);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = (event) => {
  isFocused.value = false;
  isTouched.value = true;
  emit('blur', event);
};

const handleInput = () => {
  isTouched.value = true;
};

watch(() => props.modelValue, (val) => {
  localValue.value = val;
}, { immediate: true });

watch(localValue, (val) => {
  emit('update:modelValue', val);
});

const shouldShowError = computed(() => isTouched.value && props.errorMessage !== '');
const shouldShowInfo = computed(() => !shouldShowError.value && props.infoMessage !== '');

const labelFloating = computed(() => {
  return (localValue.value !== '' && localValue.value !== null && localValue.value !== undefined);
});

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({ triggerValidation });
</script>

<template>
  <div class="flex flex-col">
    <div class="relative">
      <select :id="id" v-model="localValue" :disabled="disabled" @focus="handleFocus" @blur="handleBlur"
        @change="handleInput"
        class="custom-input focus:outline-none shadow rounded-[4px] px-[15px] pt-[22px] pb-[8px] font-jura font-bold w-full appearance-none"
        :class="[
          dark ? 'bg-white/[0.15] text-gray-100/90' : 'bg-white/80 text-black',
        ]">
        <option v-for="option in options" :key="option.value" :value="option.value" class="text-black">
          {{ option.label }}
        </option>
      </select>

      <label :for="id"
        class="absolute left-[15px] text-white font-jura pointer-events-none transition-all duration-200 ease-in-out"
        :class="labelFloating
          ? 'top-[6px] text-sm opacity-75 transform origin-left scale-90 font-semibold'
          : 'top-1/2 text-lg text-gray-100/90 -translate-y-1/2 transform font-thin'">
        {{ labelData }}
      </label>
    </div>
    <p class="text-xs font-thin min-h-[1.2rem]">
      <span v-if="shouldShowInfo" class="text-gray-200/80 font-jura font-normal text-[10px]">{{ infoMessage }}</span>
      <span v-if="shouldShowError" class="text-red-500/80 font-jura font-bold text-[10px]">{{ errorMessage }}</span>
    </p>
  </div>
</template>

<style scoped>
.custom-input:-webkit-autofill,
.custom-input:-webkit-autofill:hover,
.custom-input:-webkit-autofill:focus,
.custom-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0) inset !important;
  -webkit-text-fill-color: white !important;
  background-color: transparent !important;
  transition: background-color 5000s ease-in-out 0s;
}

.custom-input.bg-white\/80:-webkit-autofill,
.custom-input.bg-white\/80:-webkit-autofill:hover,
.custom-input.bg-white\/80:-webkit-autofill:focus,
.custom-input.bg-white\/80:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.8) inset !important;
}
</style>