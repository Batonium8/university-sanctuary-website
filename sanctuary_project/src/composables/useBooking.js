import { ref } from 'vue';

// Глобальное состояние — доступно во всех компонентах
export const selectedHomeId = ref(null);

// Функция для установки ID (вызывается со страницы номера)
export function setSelectedHomeId(id) {
  selectedHomeId.value = id ? Number(id) : null;
}
