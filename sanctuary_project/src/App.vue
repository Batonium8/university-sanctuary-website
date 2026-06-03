<script setup>
import Header from "@/components/Header.vue";
import HeroSection from "@/components/HeroSection.vue";
import About from "@/components/About.vue";
import Services from "@/components/Services.vue";
import Doctors from "@/components/Doctors.vue";
import Rooms from "@/components/Rooms.vue";
import BookingForm from "@/components/BookingForm.vue";
import FAQ from "@/components/FAQ.vue";
import Footer from "@/components/Footer.vue";

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="grow">
      <router-view />
    </main>
    <Footer></Footer>

  </div>
</template>

<style scoped>
</style>
