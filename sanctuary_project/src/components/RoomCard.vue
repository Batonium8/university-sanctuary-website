<template>
  <div class="flex flex-col md:flex-row rounded-lg overflow-hidden mb-6 min-h-[280px]">
    <div class="flex-shrink-0 md:w-[35%] min-h-[200px] md:min-h-[280px] object-cover">
      <img
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="flex-1 p-6 md:p-10 flex flex-col justify-between bg-[#777C5C] text-[#EFE6D7]">
      <div>
        <h3 class="text-3xl font-normal mb-4 font-['Tenor_Sans']">{{ title }}</h3>
        <p class="text-lg mb-4 opacity-90 font-['Montserrat']">{{ capacity }}</p>
        <p class="text-lg leading-relaxed opacity-90 mb-6 font-['Montserrat']">{{ description }}</p>
      </div>

      <div class="flex justify-between items-center mt-auto">
        <span class="text-[28px] font-normal">{{ price }}</span>
        <button
          class="bg-[#EFE6D7] text-[#777C5C] px-8 py-3 rounded-[11px] text-xl cursor-pointer transition-colors hover:bg-[#F7F0E4]"
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
