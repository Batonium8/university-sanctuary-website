import apiClient from '../client.js';

/**
 * Получить список всех услуг
 * @returns {Promise} - массив объектов Service
 * Структура: { id, name, description, image }
 */
export const getServices = () => {
  return apiClient.get('/services');
};

/**
 * Получить детальную информацию об услуге
 * @param {number|string} id - ID услуги
 * @returns {Promise} - объект Service
 */
export const getServiceById = (id) => {
  return apiClient.get(`/services/${id}`);
};
