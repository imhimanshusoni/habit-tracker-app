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

  completeHabit: async (id, date) => {
    return await apiRequest(
      getApiUrl(API_ENDPOINTS.HABITS.BY_ID(id) + '/complete'),
      {
        method: 'POST',
        body: JSON.stringify({ date }),
      }
    );
  },
};

export default {
  ...authAPI,
  ...habitsAPI,
};
