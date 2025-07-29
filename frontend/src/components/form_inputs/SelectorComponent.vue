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
  return isFocused.value || (localValue.value !== '' && localValue.value !== null && localValue.value !== undefined);
});

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({ triggerValidation });
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="relative">
      <select :id="id" v-model="localValue" :disabled="disabled" @focus="handleFocus" @blur="handleBlur"
        @change="handleInput"
        class="focus:outline-none shadow rounded-[4px] px-[15px] pt-[22px] pb-[8px] font-jura font-bold w-full transition-all duration-200 appearance-none"
        :class="[
          dark ? 'bg-white/20 text-white' : 'bg-white/80 text-black',
        ]">
        <option v-for="option in options" :key="option.value" :value="option.value" class="text-black">
          {{ option.label }}
        </option>
      </select>

      <label :for="id"
        class="absolute left-[15px] text-white font-jura pointer-events-none transition-all duration-200 ease-in-out"
        :class="labelFloating
          ? 'top-[6px] text-sm opacity-75 transform scale-90 font-semibold'
          : 'top-1/2 text-lg -translate-y-1/2 transform font-thin'">
        {{ labelData }}
      </label>
    </div>
    <p class="text-xs font-thin min-h-[1.2rem]">
      <span v-if="shouldShowInfo" class="text-black font-normal text-xs">{{ infoMessage }}</span>
      <span v-if="shouldShowError" class="text-[#FF6B6B] font-bold text-xs">{{ errorMessage }}</span>
    </p>
  </div>
</template>
