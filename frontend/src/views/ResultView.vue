<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ResultComponent from '@/components/form_components/ResultComponent.vue';
import { useFormStore } from '@/service/formStore';

const route = useRoute();
const router = useRouter();

const formStore = useFormStore();

const isLoading = ref(false);
const isLoadingOffer = ref(false);

const offers = ref(null);

const pdfUrl = ref('');

import { ServiceAPI } from '@/service/apiService';
import LoadingComponent from '@/components/LoadingComponent.vue';

const getPdfUrl = (pdf) => {
    pdfUrl.value = pdf;
}

const isLoadingOfferPdf = (loadingState) => {
    isLoadingOffer.value = loadingState;
}

const closePdf = () => {
    URL.revokeObjectURL(pdfUrl.value)
    pdfUrl.value = '';
};

const goBackToForm = () => {
    const personPolicyValues = formStore.personPolicyholderValues;

    formStore.cityCode = personPolicyValues.address.cityCode;

    router.push({
        path: '/search',
        query: {
            ...route.query,
            step: 1,
        },
    });
};

onMounted(async () => {
    isLoading.value = true;

    try {
        const motorValues = route.query;

        const personPolicyValues = formStore.personPolicyholderValues;
        const ownerValues = formStore.personOwnerValues;
        const vehicleValues = formStore.vehicleValues;
        const pti = formStore.pti;

        if (personPolicyValues && ownerValues && vehicleValues && pti) {
            vehicleValues.owner = ownerValues;

            const product = {
                motor: motorValues,
                policyholder: personPolicyValues,
                vehicle: vehicleValues,
            };

            if (pti !== "") {
                product.additionalData = {
                    product: {
                        vehicle: pti
                    }
                };
            } else {
                product.additionalData = [];
            }

            offers.value = await ServiceAPI.fetchOffers(product);
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});

</script>

<template>
    <div class="bg-gradient-to-br from-blue-800 to-blue-800 via-indigo-500">
        <!-- Diagonal lines background overlay -->
        <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

        <!-- Result cards -->
        <div class="relative z-10 pt-8 pb-12">
            <div class="max-w-4xl mx-auto px-6 mb-8">
                <ResultComponent @change-pdf="getPdfUrl" @loading-pdf="isLoadingOfferPdf" @go-back="goBackToForm"
                    :loading="isLoading" :offers="offers"></ResultComponent>
            </div>
        </div>
    </div>

    <div v-if="pdfUrl || isLoadingOffer"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
        <LoadingComponent v-if="isLoadingOffer" label="Se incarca oferta..."></LoadingComponent>
        <div v-if="!isLoadingOffer" class="relative w-[80%] max-w-[1000px] h-[85%] flex items-center justify-center">
            <!-- Close button -->
            <button @click="closePdf"
                class="absolute top-2 -right-12 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <iframe v-if="pdfUrl" :src="pdfUrl" frameborder="0" class="w-full h-full rounded-md"></iframe>
        </div>
    </div>
</template>
