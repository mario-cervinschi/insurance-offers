<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  labelData: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  infoMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isTouched = ref(false);
const isFocused = ref(false);

const localValue = ref(props.modelValue)

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

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
}, { immediate: true })

watch(localValue, (newVal) => {
  emit('update:modelValue', newVal)
})

const shouldShowError = computed(() => {
  return isTouched.value && props.errorMessage !== '';
});

const shouldShowInfo = computed(() => {
  return !shouldShowError.value && props.infoMessage !== '';
});

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({
  triggerValidation
});

</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-white font-medium tracking-wide">{{ labelData }}</label>
    <select :id="id" v-model="localValue" :disabled="disabled" @focus="handleFocus" @blur="handleBlur"
      @change="handleChange" class="focus:outline-none shadow rounded-md px-2 py-1 font-medium bg-white/20 text-white">
      <option v-for="option in options" :key="option.value" :value="option.value" class="text-black">
        {{ option.label }}
      </option>
    </select>
    <p class="text-xs font-thin min-h-[1.2rem]">
      <span v-if="shouldShowInfo" class="text-black font-semibold text-xs">{{ infoMessage }}</span>
      <span v-if="shouldShowError" class="text-red-600 font-semibold text-xs">{{ errorMessage }}</span>
    </p>
  </div>
</template>
