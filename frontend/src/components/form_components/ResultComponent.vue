<script setup>
import { ServiceAPI } from '@/service/apiService';
import { useOfferStore } from '@/service/offerStore';
import { ref, watch } from 'vue';

const emit = defineEmits(['changePdf'], ['loadingPdf']);

const insurers = { "asirom": "Asirom", "allianz": "Allianz", "axeria": "Axeria", "generali": "Generali", "groupama": "Groupama", "hellas_autonom": "Hellas Autonom", "hellas_nextins": "Hellas Nextins", "omniasig": "Omniasig", "grawe": "Grawe", "eazy_insure": "Eazy Insure" }

const pdfUrl = ref('');

const offerStore = useOfferStore();

const onClickOffer = async (offerId, offerPrice) => {
    emit('loadingPdf', true);
    try {
        const offer = await ServiceAPI.fetchOfferPdf(offerId);
        const content = offer[0].content;

        offerStore.setOfferId(offerId);
        offerStore.setAmount(offerPrice);

        var url = 'data:application/pdf;base64,' + content;
        var blobUrl;
        fetch(url)
            .then(res => res.blob())
            .then(URL.createObjectURL)
            .then((ret) => { blobUrl = ret; return blobUrl; })
            .then((res) => pdfUrl.value = res);

        emit('loadingPdf', false);
    } catch (error) {
        emit('loadingPdf', false);
        return;
    }
}

watch(pdfUrl, (onNewPdf) => {
    emit('changePdf', onNewPdf);
})

defineProps({
    loading: Boolean,
    offers: Object,
});
</script>

<template>
    <div>
        <template v-if="loading">
            <div
                class="bg-gradient-to-r from-slate-900/60 via-blue-950/50 to-slate-900/50 backdrop-blur-md rounded-2xl py-6 px-8 shadow-2xl border border-white/10 mb-2 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="230"
                    height="230" style="shape-rendering: auto; display: block; background: transparent;"
                    xmlns:xlink="http://www.w3.org/1999/xlink" class="mx-auto">
                    <g>
                        <path stroke="none" fill="#b3f5d4" d="M21 50A29 29 0 0 0 79 50A29 32.2 0 0 1 21 50">
                            <animateTransform values="0 50 51.6;360 50 51.6" keyTimes="0;1" repeatCount="indefinite"
                                dur="0.36900369003690037s" type="rotate" attributeName="transform"></animateTransform>
                        </path>
                        <g></g>
                    </g><!-- [ldio] generated by https://loading.io -->
                </svg>
                <p class="mt-2 text-white">Cautam oferte...</p>
            </div>
        </template>
        <template v-else>
            <div v-for="offer in offers"
                class="bg-gradient-to-tr from-slate-900/80 via-blue-950/60 to-slate-900/80 backdrop-blur-md rounded-2xl py-6 px-8 shadow-2xl border border-white/10 mb-2">
                <div v-if="offer.error === true">
                    <p class="text-5xl font-semibold text-white">{{ insurers[offer.businessName] ||
                        insurers[offer.business] }} </p>

                    <p v-if="offer.message && offer.message !== 'VALIDATION_ERROR'"
                        class="text-red-500 font-semibold mt-4">{{ offer.message }}</p>
                    <div v-else class="mt-4 text-yellow-300">Campuri necesare pentru acest asigurator:
                        <p v-for="err in offer.data" class="ml-4 text-white">{{ err[0] }}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="flex justify-between mb-6">
                        <div>
                            <p class="text-5xl font-semibold text-white">{{ insurers[offer.businessName] ||
                                insurers[offer.business] }}
                            </p>
                            <div class="flex flex-row mt-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                    class="h-5 mr-1 mt-0.5 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <p class="text-white">Perioada: {{ offer.startDate }} - {{ offer.endDate }}</p>
                            </div>
                        </div>
                        <div
                            class="from-slate-900/40 max-h-fit via-blue-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl py-3 px-4 shadow border border-white/10">
                            <p class="text-xl text-white">{{ offer.premiumAmount }} {{ offer.currency }} + TVA</p>
                            <p class="text-end text-sm text-white">{{ offer.premiumAmountNet }} {{ offer.currency }}</p>
                        </div>
                    </div>
                    <div class="flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-5 mr-1 mt-0.5 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                        <p class="text-white">Clasa bonus {{ offer.bonusMalusClass }}</p>
                    </div>
                    <div class="flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="h-5 mr-1 mt-0.5 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p class="text-white">Excluse green card: {{ offer.greenCardExclusions }}</p>


                    </div>
                    <br>
                    <div class="flex justify-center">
                        <button @click="onClickOffer(offer.offerId, offer.premiumAmount)"
                            class="py-3 px-6 bg-gradient-to-bl from-slate-900/40 via-blue-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl shadow border border-white/10 text-white">Vezi
                            oferta!</button>
                    </div>

                    <!-- <p class="text-end text-white">ID Oferta Asigurator: {{ offer.providerOfferCode }}</p> -->
                    <p class="text-center font-thin text-xs text-white">Oferta valabila pana pe data de: {{
                        offer.offerExpiryDate }}</p>

                </div>
            </div>
        </template>
        <div class="flex justify-center">
            <button @click="$emit('go-back')"
                class="text-white text-xl bg-red-500 hover:bg-red-600 rounded-3xl px-16 py-4">
                Inapoi
            </button>
        </div>
    </div>
</template>
