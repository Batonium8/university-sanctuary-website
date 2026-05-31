<template>
  <section class="bg-[#EFE6D7] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-light text-center mb-16 font-['Tenor_Sans'] text-[#142C12] tracking-wide">
        О нас
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- Текстовая часть -->
        <div class="lg:col-span-7 space-y-6 font-['Montserrat'] text-[#142C12] text-lg leading-relaxed">
          <article>
            <p>
              Лечебно-курортный санаторий "Чистый воздух" — это уникальное место, где каждый гость может восстановить здоровье и насладиться атмосферой умиротворения. Расположенный в живописной местности, окружённой лесами и чистыми водоёмами, санаторий предлагает идеальные условия для лечения и отдыха.
            </p>

            <p>
              Санаторий специализируется на лечении различных заболеваний, включая заболевания органов дыхания, сердечно-сосудистой системы и опорно-двигательного аппарата. В медицинском центре работают квалифицированные специалисты, которые разрабатывают индивидуальные программы лечения, основанные на современных методах и природных факторах.
            </p>
          </article>

          <article>
            <p>
              На территории санатория созданы все условия для активного отдыха: прогулочные зоны, спортивные площадки и возможности для занятий йогой на свежем воздухе. Для любителей природы предусмотрены экскурсии и пешие прогулки по живописным маршрутам.
            </p>
          </article>

          <article>
            <p>
              "Чистый воздух" — это не только лечение, но и возможность отвлечься от повседневной суеты, восстановить силы и зарядиться положительной энергией.
            </p>
          </article>
        </div>

        <!-- Галерея: 2 колонки -->
        <div class="lg:col-span-5">

          <!-- 📱 МОБИЛЬНАЯ ВЕРСИЯ: Горизонтальный скролл -->
          <div class="lg:hidden flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4">
            <div
              v-for="(src, index) in images"
              :key="'mob-' + index"
              class="snap-center flex-none w-[85vw] h-72 relative overflow-hidden rounded-xl shadow-md border-4 border-[#777C5C]"
            >
              <img
                :src="src"
                :alt="`Изображение ${index + 1}`"
                class="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <!-- 💻 ДЕСКТОПНАЯ ВЕРСИЯ: Flex-галерея -->
          <div class="hidden lg:grid lg:grid-cols-2 gap-3 h-full">

            <!-- Левая колонка -->
            <div class="flex flex-col gap-3">
              <div v-for="(src, i) in images.slice(0, 3)" :key="'desk-l-' + i"
                   class="relative overflow-hidden rounded-lg shadow-md flex-1 min-h-48 group border-4 border-[#777C5C]">
                <img :src="src" :alt="`Изображение ${i + 1}`"
                     class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                     loading="lazy" />
              </div>
            </div>

            <!-- Правая колонка -->
            <div class="flex flex-col gap-3">
              <div v-for="(src, i) in images.slice(3)" :key="'desk-r-' + i"
                   class="relative overflow-hidden rounded-lg shadow-md flex-1 min-h-48 group border-4 border-[#777C5C]">
                <img :src="src" :alt="`Изображение ${i + 4}`"
                     class="absolute inset-0 w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                     loading="lazy" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const images = [
  '/src/img/aboutGallery/7cbdf33f9d203722ed7c2443257617c617400dec.jpg',
  '/src/img/aboutGallery/f273d297443b71c90180ab13019b3f76e24e915a.jpg',
  '/src/img/aboutGallery/7dbfc7e4133c4d14e661115b34cec27b8261fbc4.jpg',
  '/src/img/aboutGallery/de314ca29c58d4421193743634fc86c19ead8c7c.jpg',
  '/src/img/aboutGallery/06766f66a19fcadcb5a702eef481f411fb8f5dda.jpg',
]
</script>
