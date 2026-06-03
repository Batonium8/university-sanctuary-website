<template>
  <header
    class="fixed top-0 left-0 w-full z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300"
    :class="isScrolled ? 'bg-[#EFE6D7]/90 backdrop-blur-md border-[#142C12]/15 shadow-sm' : 'bg-transparent'"
  >
    <div class="container mx-auto px-5 md:px-8 py-4 md:py-5 flex items-center justify-between lg:text-lg xl:text-xl">

      <a href="/" @click.prevent="navigate('/')" class="text-xl font-bold text-[#142C12] md:hidden">
        Чистый воздух
      </a>
      <nav aria-label="Главное меню" class="hidden md:flex items-center gap-12 lg:gap-20 ">
        <a
          v-for="link in navLinks"
          :key="link.path"
          :href="link.path"
          @click.prevent="navigate(link.path)"
          class="text-[#142C12] hover:text-[#31542D] transition-colors duration-300 font-medium tracking-wide cursor-pointer"
        >
          {{ link.name }}
        </a>
      </nav>

      <a
        href="#bookings"
        @click.prevent="navigate('#bookings')"
        class="hidden md:inline-flex items-center justify-center bg-[#777C5C] text-[#EFE6D7] px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#6a6f52] font-medium cursor-pointer"
      >
        Записаться
      </a>

      <button
        class="md:hidden p-2 text-[#142C12] hover:text-[#31542D] transition-colors duration-300"
        aria-label="Открыть меню"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >

        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </header>

  <Transition name="mobile-menu">
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-[#EFE6D7] pt-28 px-6 md:hidden">
      <nav class="flex flex-col gap-4">
        <a
          v-for="link in navLinks"
          :key="link.path"
          :href="link.path"
          @click.prevent="navigate(link.path); mobileMenuOpen = false"
          class="text-2xl font-medium text-[#142C12] hover:text-[#31542D] border-b border-[#142C12]/10 pb-4 cursor-pointer"
        >
          {{ link.name }}
        </a>
      </nav>

      <a
        href="#bookings"
        @click.prevent="navigate('#bookings'); mobileMenuOpen = false"
        class="mt-6 w-full inline-flex items-center justify-center bg-[#777C5C] text-[#EFE6D7] px-6 py-3 rounded-lg font-medium text-lg shadow-sm hover:bg-[#6a6f52] transition-colors duration-300 cursor-pointer"
      >
        Записаться
      </a>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = ref([
  { name: 'О нас', path: '#about' },
  { name: 'Услуги', path: '#services' },
  { name: 'Номера', path: '#rooms' },
  { name: 'Бронь', path: '#bookings' },
  { name: 'Вопросы', path: '#faq' }
])

// Плавный скролл к секции
const scrollToSection = (href) => {
  if (href === '/') return

  const id = href.replace('#', '')
  const element = document.getElementById(id)

  if (element) {
    const offset = 100
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// Универсальная навигация
const navigate = (href) => {
  // Сначала ищем элемент на ТЕКУЩЕЙ странице
  const id = href.replace('#', '')
  const element = document.getElementById(id)

  if (element) {
    // Нашли на текущей странице — просто скроллим
    const offset = 100
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  } else if (route.path !== '/') {
    // Не нашли и не на главной — переходим на главную и там скроллим
    router.push('/').then(() => {
      setTimeout(() => scrollToSection(href), 150)
    })
  } else {
    // На главной, но элемент не найден — просто скроллим (на всякий случай)
    scrollToSection(href)
  }
}

watch(mobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Если пришли с якорем в URL
  if (route.hash) {
    setTimeout(() => scrollToSection(route.hash), 150)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Плавная анимация появления/скрытия мобильного меню */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
