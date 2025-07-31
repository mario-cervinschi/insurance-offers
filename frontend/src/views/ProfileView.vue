<script setup>
import { ref, onMounted } from 'vue'
import apiLogin from '@/service/apiService'
import mockApiLogin from '@/service/mock/mockApiLogin'

const user = ref(null)
const loading = ref(true)
const error = ref('')

async function fetchUser() {
    try {
        // const res = await apiLogin.get('/user')
        const res = await mockApiLogin.get('/user')
        user.value = res.data
    } catch (err) {
        error.value = 'Nu am putut încărca datele userului.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchUser()
})
</script>

<template>
    <div class="p-8 bg-dark-blue h-screen">
        <div class="fixed inset-0 w-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

        <div class="flex flex-col relative max-w-4xl mx-auto h-full justify-center">
            <h2 class="text-5xl font-bold tracking-tighter mb-6 font-jura text-white/95">Profilul meu</h2>

            <div v-if="loading">Se încarcă...</div>
            <div v-else-if="error">{{ error }}</div>
            <div v-else>
                <p class="mb-4 text-xl font-jura text-white/95">Bun venit, <strong>{{ user?.name }}</strong>!</p>

                <div class="space-x-4">
                    <button @click="$router.push('/offers')"
                        class="bg-transparent border-[1.2px] hover:bg-light-blue/10 border-light-blue/90 text-white font-jura font-semibold transition-all duration-200 rounded py-3 px-[34px] shadow-lg hover:shadow-xl">
                        Ofertele mele</button>
                    <button @click="$router.push('/vehicles')"
                        class="bg-transparent border-[1.2px] hover:bg-light-blue/10 border-light-blue/90 text-white font-jura font-semibold transition-all duration-200 rounded py-3 px-[34px] shadow-lg hover:shadow-xl">Vehiculele
                        mele</button>
                </div>
            </div>
        </div>

    </div>
</template>