<template>
  <section class="relative h-screen overflow-hidden">
    <!-- Фоновое изображение -->
    <img
      :src=bgImg
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Оверлей -->
    <div
      class="absolute inset-0 w-full h-full"
      style="background-color: #EFE6D7; opacity: 0.5;"
    ></div>

    <!-- Контент -->
    <div class="relative z-10 h-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-6">
      <!-- Заголовок -->
      <h2 class="text-3xl md:text-4xl font-light text-center font-['Tenor_Sans'] text-[#142C12] tracking-wide mb-4">
        Забронировать отдых
      </h2>

      <!-- Форма -->
      <form
        class="w-full max-w-2xl rounded-lg p-6 md:p-8 overflow-y-auto"
        style="background-color: #6B7F5E;"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <!-- Описание -->
        <p class="font-['Montserrat'] text-white text-sm md:text-base text-center mb-4 leading-relaxed">
          Пожалуйста, заполните форму ниже для бронирования вашего отдыха в нашем санатории.
        </p>

        <!-- ФИО -->
        <div class="mb-3">
          <input
            v-model="form.fullName"
            type="text"
            placeholder="ФИО*"
            class="booking-input"
            :class="{ 'border-red-400': errors.fullName }"
            @blur="validateField('fullName')"
            @input="clearError('fullName')"
          />
          <p v-if="errors.fullName" class="text-red-300 text-xs mt-1">{{ errors.fullName }}</p>
        </div>

        <!-- Телефон -->
        <div class="mb-3">
          <input
            v-model="form.phone"
            type="tel"
            placeholder="Номер телефона*"
            class="booking-input"
            :class="{ 'border-red-400': errors.phone }"
            @blur="validateField('phone')"
            @input="clearError('phone')"
          />
          <p v-if="errors.phone" class="text-red-300 text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email*"
            class="booking-input"
            :class="{ 'border-red-400': errors.email }"
            @blur="validateField('email')"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-red-300 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Даты -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <input
              v-model="form.checkIn"
              type="date"
              class="booking-input"
              :class="{ 'border-red-400': errors.checkIn }"
              :min="today"
              @blur="validateField('checkIn')"
              @input="clearError('checkIn'); validateDates()"
            />
            <p v-if="errors.checkIn" class="text-red-300 text-xs mt-1">{{ errors.checkIn }}</p>
          </div>
          <div>
            <input
              v-model="form.checkOut"
              type="date"
              class="booking-input"
              :class="{ 'border-red-400': errors.checkOut }"
              :min="form.checkIn || today"
              @blur="validateField('checkOut')"
              @input="clearError('checkOut')"
            />
            <p v-if="errors.checkOut" class="text-red-300 text-xs mt-1">{{ errors.checkOut }}</p>
          </div>
        </div>

        <!-- Количество человек и тип номера -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <select
              v-model="form.guests"
              class="booking-input appearance-none cursor-pointer"
              :class="{ 'border-red-400': errors.guests }"
              @blur="validateField('guests')"
              @change="clearError('guests')"
            >
              <option value="" disabled>Количество человек*</option>
              <option v-for="n in 10" :key="n" :value="n">{{ n }} {{ getGuestsWord(n) }}</option>
            </select>
            <p v-if="errors.guests" class="text-red-300 text-xs mt-1">{{ errors.guests }}</p>
          </div>
          <div>
            <select
              v-model="form.roomType"
              class="booking-input appearance-none cursor-pointer"
              :class="{ 'border-red-400': errors.roomType }"
              @blur="validateField('roomType')"
              @change="clearError('roomType')"
            >
              <option value="" disabled>Тип номера*</option>
              <option v-for="room in roomTypes" :key="room.value" :value="room.value">{{ room.label }}</option>
            </select>
            <p v-if="errors.roomType" class="text-red-300 text-xs mt-1">{{ errors.roomType }}</p>
          </div>
        </div>

        <!-- Дополнительные пожелания -->
        <div class="mb-4">
          <textarea
            v-model="form.wishes"
            placeholder="Дополнительные пожелания"
            rows="3"
            class="booking-input resize-none"
          ></textarea>
        </div>

        <!-- Согласие -->
        <div class="mb-4">
          <label class="flex items-start gap-2 cursor-pointer">
            <input
              v-model="form.agree"
              type="checkbox"
              class="mt-1 w-4 h-4 accent-[#142C12] flex-shrink-0"
              :class="{ 'ring-2 ring-red-400': errors.agree }"
              @change="clearError('agree')"
            />
            <span class="font-['Montserrat'] text-white/80 text-xs leading-relaxed">
              Нажимая кнопку, вы даете согласие на обработку ваших персональных данных.
              <a href="#" class="underline hover:text-white transition-colors">Политика конфиденциальности</a>
            </span>
          </label>
          <p v-if="errors.agree" class="text-red-300 text-xs mt-1">{{ errors.agree }}</p>
        </div>

        <!-- Кнопка -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="font-['Montserrat'] font-medium text-[#6B7F5E] px-10 py-3 rounded-md text-base cursor-pointer transition-all hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style="background-color: #f5f0e8;"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Отправка...' : 'Забронировать' }}
          </button>
        </div>

        <!-- Сообщение об успехе -->
        <div v-if="successMessage" class="mt-4 text-center font-['Montserrat'] text-white text-sm bg-green-700/50 rounded-lg p-3">
          {{ successMessage }}
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';

const today = new Date().toISOString().split('T')[0];

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  checkIn: '',
  checkOut: '',
  guests: '',
  roomType: '',
  wishes: '',
  agree: false,
});

const errors = reactive({});
const isSubmitting = ref(false);
const successMessage = ref('');
const bgImg = 'src/img/bg/78d23bb27f6e27fdd19465b67210c025b56cba7c.jpg'
const roomTypes = [
  { value: 'standard', label: 'Стандартный номер' },
  { value: 'semi-lux', label: 'Полулюкс' },
  { value: 'lux', label: 'Люкс' },
  { value: 'eco', label: 'Эко-домик' },
  { value: 'comfortable', label: 'Комфортабельный домик' },
  { value: 'family', label: 'Семейный домик' },
];

const getGuestsWord = (n) => {
  const lastTwo = n % 100;
  const lastOne = n % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return 'человек';
  if (lastOne === 1) return 'человек';
  if (lastOne >= 2 && lastOne <= 4) return 'человека';
  return 'человек';
};

const validateField = (field) => {
  switch (field) {
    case 'fullName':
      if (!form.fullName.trim()) {
        errors.fullName = 'Введите ФИО';
      } else if (form.fullName.trim().length < 2) {
        errors.fullName = 'ФИО должно содержать минимум 2 символа';
      } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(form.fullName.trim())) {
        errors.fullName = 'ФИО должно содержать только буквы';
      } else {
        delete errors.fullName;
      }
      break;

    case 'phone':
      if (!form.phone.trim()) {
        errors.phone = 'Введите номер телефона';
      } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(form.phone.trim())) {
        errors.phone = 'Введите корректный номер телефона';
      } else {
        delete errors.phone;
      }
      break;

    case 'email':
      if (!form.email.trim()) {
        errors.email = 'Введите email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Введите корректный email';
      } else {
        delete errors.email;
      }
      break;

    case 'checkIn':
      if (!form.checkIn) {
        errors.checkIn = 'Выберите дату заезда';
      } else {
        delete errors.checkIn;
        validateDates();
      }
      break;

    case 'checkOut':
      if (!form.checkOut) {
        errors.checkOut = 'Выберите дату выезда';
      } else {
        delete errors.checkOut;
        validateDates();
      }
      break;

    case 'guests':
      if (!form.guests) {
        errors.guests = 'Выберите количество человек';
      } else {
        delete errors.guests;
      }
      break;

    case 'roomType':
      if (!form.roomType) {
        errors.roomType = 'Выберите тип номера';
      } else {
        delete errors.roomType;
      }
      break;

    case 'agree':
      if (!form.agree) {
        errors.agree = 'Необходимо дать согласие';
      } else {
        delete errors.agree;
      }
      break;
  }
};

const clearError = (field) => {
  delete errors[field];
};

const validateDates = () => {
  if (form.checkIn && form.checkOut) {
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      errors.checkOut = 'Дата выезда должна быть позже даты заезда';
    } else {
      delete errors.checkOut;
    }
  }
};

const validateAll = () => {
  const fields = ['fullName', 'phone', 'email', 'checkIn', 'checkOut', 'guests', 'roomType', 'agree'];
  fields.forEach(validateField);
  validateDates();
  return Object.keys(errors).length === 0;
};

const handleSubmit = () => {
  if (!validateAll()) {
    const firstError = document.querySelector('.border-red-400');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  isSubmitting.value = true;
  successMessage.value = '';

  setTimeout(() => {
    console.log('Данные формы:', { ...form });
    isSubmitting.value = false;
    successMessage.value = 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';

    Object.keys(form).forEach(key => {
      if (key === 'agree') form[key] = false;
      else form[key] = '';
    });
  }, 1500);
};
</script>

<style scoped>
.booking-input {
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.booking-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.booking-input:focus {
  border-color: white;
  background-color: rgba(255, 255, 255, 0.05);
}

.booking-input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.booking-input.appearance-none {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 40px;
}

.booking-input option {
  background-color: #6B7F5E;
  color: white;
  padding: 8px;
}

input[type="checkbox"] {
  cursor: pointer;
}

/* Скроллбар для формы если не влезает */
form::-webkit-scrollbar {
  width: 6px;
}

form::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

form::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

form::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
