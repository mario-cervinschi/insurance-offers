<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  labelData: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [String, Number, Date],
    default: ''
  },
  min: {
    type: Number,
    required: false
  },
  max: {
    type: Number,
    required: false
  },
  dark: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  infoMessage: {
    type: String,
    default: ''
  }
});

const localValue = ref(props.modelValue);

const isTouched = ref(false);
const isFocused = ref(false);

const emit = defineEmits(['update:modelValue', 'blur']);

const handleFocus = (event) => {
  isFocused.value = true;
  if (props.type === 'date' && event.target.type === 'text') {
    event.target.type = 'date';
  }
};

const handleBlur = (event) => {
  isFocused.value = false;
  isTouched.value = true;

  if (props.type === 'date' && !localValue.value) {
    event.target.type = 'text';
  }

  emit('blur', event);
};

const handleInput = () => {
  isTouched.value = true;
};

watch(localValue, (newValue) => {
  if (props.min !== undefined && newValue < props.min) {
    localValue.value = props.min
    emit('update:modelValue', props.min)
  } else if (props.max !== undefined && newValue > props.max) {
    localValue.value = props.max
    emit('update:modelValue', props.max)
  } else {
    emit('update:modelValue', newValue)
  }
});

const shouldShowError = computed(() => {
  return isTouched.value && props.errorMessage !== '';
});

const shouldShowInfo = computed(() => {
  return !shouldShowError.value && props.infoMessage !== '';
});

const labelFloating = computed(() => {
  return isFocused.value || (localValue.value !== '' && localValue.value !== null && localValue.value !== undefined);
});

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({
  triggerValidation
});

</script>

<template>
  <div class="flex flex-col">
    <div class="relative">
      <input :id="id" :type="type === 'date' ? 'text' : type" :min="min" :max="max" v-model="localValue"
        @focus="handleFocus" @blur="handleBlur" @input="handleInput"
        class="custom-input focus:outline-none shadow rounded-[4px] px-[15px] pt-[22px] pb-[8px] font-jura font-bold w-full"
        :class="[
          dark ? 'bg-white/[0.15] text-gray-100/90' : 'bg-white/80 text-black',
          type === 'date' ? 'h-[54px] box-border' : ''
        ]" :style="type === 'date' ? 'box-sizing: border-box !important;' : ''" />
      <label :for="id"
        class="absolute left-[15px] text-white font-jura pointer-events-none transition-all duration-200 ease-in-out origin-left"
        :class="labelFloating
          ? 'top-[6px] text-sm opacity-75 transform scale-90 font-semibold'
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