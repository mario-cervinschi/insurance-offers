<script setup>
import { RouterView } from 'vue-router'
import NavigationComponent from './components/NavigationComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <NavigationComponent></NavigationComponent>
    <RouterView/>
    <FooterComponent></FooterComponent>
  </div>

</template>
