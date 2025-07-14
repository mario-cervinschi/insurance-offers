<script setup>
import PersonComponent from '@/components/form_components/PersonComponents.vue';
import VehicleComponent from '@/components/form_components/VehicleComponent.vue';
import RadioComponent from '@/components/form_inputs/RadioComponent.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const motorJSON = ref('');
const currentStep = ref(1);

const copyValues = ref(false);

const stepsMeaning = { 1: "Detalii asigurare", 2: "Detalii proprietar", 3: "Detalii vehicul" };

const personPolicyHolderViewRef = ref();
const personOwnerViewRef = ref();
const vehicleViewRef = ref();

const personPolicyholderValues = ref({});
const personOwnerValues = ref({});
let vehicleValues = {};

const validateQueryString = (query) => {
    if (!query.startDate || !query.termTime || !query.installmentCount || !query.comissionPercentLimit) {
        router.push({ path: '/' });
    }
};

const validateQueryParameters = (query) => {
    let hasInvalidParameters = false;
    if (new Date(query.startDate) < new Date()) {
        hasInvalidParameters = true;
    }

    if (query.termTime < 1 || query.termTime > 12) {
        hasInvalidParameters = true;
    }

    if (![1, 2, 4, 12].includes(+query.installmentCount)) {
        hasInvalidParameters = true;
    }

    if (hasInvalidParameters) {
        router.push({ path: '/' });
    }
}

const updateUrlWithStep = (step) => {
    const currentQuery = { ...route.query };
    currentQuery.step = step;

    router.replace({
        path: route.path,
        query: currentQuery
    });
};

const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
        currentStep.value = step;
        updateUrlWithStep(step);
    }
};

const goToStepTwo = () => {
    if (!personPolicyHolderViewRef.value.validate()) {
        return;
    }
    personPolicyholderValues.value = personPolicyHolderViewRef.value.getValues();
    goToStep(2);
}

const goToStepThree = () => {
    if (copyValues.value) {
        if (!personOwnerViewRef.value.validate()) {
            return;
        }
        personOwnerValues.value = personOwnerViewRef.value.getValues();
    } else {
        personOwnerValues.value = { ...personPolicyholderValues.value };
    }
    goToStep(3);
}

const goGetOffers = () => {
    if (!vehicleViewRef.value.validate()) {
        return;
    }

    vehicleValues = vehicleViewRef.value.getValues();
    vehicleValues.owner = personOwnerValues;

    const pti = vehicleViewRef.value.getPTI();

    const dataToPass = {
        personPolicyholderValues: personPolicyholderValues.value,
        personOwnerValues: personOwnerValues.value,
        vehicleValues,
        pti
    };

    sessionStorage.setItem('formData', JSON.stringify(dataToPass));

    router.push({
        path: '/result',
        query: {
            startDate: motorJSON.value.startDate,
            termTime: motorJSON.value.termTime,
            installmentCount: motorJSON.value.installmentCount,
        }
    });

};

const goBack = () => {
    if (currentStep.value > 1) {
        goToStep(currentStep.value - 1);
    }
};

watch(() => route.query.step, (newStep) => {
    if (newStep) {
        const step = parseInt(newStep);
        if (step >= 1 && step <= 3) {
            currentStep.value = step;
        }
    }
}, { immediate: true });

onMounted(() => {
    let query = route.query;
    const hasValidString = validateQueryString(query);
    const hasValidParameters = validateQueryParameters(query);

    motorJSON.value = query;

    const stepFromUrl = parseInt(query.step) || 1;

    if (!hasValidString || !hasValidParameters || stepFromUrl > 1) {
        goToStep(1);
    } else {
        currentStep.value = stepFromUrl;
        updateUrlWithStep(stepFromUrl);
    }
});
</script>

<template>
    <div class="bg-gradient-to-br from-blue-800 to-blue-800 via-indigo-500">
        <div class="fixed inset-0 w-screen h-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>
        <div class="relative z-10">
            <div class="relative z-10 pt-8 pb-12">

                <div class="max-w-4xl mx-auto px-6 mb-8">
                    <div
                        class="bg-gradient-to-r from-slate-900/40 via-blue-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl py-6 px-8 shadow-2xl border border-white/10">
                        <div class="flex justify-around">
                            <div class="flex flex-col items-center">
                                <div class="flex rounded-full border-2 w-12 h-12 justify-center items-center transition-all duration-300 cursor-pointer"
                                    :class="currentStep >= 1 ? 'border-blue-400 bg-blue-500/20 text-white font-bold shadow-lg' : 'border-gray-400/50 text-gray-400'"
                                    @click="goToStep(1)">
                                    <p class="text-sm">1</p>
                                </div>
                                <p class="font-semibold mt-2 text-sm transition-all duration-300 cursor-pointer"
                                    :class="currentStep >= 1 ? 'text-white drop-shadow-sm' : 'text-gray-400'"
                                    @click="goToStep(1)">
                                    {{ stepsMeaning[1] }}
                                </p>
                            </div>

                            <div class="flex items-center">
                                <div class="w-24 h-0.5 transition-all duration-300"
                                    :class="currentStep >= 2 ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gray-400/30'">
                                </div>
                            </div>

                            <div class="flex flex-col items-center">
                                <div class="flex rounded-full border-2 w-12 h-12 justify-center items-center transition-all duration-300 cursor-pointer"
                                    :class="currentStep >= 2 ? 'border-blue-400 bg-blue-500/20 text-white font-bold shadow-lg' : 'border-gray-400/50 text-gray-400'"
                                    @click="currentStep >= 2 ? goToStep(2) : null">
                                    <p class="text-sm">2</p>
                                </div>
                                <p class="font-semibold mt-2 text-sm transition-all duration-300"
                                    :class="currentStep >= 2 ? 'text-white drop-shadow-sm cursor-pointer' : 'text-gray-400'"
                                    @click="currentStep >= 2 ? goToStep(2) : null">
                                    {{ stepsMeaning[2] }}
                                </p>
                            </div>

                            <div class="flex items-center">
                                <div class="w-24 h-0.5 transition-all duration-300"
                                    :class="currentStep >= 3 ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gray-400/30'">
                                </div>
                            </div>

                            <div class="flex flex-col items-center">
                                <div class="flex rounded-full border-2 w-12 h-12 justify-center items-center transition-all duration-300 cursor-pointer"
                                    :class="currentStep >= 3 ? 'border-blue-400 bg-blue-500/20 text-white font-bold shadow-lg' : 'border-gray-400/50 text-gray-400'"
                                    @click="currentStep >= 3 ? goToStep(3) : null">
                                    <p class="text-sm">3</p>
                                </div>
                                <p class="font-semibold mt-2 text-sm transition-all duration-300"
                                    :class="currentStep >= 3 ? 'text-white drop-shadow-sm cursor-pointer' : 'text-gray-400'"
                                    @click="currentStep >= 3 ? goToStep(3) : null">
                                    {{ stepsMeaning[3] }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto px-6">
                    <div
                        class="bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-slate-900/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                        <Transition name="slide" mode="out-in">
                            <div v-if="currentStep === 1" key="step1" class="p-8">
                                <h1 class="font-bold text-4xl text-white drop-shadow-lg mb-8">Detalii asigurare</h1>
                                <PersonComponent :initialValues="personPolicyholderValues" componentId="person_info"
                                    ref="personPolicyHolderViewRef">
                                </PersonComponent>
                                <div class="flex justify-center pb-6">
                                    <button @click="goToStepTwo"
                                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 px-16 shadow-lg hover:shadow-xl transition-all duration-300">
                                        Continua
                                    </button>
                                </div>
                            </div>

                            <div v-else-if="currentStep === 2" key="step2" class="p-8">
                                <h1 class="font-bold text-4xl text-white drop-shadow-lg mb-8">Detalii proprietar</h1>
                                <p class="text-xl font-semibold text-white">Date diferite pentru proprietar?</p>
                                <div class="flex flex-row">
                                    <RadioComponent v-model="copyValues" :options="[
                                        { label: 'Nu', value: false },
                                        { label: 'Da', value: true }
                                    ]" name="copy" :dark="true" />
                                </div>

                                <Transition name="fade" mode="out-in">
                                    <div v-if="copyValues" key="owner-form">
                                        <PersonComponent :initialValues="personOwnerValues" componentId="owner_info"
                                            ref="personOwnerViewRef"></PersonComponent>
                                    </div>
                                </Transition>

                                <div class="flex justify-between items-center pb-6">
                                    <button @click="goBack"
                                        class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg py-3 px-16 shadow-lg hover:shadow-xl transition-all duration-300">
                                        Înapoi
                                    </button>
                                    <button @click="goToStepThree"
                                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 px-16 shadow-lg hover:shadow-xl transition-all duration-300">
                                        Continua
                                    </button>
                                </div>
                            </div>

                            <div v-else-if="currentStep === 3" key="step3" class="p-8">
                                <h1 class="font-bold text-4xl text-white drop-shadow-lg mb-8">Detalii vehicul</h1>
                                <VehicleComponent ref="vehicleViewRef"></VehicleComponent>
                                <div class="flex justify-between items-center pb-6">
                                    <button @click="goBack"
                                        class="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg py-3 px-16 shadow-lg hover:shadow-xl transition-all duration-300">
                                        Înapoi
                                    </button>
                                    <button @click="goGetOffers"
                                        class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 px-16 shadow-lg hover:shadow-xl transition-all duration-300">
                                        Vezi ofertele!
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>