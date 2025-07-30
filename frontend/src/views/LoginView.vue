<script setup lang="ts">
import InputComponent from '@/components/form_inputs/InputComponent.vue';
import router from '@/router';
import apiLogin from '@/service/apiService';
import { ValidationService } from '@/service/validationService';
import { ref, watch } from 'vue';

const showLoginPassword = ref(false);
const email = ref('');
const password = ref('');

const emailInputRef = ref();
const passwordInputRef = ref();

const emailError = ref('');
const passwordError = ref('');

const login = async () => {
    emailError.value = ValidationService.validateEmail(email.value).message;

    if (!password.value) {
        passwordError.value = 'Camp necesar';
    } else {
        passwordError.value = '';
    }

    emailInputRef.value?.triggerValidation();
    passwordInputRef.value?.triggerValidation();

    if (emailError.value || passwordError.value) {
        return;
    }

    try {

        localStorage.setItem('authToken', 'fake-jwt-token')
        window.location.reload()

        // cookie csrf
        // await apiLogin.get('/.../csrf-cookie');

        // await apiLogin.post('/login', {
        //     email: email.value,
        //     password: password.value
        // });

        router.push('/profile');
    } catch (err) {
        console.log(err);
    }
}

watch(email, (newEmail) => {
    emailError.value = ValidationService.validateEmail(newEmail).message;
})

watch(password, (newPassword) => {
    passwordError.value = newPassword != '' ? '' : 'Camp necesar';
})

</script>

<template>
    <div class="bg-dark-blue h-screen">
        <div class="fixed inset-0 w-screen bg-[url('/assets/diagonal-lines.svg')] opacity-[10%] z-0"></div>

        <div
            class="relative max-w-md mx-auto bg-gradient-to-br from-medium-ocean/15 via-medium-ocean/10 to-medium-ocean/5 font-jura backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 m-8 hover:border-white/30 transition-all duration-300">
            <h3 class="font-jura font-bold text-center mb-4 text-3xl text-gray-200">Conecteaza-te</h3>
            <!-- Email -->
            <InputComponent ref="emailInputRef" labelData="Email" id="emailInput" v-model="email"
                :error-message="emailError" />

            <!-- Password with toggle -->
            <div class="relative">
                <InputComponent ref="passwordInputRef" :type="showLoginPassword ? 'text' : 'password'"
                    labelData="Parola" v-model="password" id="passwordInput" :error-message="passwordError" />
                <button type="button" @click="showLoginPassword = !showLoginPassword"
                    class="absolute right-3 top-[30px] -tra -translate-y-1/2 text-light-blue hover:text-white transition"
                    aria-label="Toggle password visibility">
                    <svg v-if="showLoginPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                </button>
            </div>


            <!-- Login button -->
            <div class="flex justify-center">

                <button @click="login"
                    class="w-full bg-transparent border-[1.2px] hover:bg-light-blue/10 border-light-blue/90 text-white font-jura font-semibold transition-all duration-200 rounded py-3 px-[34px] shadow-lg hover:shadow-xl">
                    Login
                </button>

            </div>

        </div>
    </div>
</template>
