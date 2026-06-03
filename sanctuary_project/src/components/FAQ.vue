<template>
  <section class="bg-[#EFE6D7] py-12 md:py-16 px-4 sm:px-6 lg:px-8" id="faq">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl md:text-4xl lg:text-[42px] font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-8 md:mb-12">
        Часто задаваемые вопросы
      </h2>

      <div class="flex flex-col gap-3 md:gap-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="border-2 border-[#142C12] rounded-lg overflow-hidden"
          :class="{ 'bg-[#142C12]/5': openIndexes.includes(index) }"
        >
          <button
            @click="toggleQuestion(index)"
            class="w-full flex items-center justify-between px-5 md:px-8 py-4 md:py-5 text-left cursor-pointer"
          >
            <span class="font-['Montserrat'] text-[#142C12] text-[15px] md:text-lg font-normal pr-4">
              {{ item.question }}
            </span>
            <span
              class="text-[#142C12] text-2xl md:text-3xl font-light flex-shrink-0 transition-transform duration-300"
              :class="{ 'rotate-45': openIndexes.includes(index) }"
            >
              +
            </span>
          </button>

          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :style="{
              maxHeight: openIndexes.includes(index) ? '500px' : '0px',
              opacity: openIndexes.includes(index) ? 1 : 0
            }"
          >
            <div class="px-5 md:px-8 pb-5 md:pb-6">
              <p class="font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const openIndexes = ref([]);

const faqItems = [
  {
    question: 'Как добраться до санатория?',
    answer: 'Сначала вот так пойдешь, потом вот так пойдешь, потом вот так пойдешь, потом вот так пойдешь пойдешь пойдешь пойдешь пойдешь, потом резкий пойдешь пойдешь пойдешь, потом поворот, затем трасса '
  },
  {
    question: 'Как забронировать номер в санатории?',
    answer: 'Забронировать номер можно несколькими способами: заполнив форму на нашем сайте в разделе "Забронировать отдых", позвонив по телефону +7 (777) 777-77-77, либо написав на электронную почту help@cleanair.ru. Для подтверждения брони требуется предоплата в размере 30% от стоимости проживания.'
  },
  {
    question: 'Какие развлечения доступны на территории санатория?',
    answer: 'На территории санатория к вашим услугам: бассейн, сауна, спортивный зал, теннисный корт, прокат велосипедов и лыж (в сезон), пешеходные маршруты по лесу, библиотека, бильярд, детская игровая комната. Вечером проводятся культурно-развлекательные мероприятия для взрослых и детей.'
  },
  {
    question: 'Какой режим питания в санатории?',
    answer: 'В санатории действует система питания "шведский стол" — завтрак, обед и ужин включены в стоимость путевки. Меню составляется врачом-диетологом с учетом сезонных продуктов и лечебных показаний. По запросу возможно специальное диетическое питание. Время работы столовой: завтрак 8:00-10:00, обед 13:00-15:00, ужин 18:00-20:00.'
  },
  {
    question: 'Какие медицинские услуги предоставляет санаторий?',
    answer: 'Санаторий "Чистый Воздух" предлагает широкий спектр медицинских услуг: консультации терапевта и узких специалистов, физиотерапия, массаж, бальнеология, грязелечение, ингаляции, ЛФК, спелеотерапия. Перед началом лечения все гости проходят медицинский осмотр. Программы лечения подбираются индивидуально с учетом показаний и противопоказаний.'
  }
];

const toggleQuestion = (index) => {
  const currentIndex = openIndexes.value.indexOf(index);

  if (currentIndex === -1) {
    openIndexes.value.push(index);
  } else {
    openIndexes.value.splice(currentIndex, 1);
  }
};
</script>

<style scoped>
.overflow-hidden {
  will-change: max-height, opacity;
}
</style>
