    <script setup>
    import { useRoute } from 'vue-router';
    import { onMounted, ref } from 'vue';
    import ResultComponent from '@/components/form_components/ResultComponent.vue';

    const route = useRoute();

    const isLoading = ref(false);

    const offers = ref(null);

    import { ServiceAPI } from '@/service/apiService';

    onMounted(async () => {
        isLoading.value = true;

        try {
            const motorValues = route.query;
            const savedData = sessionStorage.getItem('formData');
            if (savedData) {
                const data = JSON.parse(savedData);
                const personPolicyValues = data.personPolicyholderValues;
                const ownerValues = data.personOwnerValues;
                const vehicleValues = data.vehicleValues;
                const pti = data.pti;

                sessionStorage.removeItem('formData');

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
                    <ResultComponent :loading="isLoading" :offers="offers"></ResultComponent>
                </div>
            </div>
        </div>
    </template>
