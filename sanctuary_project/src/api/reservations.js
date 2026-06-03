import apiClient from '../client.js';

/**
 * Создать новое бронирование
 * @param {Object} data - данные бронирования
 * @param {string} data.fio - ФИО гостя
 * @param {string} data.phone - телефон
 * @param {string} data.email - email
 * @param {string} data.check_in_date - дата заезда (YYYY-MM-DD)
 * @param {string} data.check_out_date - дата выезда (YYYY-MM-DD)
 * @param {number} data.count_people - количество человек
 * @param {number} data.home_id - ID номера
 * @param {string} [data.comment] - дополнительные пожелания (опционально)
 * @returns {Promise} - созданная бронь
 */
export const createReservation = (data) => {
  return apiClient.post('/reservations', data);
};
