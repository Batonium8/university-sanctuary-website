<template>
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#EFE6D7] !pt-38 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-[#142C12] text-lg animate-pulse">
          Загрузка информации о специалисте...
        </p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
        <p class="font-['Montserrat'] text-red-600 text-lg text-center mb-4">
          {{ error }}
        </p>
        <button
          @click="loadStaff(route.params.id)"
          class="font-['Montserrat'] font-medium text-white px-6 py-2.5 rounded-md text-sm cursor-pointer transition-all hover:opacity-90 bg-[#777C5C]"
        >
          Попробовать снова
        </button>
      </div>

      <div v-else-if="staff" class="flex flex-col lg:flex-row gap-8 lg:gap-12">

        <div class="w-full lg:w-1/2">
          <div class="grid grid-cols-3 gap-3">

            <div class="col-span-2 row-span-2 rounded-lg overflow-hidden bg-[#D9D0C1]">
              <img
                v-if="staff.profile_image"
                :src="staff.profile_image"
                :alt="staff.fio"
                class="w-full h-full object-cover"
                style="min-height: 452px;"
              />
            </div>

            <div
              v-if="staff.certificates && staff.certificates.length > 0"
              v-for="(certificate, index) in staff.certificates.slice(0, 2)"
              :key="index"
              class="rounded-lg overflow-hidden bg-[#D9D0C1]"
            >
              <img
                :src="certificate"
                :alt="`Сертификат ${index + 1}`"
                class="w-full object-cover"
                style="height: 220px;"
              />
            </div>

          </div>
        </div>

        <div class="w-full lg:w-1/2 flex flex-col">

          <h1 class="text-3xl md:text-4xl font-light font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-3">
            {{ staff.fio }}
          </h1>

          <p class="font-['Montserrat'] text-[#142C12] text-lg md:text-xl font-medium mb-4">
            {{ staff.specialization }}
          </p>

          <p v-if="staff.work_experience" class="font-['Montserrat'] text-[#142C12] text-sm md:text-base mb-6">
            <span class="font-medium">Стаж работы:</span> {{ staff.work_experience }} лет
          </p>

          <p v-if="staff.about" class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-justify mb-8">
            {{ staff.about }}
          </p>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMedicalStaffById } from '@/api/medicalStaff';

const route = useRoute();

const staff = ref(null);
const loading = ref(false);
const error = ref(null);

const loadStaff = async (id) => {
  if (!id) return;

  loading.value = true;
  error.value = null;
  staff.value = null;

  try {
    const response = await getMedicalStaffById(id);
    staff.value = response.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Специалист не найден.';
    } else {
      error.value = 'Не удалось загрузить информацию о специалисте.';
    }
    console.error('Ошибка загрузки персонала:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStaff(route.params.id);
});

watch(() => route.params.id, (newId) => {
  loadStaff(newId);
});
</script>
