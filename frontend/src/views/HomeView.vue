<script setup>
import HomeWidgetComponent from '@/components/HomeWidgetComponent.vue';
import { onMounted, ref } from 'vue';

const isPageLoading = ref(true);

onMounted(() => {
    setTimeout(() => {
        isPageLoading.value = false;
    }, 1000);
});
</script>

<template>
    <div class="mb-auto">
        <Transition name="fade">
            <div v-if="isPageLoading"
                class="fixed inset-0 bg-slate-900 flex items-center justify-center z-[9999] flex-col">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
                        width="80" height="230" style="shape-rendering: auto; display: block; background: transparent;"
                        xmlns:xlink="http://www.w3.org/1999/xlink" class="mx-auto">
                        <g>
                            <path stroke="none" fill="#b3f5d4" d="M21 50A29 29 0 0 0 79 50A29 32.2 0 0 1 21 50">
                                <animateTransform values="0 50 51.6;360 50 51.6" keyTimes="0;1" repeatCount="indefinite"
                                    dur="0.36900369003690037s" type="rotate" attributeName="transform">
                                </animateTransform>
                            </path>
                            <g></g>
                        </g>
                    </svg>
                </div>
            </div>
        </Transition>

        <Transition name="fade" mode="out-in">
            <HomeWidgetComponent v-if="!isPageLoading"></HomeWidgetComponent>
        </Transition>
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
</style>