<template>
  <section class="bg-[#EFE6D7] py-18">
    <!-- items-center выравнивает детей по горизонтали, gap заменяет фиксированные mb-* -->
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3 md:gap-5">

      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide">
        Услуги
      </h1>

      <article class="text-center">
        <p class="font-['Montserrat'] text-[#142C12] text-base md:text-lg leading-relaxed max-w-4xl">
          Санаторий "Чистый Воздух" предлагает широкий спектр услуг, направленных на восстановление здоровья и общее оздоровление гостей. Мы создаем комфортные условия для отдыха и лечения, сочетая современные технологии с природными ресурсами.
        </p>
      </article>

      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">
        <ServicesCard
          v-for="(item, index) in items"
          :key="index"
          :image="item.image"
          :title="item.title"
          :description="item.description"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full"/>
      </div>

      <!-- Кнопка: w-fit делает ширину по тексту, px-2 минимальный отступ, justify-center в родителе выравнивает по бокам через flex -->
      <router-link
        to="/#contacts"
        class="md:inline-flex w-fit items-center justify-center bg-[#777C5C] text-[#EFE6D7] py-2.5 px-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#6a6f52] font-medium font-[Tenor_Sans] whitespace-nowrap"
      >
        Забронировать отдых
      </router-link>
    </div>
  </section>
</template>

<script setup>
import ServicesCard from "@/components/ServicesCard.vue";

const items = [
  {
    image: "/src/img/cards/Services/b466a3e128de0b2cc288167e1126541da274d620.jpg",
    title: "Бассейн",
    description: "Санаторий предлагает комфортабельный крытый и открытый бассейны с подогревом, где гости могут наслаждаться плаванием в любое время года."
  },
  {
    image: '/src/img/cards/Services/6b05a319f4bc45fcdf0652aaa317ca3ed5ce717a.jpg',
    title: 'Физиотерапия',
    description: 'Физиотерапевтические процедуры включают в себя такие методы, как электрофорез, ультразвуковая терапия и магнитотерапия.'
  },
  {
    image: '/src/img/cards/Services/ddfd6d805d4d9229af035edf6a326b2e42030408.jpg',
    title: 'Массаж',
    description: 'В санатории доступны различные виды массажа, включая классический, расслабляющий, лечебный и спортивный.'
  },
  {
    image: '/src/img/cards/Services/3505d60035cc68e3ad1c623a5045b93421a057ab.jpg',
    title: 'Бальнеотерапия',
    description: 'Бальнеотерапия включает в себя лечение с использованием минеральных вод и грязей. В санатории предлагаются процедуры с использованием целебных ванн, обертываний и аппликаций.'
  },
]
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
