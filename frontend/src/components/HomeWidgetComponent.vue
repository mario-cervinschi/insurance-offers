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

    <div class="bg-gradient-to-r from-dark-blue via-dark-blue/[0.98] to-medium-ocean/60 z-10 lg:pt-8 py-20 relative">
      <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

      <div class="max-w-7xl w-full mx-auto grid lg:grid-cols-12 grid-cols-1">
        <div
          class="xl:col-span-7 lg:col-span-6 col-span-1 ml-24 lg:mr-0 lg:my-8 -mt-10 mr-24 flex flex-col justify-center">
          <h1 class="text-5xl tracking-tighter font-jura font-bold lg:text-start text-center text-white drop-shadow-lg">
            Obtine rapid cele
            mai bune
            oferte de
            asigurare</h1>
          <p class="font-semibold tracking-tighter font-jura mt-2 lg:text-start text-center text-white/90 drop-shadow">
            Compara si economiseste timp
            si bani, in doar <span class="font-bold text-2xl">3</span> pasi simpli!</p>
        </div>
        <div
          class="xl:col-span-5 lg:col-span-6 col-span-1 sm:mx-20 mx-8 my-8 bg-card-dark-blue/60 backdrop-blur-md rounded-xl py-6 px-8 shadow-2xl">
          <h2 class="text-2xl font-jura font-bold text-center text-white drop-shadow-md mb-10 mt-6">Cauta oferte acum!
          </h2>
          <MotorComponent ref="motorViewRef" />
          <div class="flex justify-center">
            <button @click="onFindOffersClick"
              class="bg-transparent border-[1.2px] hover:bg-light-blue/10 border-light-blue/90 text-white font-jura font-semibold transition-all duration-200 rounded py-3 px-[34px] mb-6 shadow-lg hover:shadow-xl">
              Cauta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>