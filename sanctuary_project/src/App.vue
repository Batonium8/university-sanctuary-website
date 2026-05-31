<script setup>
import Header from "@/components/Header.vue";
import HeroSection from "@/components/HeroSection.vue";
import About from "@/components/About.vue";
import ServicesCard from "@/components/ServicesCard.vue";
import Services from "@/components/Services.vue";
import Doctors from "@/components/Doctors.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <HeroSection main-title="" bg-image=""></HeroSection>
    <About></About>
    <Services></Services>
    <Doctors></Doctors>
    <main class="grow">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
