<template>
  <section class="bg-[#EFE6D7] py-18" id="services">
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3 md:gap-5">

      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide">
        Услуги
      </h1>
      <article class="text-center">
        <p class="font-['Montserrat'] text-[#142C12] text-base md:text-lg leading-relaxed max-w-4xl">
          Санаторий "Чистый Воздух" предлагает широкий спектр услуг, направленных на восстановление
          здоровья и общее оздоровление гостей. Мы создаем комфортные условия для отдыха и лечения,
          сочетая современные технологии с природными ресурсами.
        </p>
      </article>

      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">
        <router-link
          v-for="(item, index) in items"
          :key="index"
          :to="{ name: 'ServiceDetail', params: { id: item.id } }"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full block"
        >
          <ServicesCard
            :image="item.image"
            :title="item.title"
            :description="item.description"
          />
        </router-link>
      </div>

      <a
        href="#bookings"
        @click.prevent="navigateToBooking"
        class="md:inline-flex w-fit items-center justify-center bg-[#777C5C] text-[#EFE6D7] py-2.5 px-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#6a6f52] font-medium font-[Tenor_Sans] whitespace-nowrap cursor-pointer"
      >
        Забронировать отдых
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getServices } from '@/api/services';
import ServicesCard from '@/components/ServicesCard.vue';

const items = ref([]);

const route = useRoute();
const router = useRouter();

// Навигация к форме бронирования
const navigateToBooking = () => {
  const element = document.getElementById('bookings');

  if (element) {
    // Нашли на текущей странице — просто скроллим
    const offset = 100;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  } else if (route.path !== '/') {
    // Не нашли и не на главной — переходим на главную и скроллим
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById('bookings');
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 150);
    });
  }
};

const loadServices = async () => {
  try {
    const response = await getServices();
    items.value = response.data.data || [];
  } catch (err) {
    console.error('Ошибка загрузки услуг:', err);
  }
};

onMounted(() => {
  loadServices();
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
