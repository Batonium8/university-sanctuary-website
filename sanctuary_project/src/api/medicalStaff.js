import apiClient from '../client.js';

/**
 * Получить список всех сотрудников
 * @returns {Promise} - массив объектов MedicalStaff
 * Структура: { id, fio, profile_image, certificates, specialization, work_experience, about }
 */
export const getMedicalStaff = () => {
  return apiClient.get('/medical-staff');
};

/**
 * Получить детальную информацию о сотруднике
 * @param {number|string} id - ID сотрудника
 * @returns {Promise} - объект MedicalStaff
 */
export const getMedicalStaffById = (id) => {
  return apiClient.get(`/medical-staff/${id}`);
};
