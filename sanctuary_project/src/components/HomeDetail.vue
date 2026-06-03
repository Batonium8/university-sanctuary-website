<template>
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#EFE6D7] !pt-32 min-h-screen">
    <div class="max-w-6xl mx-auto">

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-[#142C12] text-lg animate-pulse">
          Загрузка информации о номере...
        </p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-red-600 text-lg text-center mb-4">
          {{ error }}
        </p>
        <button
          @click="loadHome(route.params.id)"
          class="font-['Montserrat'] font-medium text-white px-6 py-2.5 rounded-md text-sm cursor-pointer transition-all hover:opacity-90 bg-[#777C5C]"
        >
          Попробовать снова
        </button>
      </div>

      <div v-else-if="home" class="flex flex-col lg:flex-row gap-8 lg:gap-12">

        <div class="lg:w-1/2">

          <div v-if="home.images && home.images.length" class="rounded-lg overflow-hidden mb-3 bg-[#D9D0C1]">
            <img
              :src="home.images[0]"
              :alt="home.name"
              class="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>

          <div v-if="home.images && home.images.length > 1" class="grid grid-cols-3 gap-3">
            <div
              v-for="(image, index) in home.images.slice(1, 4)"
              :key="index"
              class="rounded-lg overflow-hidden bg-[#D9D0C1]"
            >
              <img
                :src="image"
                :alt="`${home.name} - фото ${index + 2}`"
                class="w-full h-[100px] md:h-[120px] object-cover"
              />
            </div>
          </div>
        </div>

        <div class="lg:w-1/2 flex flex-col">

          <h1 class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-4">
            {{ home.name }}
          </h1>

          <div class="flex flex-wrap gap-4 md:gap-6 mb-6">
            <div v-if="home.capacity" class="font-['Montserrat'] text-[#142C12] text-sm md:text-base">
              <span class="font-medium">Вместимость:</span> {{ home.capacity }} человека
            </div>
            <div v-if="home.area" class="font-['Montserrat'] text-[#142C12] text-sm md:text-base">
              <span class="font-medium">Площадь:</span> {{ home.area }} м²
            </div>
          </div>

          <div class="flex-1 mb-8">
            <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-justify">
              {{ home.description }}
            </p>
          </div>

          <div v-if="home.costs" class="mt-auto">
            <div class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12]">
              {{ formatPrice(home.costs) }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getHomeById } from '@/api/homes';
import { setSelectedHomeId } from '@/composables/useBooking';

const route = useRoute();

const home = ref(null);
const loading = ref(false);
const error = ref(null);

const loadHome = async (id) => {
  if (!id) return;

  loading.value = true;
  error.value = null;
  home.value = null;

  try {
    const response = await getHomeById(id);

    // data.data - одна обертка от axios, вторая от Laravel
    home.value = response.data.data;
    setSelectedHomeId(home.value.id);
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Номер не найден. Возможно, он был удалён.';
    } else if (err.response?.status === 500) {
      error.value = 'Ошибка сервера. Попробуйте позже.';
    } else {
      error.value = 'Не удалось загрузить информацию. Проверьте подключение к сети.';
    }
    console.error('Ошибка загрузки номера:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHome(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadHome(newId);
});

const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return `${price} руб`;
  return `${num.toLocaleString('ru-RU')} руб`;
};
</script>

<style scoped>
</style>
