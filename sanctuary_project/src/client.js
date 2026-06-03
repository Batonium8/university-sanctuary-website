import axios from 'axios';

// Создаём настроенный экземпляр axios
const apiClient = axios.create({
  // Полный базовый URL для API санатория
  baseURL: '/sanatorium/api/v1',

  // Таймаут 10 секунд (если сервер не отвечает, запрос обрывается)
  timeout: 10000,

  // Заголовки по умолчанию для всех запросов
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Перехватчик ответов (interceptor) — ловит все ошибки
apiClient.interceptors.response.use(
  // Если всё хорошо — просто возвращаем ответ
  (response) => response,

  // Если ошибка — логируем и пробрасываем дальше
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
