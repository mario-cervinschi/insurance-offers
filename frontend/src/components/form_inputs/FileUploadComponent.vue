<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  labelData: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB default
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

const emit = defineEmits(['update:modelValue', 'fileSelected']);

const isTouched = ref(false);
const isFocused = ref(false);
const selectedFile = ref(null);
const previewUrl = ref('');
const dragOver = ref(false);
const fileInput = ref(null);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
  isTouched.value = true;
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    emit('update:modelValue', null);
    return;
  }

  // Check file size
  if (file.size > props.maxSize) {
    emit('update:modelValue', null);
    return;
  }

  selectedFile.value = file;
  emit('update:modelValue', file);
  emit('fileSelected', file);

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleDrop = (event) => {
  event.preventDefault();
  dragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    validateAndSetFile(files[0]);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = () => {
  dragOver.value = false;
};

const handleClick = () => {
  fileInput.value?.click();
};

const removeFile = () => {
  selectedFile.value = null;
  previewUrl.value = '';
  emit('update:modelValue', null);
};

const triggerValidation = () => {
  isTouched.value = true;
};

const shouldShowError = computed(() => {
  return isTouched.value && props.errorMessage !== '';
});

const shouldShowInfo = computed(() => {
  return !shouldShowError.value && props.infoMessage !== '';
});

defineExpose({
  triggerValidation
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-white tracking-wide font-medium">{{ labelData }}</label>
    
    <div 
      :id="id"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="[
        'border-2 border-dashed rounded-lg p-4 transition-colors duration-200 cursor-pointer',
        dragOver ? 'border-blue-400 bg-blue-50/20' : 'border-gray-300',
        dark ? 'bg-white/10 hover:bg-white/20' : 'bg-white/80 hover:bg-white/90'
      ]"
    >
      <div v-if="!selectedFile" class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-2 text-sm text-gray-400">
          <span class="font-medium text-blue-400 hover:text-blue-300">Click to upload</span>
          or drag and drop
        </p>
        <p class="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
        <input
          ref="fileInput"
          type="file"
          :accept="accept"
          @change="handleFileSelect"
          class="hidden"
        />
      </div>
      
      <div v-else class="text-center">
        <div class="relative inline-block">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="max-h-32 max-w-full rounded-lg object-contain"
          />
          <button
            @click="removeFile"
            class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-400">{{ selectedFile.name }}</p>
        <button
          @click="removeFile"
          class="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Remove file
        </button>
      </div>
    </div>
    
    <p class="text-xs font-thin min-h-[1.2rem]">
      <span v-if="shouldShowInfo" class="text-black font-normal text-xs">{{ infoMessage }}</span>
      <span v-if="shouldShowError" class="text-red-600 font-semibold text-xs">{{ errorMessage }}</span>
    </p>
  </div>
</template> 