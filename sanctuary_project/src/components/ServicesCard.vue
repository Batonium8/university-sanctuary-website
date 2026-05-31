<template>
  <article class="group w-full max-w-xs sm:max-w-sm md:max-w-85 mx-auto bg-transparent rounded-2xl p-4 sm:p-5 md:p-6 text-center">
    <!-- Изображение -->
    <div class="w-full mb-4 sm:mb-5 overflow-hidden rounded-xl border-4 border-[#777C5C]">
      <img
        :src="image"
        :alt="title"
        class="w-full aspect-3/4 sm:aspect-4/5 object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
    </div>

    <!-- Заголовок -->
    <h3 class="text-xl sm:text-2xl font-bold font-['Tenor_Sans'] text-[#142C12] mb-2 sm:mb-3 tracking-wide">
      {{ title }}
    </h3>

    <!-- Описание -->
    <p class="text-sm sm:text-base font-['Montserrat'] text-[#142C12] leading-relaxed font-light">
      {{ description }}
    </p>
  </article>
</template>

<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>
