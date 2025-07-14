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

const emit = defineEmits(['update:modelValue']);

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

const triggerValidation = () => {
  isTouched.value = true;
};

defineExpose({
  triggerValidation
});

</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-white tracking-wide font-medium">{{ labelData }}</label>
    <input :id="id" :type="type" :min="min" :max="max" v-model="localValue" @focus="handleFocus" @blur="handleBlur"
      @input="handleInput"
      :class="dark ? 'focus:outline-none shadow rounded-md px-2 py-1 font-medium  bg-white/20 text-white' : 'focus:outline-none shadow rounded-md px-2 py-1 font-medium  bg-white/80 text-white'" />
    <p class="text-xs font-thin min-h-[1.2rem]">
      <span v-if="shouldShowInfo" class="text-black font-normal text-xs">{{ infoMessage }}</span>
      <span v-if="shouldShowError" class="text-red-600 font-semibold text-xs">{{ errorMessage }}</span>
    </p>
  </div>
</template>