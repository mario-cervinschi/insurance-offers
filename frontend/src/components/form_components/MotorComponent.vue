<script setup>
import { ref, watch } from 'vue';
import InputComponent from '../form_inputs/InputComponent.vue';
import SelectorComponent from '../form_inputs/SelectorComponent.vue';

const startDate = ref("");
const termTime = ref(12);
const installmentCount = ref(1);
const comissionPercentLimit = ref(7);
const errorDate = ref("Camp necesar");

const validate = () => {
  let isError = false;
  if (!startDate.value) { isError = true; }
  if (new Date(startDate.value) < new Date()) { isError = true; }
  if (!termTime.value) { isError = true; }
  if (!installmentCount.value) { isError = true; }

  return !isError;
};


watch(startDate, (changedDate) => {
  if (!changedDate) {
    errorDate.value = "Camp necesar";
  } else if (new Date(changedDate) < new Date()) {
    errorDate.value = "Nu poti avea o asigurare in trecut";
  } else {
    errorDate.value = "";
  }
});

const getValues = () => ({
  startDate: startDate.value,
  termTime: termTime.value,
  installmentCount: installmentCount.value,
  comissionPercentLimit: comissionPercentLimit.value
});

defineExpose({
  getValues,
  validate
});


</script>

<template>
  <div class="m-4">
    <div class="grid grid-cols-1 gap-3">
      <div class="flex flex-col">
        <InputComponent id="startDate" labelData="Data start" type="date" v-model="startDate"
          :errorMessage="errorDate.valueOf()"></InputComponent>
        <!-- <p class="absolute text-red-600 font-thin text-xs tracking-wider mt-[62px]">{{ errorDate }}</p> -->
      </div>

      <div class="flex flex-col">
        <InputComponent id="termTime" labelData="Durata (luni)" type="number" v-model="termTime" :min="1" :max="12">
        </InputComponent>
        <!-- <p v-if="termTime.valueOf() === ''" class="absolute text-red-600 font-thin text-xs tracking-wider mt-[62px]">Camp necesar</p> -->
      </div>

      <div class="flex flex-col">
        <SelectorComponent id="installmentCount" labelData="Numar rate" :options="[{ label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '4', value: 4 },
        { label: '12', value: 12 }]" v-model="installmentCount">
        </SelectorComponent>
        <!-- <p v-if="installmentCount.valueOf() === ''" class="absolute text-red-600 font-thin text-xs tracking-wider mt-[62px]">Camp necesar</p> -->
      </div>
    </div>
  </div>
</template>