<script setup>

import Services from "@/components/Services.vue";
import HeroSection from "@/components/HeroSection.vue";
import Rooms from "@/components/Rooms.vue";
import Doctors from "@/components/Doctors.vue";
import About from "@/components/About.vue";
import FAQ from "@/components/FAQ.vue";
import BookingForm from "@/components/BookingForm.vue";
</script>

<template>
  <HeroSection main-title="" bg-image=""></HeroSection>
  <About></About>
  <Services></Services>
  <Doctors></Doctors>
  <Rooms></Rooms>
  <BookingForm></BookingForm>
  <FAQ></FAQ>
</template>

<style scoped>

</style>
