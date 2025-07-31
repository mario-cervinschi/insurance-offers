<script setup>
import { ref, onMounted } from 'vue';
import { ServiceAPI } from '@/service/apiService';
import LoadingComponent from '@/components/LoadingComponent.vue';

const isLoading = ref(true);
const vehicles = ref([]);
const currentUser = ref({
  email: 'comenzi1750409231@roviniete.ro',
  cnp: '1940928205567'
});

const fetchUserVehicles = async () => {
  try {
    isLoading.value = true;
    const response = await ServiceAPI.fetchUserVehicles(currentUser.value);
    vehicles.value = response.vehicles || [];
  } catch (error) {
    console.error('Error fetching user vehicles:', error);
    vehicles.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserVehicles();
});
</script>

<template>
  <div class="bg-dark-blue">
    <!-- Background overlay -->
    <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

    <!-- Header -->
    <div class="relative z-10 pt-8 pb-6">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl font-bold text-white drop-shadow-lg mb-2 font-jura tracking-tighter">
          Masinile mele
        </h1>
        <p class="text-white/90 drop-shadow font-jura tracking-tighter">
          Vizualizati vehiculele inregistrate pe acest cont
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 pb-12">
      <div class="max-w-4xl mx-auto px-6">
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <LoadingComponent label="Se incarca masinile..." />
        </div>

        <div v-else-if="vehicles.length === 0" class="text-center py-12">
          <div
            class="bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl py-8 px-6 shadow-2xl border border-white/10">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2 font-jura tracking-tighter">
              Nicio masina inregistrata
            </h3>
            <p class="text-gray-300 font-jura tracking-tighter">
              Nu am gasit masini inregistrate pentru acest utilizator.
            </p>
          </div>
        </div>

        <div v-else>
          <div
            class="bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-white mb-4 font-jura tracking-tighter">
                Vehicule inregistrate ({{ vehicles.length }})
              </h2>
              <div class="grid gap-4 md:grid-cols-2">
                <div v-for="vehicle in vehicles" :key="vehicle.vin"
                     class="bg-white/10 text-white rounded-xl p-4 shadow-lg border border-white/10">
                  <h3 class="text-xl font-semibold font-jura tracking-tight">{{ vehicle.brand }} {{ vehicle.commercialModel }}</h3>
                  <p class="text-sm text-white/70 font-jura">Numar: {{ vehicle.licensePlate }}</p>
                  <p class="text-sm text-white/70 font-jura">VIN: {{ vehicle.vin }}</p>
                  <p class="text-sm text-white/70 font-jura">An: {{ vehicle.yearOfConstruction }}</p>
                  <p class="text-sm text-white/70 font-jura">Putere: {{ vehicle.enginePower }} CP</p>
                  <p class="text-sm text-white/70 font-jura">Greutate: {{ vehicle.totalWeight }} kg</p>
                  <p class="text-sm text-white/70 font-jura">Expira la: {{ vehicle.endOfCurrentRegistration }} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
