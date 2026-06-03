<template>
  <section class="bg-[#EFE6D7] py-18" id="doctors">
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-8 md:mb-12">
        Медицинский персонал
      </h1>

      <p class="lg:hidden font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-center mb-6 md:mb-10 max-w-3xl">
        В санатории "Чистый Воздух" трудится опытный медицинский персонал, который является
        основой нашего оздоровительного подхода. Наши врачи и медсёстры имеют специальное
        образование в курортологии, физиотерапии и реабилитации. Каждый сотрудник предлагает
        индивидуальные программы лечения, учитывая состояние здоровья каждого гостя.
      </p>

      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 mb-2 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none lg:mb-0 scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">

        <router-link
          v-for="(item, index) in staff.slice(0, 3)"
          :key="item.id"
          :to="{ name: 'StaffDetail', params: { id: item.id } }"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full block"
        >
          <ServicesCard
            :image="item.profile_image"
            :title="item.fio"
            :description="item.specialization"
          />
        </router-link>

        <div class="hidden lg:flex items-start pt-4 sm:pt-5 md:pt-6">
          <p class="font-['Montserrat'] text-[#142C12] leading-relaxed text-justify">
            В санатории "Чистый Воздух" трудится опытный медицинский персонал, который является
            основой нашего оздоровительного подхода. Наши врачи и медсестры имеют специальное
            образование в курортологии, физиотерапии и реабилитации. Каждый сотрудник предлагает
            индивидуальные программы лечения, учитывая состояние здоровья каждого гостя.
          </p>
        </div>
      </div>

      <div v-if="staff.length > 3" class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">
        <router-link
          v-for="(item, index) in staff.slice(3)"
          :key="item.id"
          :to="{ name: 'StaffDetail', params: { id: item.id } }"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full block"
        >
          <ServicesCard
            :image="item.profile_image"
            :title="item.fio"
            :description="item.specialization"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMedicalStaff } from '@/api/medicalStaff';
import ServicesCard from '@/components/ServicesCard.vue';

const staff = ref([]);

const loadStaff = async () => {
  try {
    const response = await getMedicalStaff();
    staff.value = response.data.data || [];
  } catch (err) {
    console.error('Ошибка загрузки персонала:', err);
  }
};

onMounted(() => {
  loadStaff();
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
