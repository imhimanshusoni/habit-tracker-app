import { getApiUrl, API_ENDPOINTS, apiRequest } from '../config';

// Auth API
export const authAPI = {
  register: async (userData) => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.AUTH.PROFILE));
  },
};

// Habits API
export const habitsAPI = {
  getHabits: async () => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.HABITS.BASE));
  },

  createHabit: async (habitData) => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.HABITS.BASE), {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  },

  updateHabit: async (id, updates) => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.HABITS.BY_ID(id)), {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteHabit: async (id) => {
    return await apiRequest(getApiUrl(API_ENDPOINTS.HABITS.BY_ID(id)), {
      method: 'DELETE',
    });
  },

  completeHabit: async (habit) => {
    const today = new Date();
    // Ensure we don't add duplicate dates
    const newCompletedDates = [...(habit.completedDates || [])];
    if (!newCompletedDates.some(d => d.slice(0, 10) === today.toISOString().slice(0, 10))) {
      newCompletedDates.push(today.toISOString());
    }

    return await habitsAPI.updateHabit(habit._id, {
      completedDates: newCompletedDates,
    });
  },
};

export default {
  ...authAPI,
  ...habitsAPI,
};
