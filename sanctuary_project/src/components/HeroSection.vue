<template>
  <section class="relative min-h-dvh flex items-center justify-center overflow-hidden">
    <!-- Фоновое изображение -->
    <img
      :src="hero.bgImage"
      alt=""
      class="absolute inset-0 z-0 w-full h-full object-cover object-center"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />

    <!-- Затемнение для контраста -->
    <div class="absolute inset-0 z-10 bg-[#EFE6D7BA]"></div>

    <!-- Текстовый блок -->
    <div class="relative z-20 text-center text-[#142C12] px-4 md:px-8 py-12 flex flex-col items-center gap-4 md:gap-6 max-w-4xl mx-auto">
      <p class="font-['Tenor_Sans'] text-[18px] lg:text-[25px] leading-relaxed text-[#142C12] text-center">
        {{ hero.topText }}
      </p>

      <h1 class="font-['Montserrat'] whitespace-nowrap text-[40px] md:text-[80px] lg:text-[128px] leading-[0.9] font-medium tracking-tight text-[#142C12]">
        {{ hero.mainTitle }}
      </h1>

      <p class="font-['Tenor_Sans'] text-[18px] lg:text-[25px] leading-relaxed text-[#142C12] text-center">
        {{ hero.bottomText }}
      </p>
    </div>
  </section>
</template>

<script setup>
const hero = {
  bgImage: 'src/img/bg/69410a43776049ebb49617b3ab4b35ced9c13d57.jpg', // ← Замените на путь к вашему изображению
  topText: 'Лечебно-курортный санаторий',
  mainTitle: 'Чистый Воздух',
  bottomText: 'Санаторий "Чистый Воздух" предлагает уникальную возможность восстановить здоровье и гармонию с природой в окружении живописного леса и свежего воздуха.'
}
</script>
