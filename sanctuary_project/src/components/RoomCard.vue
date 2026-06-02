<template>
  <div class="flex flex-col md:flex-row rounded-lg overflow-hidden mb-6 min-h-[280px]">
    <!-- Изображение (всегда слева) -->
    <div class="flex-shrink-0 md:w-[35%] min-h-[200px] md:min-h-[280px] object-cover">
      <img
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Контент -->
    <div class="flex-1 p-6 md:p-10 flex flex-col justify-between bg-[#7a8b6e] text-white">
      <div>
        <h3 class="text-[28px] font-normal mb-4">{{ title }}</h3>
        <p class="text-base mb-4 opacity-90">{{ capacity }}</p>
        <p class="text-[15px] leading-relaxed opacity-90 mb-6">{{ description }}</p>
      </div>

      <div class="flex justify-between items-center mt-auto">
        <span class="text-[28px] font-normal">{{ price }}</span>
        <button
          class="bg-[#f5f0e8] text-[#7a8b6e] px-8 py-3 rounded-md text-base cursor-pointer transition-colors hover:bg-[#ebe5db]"
          @click="$emit('details-click')"
        >
          Подробнее
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

defineEmits(['details-click']);
</script>
