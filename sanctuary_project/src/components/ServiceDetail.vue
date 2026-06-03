<template>
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#EFE6D7] !pt-38 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-[#142C12] text-lg animate-pulse">
          Загрузка информации об услуге...
        </p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-red-600 text-lg text-center mb-4">
          {{ error }}
        </p>
        <button
          @click="loadService(route.params.id)"
          class="font-['Montserrat'] font-medium text-white px-6 py-2.5 rounded-md text-sm cursor-pointer transition-all hover:opacity-90 bg-[#777C5C]"
        >
          Попробовать снова
        </button>
      </div>

      <div v-else-if="service" class="flex flex-col lg:flex-row gap-8 lg:gap-12">

        <div class="lg:w-1/2">
          <div v-if="service.image" class="rounded-lg overflow-hidden bg-[#D9D0C1]">
            <img
              :src="service.image"
              :alt="service.name"
              class="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>
        </div>

        <div class="lg:w-1/2 flex flex-col">

          <h1 class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-6">
            {{ service.name }}
          </h1>

          <div class="flex-1 mb-8">
            <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-justify">
              {{ service.description }}
            </p>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getServiceById } from '@/api/services';

const route = useRoute();

const service = ref(null);
const loading = ref(false);
const error = ref(null);

const loadService = async (id) => {
  if (!id) return;

  loading.value = true;
  error.value = null;
  service.value = null;

  try {
    const response = await getServiceById(id);
    service.value = response.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Услуга не найдена.';
    } else {
      error.value = 'Не удалось загрузить информацию об услуге.';
    }
    console.error('Ошибка загрузки услуги:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadService(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadService(newId);
});
</script>
