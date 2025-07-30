<script setup>
import { ref, onMounted, computed } from 'vue';
import { ServiceAPI } from '@/service/apiService';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ResultComponent from '@/components/form_components/ResultComponent.vue';

const isLoading = ref(true);
const offers = ref([]);
const pdfUrl = ref('');
const isLoadingOffer = ref(false);

// Mock user data - this will be replaced with actual authentication
const currentUser = ref({
    email: 'comenzi1750409231@roviniete.ro',
    cnp: '1940928205567'
});

const validOffers = computed(() => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000));

    return offers.value.filter(offer => {
        // Check if offer is valid and not older than 10 days
        const offerDate = new Date(offer.createdAt || offer.date);
        return offer.isValid && offerDate > tenDaysAgo;
    });
});

const getPdfUrl = (pdf) => {
    pdfUrl.value = pdf;
};

const isLoadingOfferPdf = (loadingState) => {
    isLoadingOffer.value = loadingState;
};

const closePdf = () => {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
};

const fetchUserOffers = async () => {
    try {
        isLoading.value = true;
        // This will be replaced with actual API call
        const response = await ServiceAPI.fetchUserOffers(currentUser.value);
        offers.value = response.offers || [];
    } catch (error) {
        console.error('Error fetching user offers:', error);
        offers.value = [];
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchUserOffers();
});
</script>

<template>
    <div class="bg-gradient-to-br from-blue-800 to-blue-800 via-indigo-500">
        <!-- Diagonal lines background overlay -->
        <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

        <!-- Header -->
        <div class="relative z-10 pt-8 pb-6">
            <div class="max-w-4xl mx-auto px-6">
                <h1 class="text-4xl font-bold text-white drop-shadow-lg mb-2 font-jura tracking-tighter">
                    Ofertele mele
                </h1>
                <p class="text-white/90 drop-shadow font-jura tracking-tighter">
                    Gestionati si vizualizati ofertele de asigurare
                </p>
            </div>
        </div>

        <!-- Offers content -->
        <div class="relative z-10 pb-12">
            <div class="max-w-4xl mx-auto px-6">
                <div v-if="isLoading" class="flex justify-center items-center py-12">
                    <LoadingComponent label="Se incarca ofertele..."></LoadingComponent>
                </div>

                <div v-else-if="validOffers.length === 0" class="text-center py-12">
                    <div class="bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl py-8 px-6 shadow-2xl border border-white/10">
                        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="text-xl font-semibold text-white mb-2 font-jura tracking-tighter">
                            Nu aveti oferte active
                        </h3>
                        <p class="text-gray-300 font-jura tracking-tighter">
                            Ofertele expira dupa 10 zile de la creare. Creeaza o noua oferta pentru a vedea rezultatele aici.
                        </p>
                        <router-link
                            to="/"
                            class="inline-block mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Creeaza oferta
                        </router-link>
                    </div>
                </div>

                <div v-else>
                    <div class="bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-white mb-4 font-jura tracking-tighter">
                                Oferte active ({{ validOffers.length }})
                            </h2>
                            <p class="text-gray-300 mb-6 font-jura tracking-tighter">
                                Ofertele sunt valabile timp de 10 zile de la creare
                            </p>

                            <ResultComponent
                                @change-pdf="getPdfUrl"
                                @loading-pdf="isLoadingOfferPdf"
                                :loading="false"
                                :offers="validOffers"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- PDF Modal -->
    <div v-if="pdfUrl || isLoadingOffer"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
        <LoadingComponent v-if="isLoadingOffer" label="Se incarca oferta..."></LoadingComponent>
        <div v-if="!isLoadingOffer"
            class="flex-col relative w-[80%] max-w-[1000px] h-[85%] flex items-center justify-center">
            <!-- Close button -->
            <button @click="closePdf"
                class="absolute top-2 -right-12 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <iframe :src="pdfUrl" frameborder="0" class="w-full h-full rounded-md"></iframe>
        </div>
    </div>
</template>
