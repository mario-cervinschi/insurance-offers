<script setup lang="ts">
import { ref } from 'vue';
import MotorComponent from './form_components/MotorComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const motorViewRef = ref();

const onFindOffersClick = () => {
  if (!motorViewRef.value.validate()) return;
  router.push({ path: "/search", query: motorViewRef.value.getValues() })
};

</script>

<template>
  <div class="relative h-fit">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
      style="background-image: url('/src/assets/cars.jpg');"></div>

    <div class="bg-gradient-to-r from-blue-800 via-indigo-500/95 to-purple-400/60 z-10 py-20 relative">
      <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

      <div class="max-w-7xl w-full mx-auto grid xl:grid-cols-5 lg:grid-cols-4 grid-cols-1">
        <div class="xl:col-span-3 md:col-span-2 col-span-1 ml-24 lg:mr-0 lg:mt-16 -mt-10 mr-24">
          <h1 class="text-5xl font-bold lg:text-start text-center text-white drop-shadow-lg">Obtine rapid cele mai bune
            oferte de
            asigurare</h1>
          <p class="font-semibold mt-2 lg:text-start text-center text-white/90 drop-shadow">Compara si economiseste timp
            si bani, in doar <span class="font-bold text-2xl">3</span> pasi simpli!</p>
        </div>
        <div
          class="lg:col-span-2 col-span-1 sm:mx-20 mx-8 my-8 bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl py-6 px-6 shadow-2xl">
          <h2 class="text-3xl font-bold text-center text-white drop-shadow-md mb-6">Cauta oferte acum!</h2>
          <MotorComponent ref="motorViewRef" />
          <div class="flex justify-center">
            <button @click="onFindOffersClick"
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-200 rounded-lg py-3 px-16 shadow-lg hover:shadow-xl">
              Cauta Oferte
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>