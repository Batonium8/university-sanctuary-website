<script setup>

import HomeDetail from "@/components/HomeDetail.vue";
import BookingForm from "@/components/BookingForm.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <HomeDetail></HomeDetail>
  <div id="bookings">
    <BookingForm></BookingForm>
  </div>
</template>

<style scoped>

</style>
