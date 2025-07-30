<script setup>
import apiLogin from '@/service/apiService'
import { ref, onMounted } from 'vue'

const isAuthenticated = ref(false)

onMounted(() => {
  const token = localStorage.getItem('authToken')
  isAuthenticated.value = !!token
})

async function checkAuth() {
  try {
    await apiLogin.get('/user')
    isAuthenticated.value = true
  } catch {
    isAuthenticated.value = false
  }
}

onMounted(() => {
  // checkAuth()
  const token = localStorage.getItem('authToken')
  isAuthenticated.value = !!token
})

function logout() {
  // apiLogin.post('/logout').then(() => {
  //   isAuthenticated.value = false
  //   window.location.reload()
  // })

  localStorage.removeItem('authToken')
  isAuthenticated.value = false
  window.location.reload()
}
</script>

<template>
  <nav class="flex justify-between items-center py-6 px-24 text-white bg-extra-dark-blue shadow-lg z-20">
    <div class="tracking-tight text-3xl font-jura font-bold">Asigurari Ieftine</div>
    <div class="flex space-x-12 items-center">
      <a href="/" class="hover:text-blue-300 transition font-jura font-bold">Home</a>
      <a href="#" class="hover:text-blue-300 transition font-jura font-bold">Despre</a>
      <a href="#" class="hover:text-blue-300 transition font-jura font-bold">Contact</a>

      <template v-if="!isAuthenticated">
        <a href="/login"
          class="hover:bg-blue-300/20 border-[1px] bg-blue-300/10 border-blue-300/30 rounded-md px-4 py-2 transition font-jura font-bold">
          Log In
        </a>
      </template>
      <template v-else>
        <a href="/profile"
          class="hover:bg-blue-300/20 border-[1px] bg-blue-300/10 border-blue-300/30 rounded-md px-4 py-2 transition font-jura font-bold">
          Profil
        </a>
        <button @click="logout"
          class="ml-4 hover:bg-red-300/20 border-[1px] bg-red-300/10 border-red-300/30 rounded-md px-4 py-2 transition font-jura font-bold">
          Log Out
        </button>
      </template>
    </div>
  </nav>
</template>
