<script setup>
import Header from "@/components/Header.vue";
import HeroSection from "@/components/HeroSection.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <HeroSection main-title="" bg-image=""></HeroSection>
    <main class="flex-grow">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
