<template>
  <section class="bg-[#EFE6D7] py-18">
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-4 flex flex-col items-center">

      <h1 class="text-4xl md:text-5xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-8 md:mb-12">
        Медицинский персонал
      </h1>

      <!-- Текст описания - только для мобильных -->
      <p class="lg:hidden font-['Montserrat'] text-[#142C12] text-sm md:text-base leading-relaxed text-center mb-6 md:mb-10 max-w-3xl">
        В санатории "Чистый Воздух" трудится опытный медицинский персонал, который является основой нашего оздоровительного подхода. Наши врачи и медсёстры имеют специальное образование в курортологии, физиотерапии и реабилитации. Каждый сотрудник предлагает индивидуальные программы лечения, учитывая состояние здоровья каждого гостя.
      </p>

      <!-- Горизонтальный свайп для мобильных / Сетка для десктопа -->
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 mb-2 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none lg:mb-0 scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">

        <!-- Верхний ряд: первые 3 карточки -->
        <ServicesCard
          v-for="(item, index) in staff.slice(0, 3)"
          :key="index"
          :image="item.image"
          :title="item.name"
          :description="item.specialty"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full"
        />

        <!-- Текст для десктопа (скрыт на мобильных) -->
        <!-- Добавлен pt-4 sm:pt-5 md:pt-6, чтобы компенсировать отступ внутри карточек и выровнять текст по верху -->
        <div class="hidden lg:flex items-start pt-4 sm:pt-5 md:pt-6">
          <p class="font-['Montserrat'] text-[#142C12] leading-relaxed text-justify">
            В санатории "Чистый Воздух" трудится опытный медицинский персонал, который является основой нашего оздоровительного подхода. Наши врачи и медсестры имеют специальное образование в курортологии, физиотерапии и реабилитации. Каждый сотрудник предлагает индивидуальные программы лечения, учитывая состояние здоровья каждого гостя.          </p>
        </div>
      </div>

      <!-- Нижний ряд: все остальные карточки (начиная с 4-й) -->
      <div v-if="staff.length > 3" class="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0 lg:flex-none scrollbar-hide scroll-pl-4 sm:scroll-pl-6 w-full">
        <ServicesCard
          v-for="(item, index) in staff.slice(3)"
          :key="index + 3"
          :image="item.image"
          :title="item.name"
          :description="item.specialty"
          class="snap-center shrink-0 w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-full"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import ServicesCard from "@/components/ServicesCard.vue"

const staff = [
  {
    image: '/src/img/staff/petrova.jpg',
    name: 'Петрова Анна Сергеевна',
    specialty: 'Терапевт'
  },
  {
    image: '/src/img/staff/sidorov.jpg',
    name: 'Сидоров Алексей Иванович',
    specialty: 'Массажист'
  },
  {
    image: '/src/img/staff/kuznetsova.jpg',
    name: 'Кузнецова Мария Владимировна',
    specialty: 'Физиотерапевт'
  },
  {
    image: '/src/img/staff/ivanov.jpg',
    name: 'Иванов Сергей Николаевич',
    specialty: 'Реабилитолог'
  },
  {
    image: '/src/img/staff/fedorova.jpg',
    name: 'Федорова Елена Анатольевна',
    specialty: 'Психотерапевт'
  },
  {
    image: '/src/img/staff/grigoriev.jpg',
    name: 'Григорьев Дмитрий Павлович',
    specialty: 'Врач-диетолог'
  },
  {
    image: '/src/img/staff/lebedeva.jpg',
    name: 'Лебедева Светлана Юрьевна',
    specialty: 'Массажист'
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
