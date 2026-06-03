import apiClient from '../client.js';

/**
 * Получить список всех номеров/коттеджей
 * @returns {Promise} - массив объектов Home
 * Структура объекта: { id, name, description, images, capacity, costs }
 */
export const getHomes = () => {
  return apiClient.get('/homes');
};

/**
 * Получить детальную информацию о конкретном номере
 * @param {number|string} id - ID номера
 * @returns {Promise} - объект Home
 */
export const getHomeById = (id) => {
  return apiClient.get(`/homes/${id}`);
};
