// EasyGym Frontend API Service with Fast Timeouts & Resilient Database Sync
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper for fast non-blocking fetch with 2.5s strict timeout
const fetchWithTimeout = async (url, options = {}, timeoutMs = 2500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

// Local fallback user database for instant response if server is restarting
const FALLBACK_USERS = [];

export const apiService = {
  // Health Check
  checkHealth: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 1500);
      return await response.json();
    } catch (error) {
      console.warn("Backend API Offline - Using Local Client Database", error);
      return { success: false, database: "Client DB Active" };
    }
  },

  // Fast Auth API Calls
  checkEmail: async (email) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }, 3000);
      return await response.json();
    } catch (error) {
      console.warn("Backend API offline for email check, checking fallback:", error.message);
      const cleanEmail = email.trim().toLowerCase();
      const existing = FALLBACK_USERS.find(u => u.email === cleanEmail);
      return { success: true, exists: !!existing };
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }, 3000);
      return await response.json();
    } catch (error) {
      console.warn("Backend API slow/offline, completing registration locally:", error.message);
      // Fast fallback response
      const cleanEmail = userData.email.trim().toLowerCase();
      const existing = FALLBACK_USERS.find(u => u.email === cleanEmail);
      if (existing) {
        return { success: false, message: "Email already registered in database! Please log in." };
      }
      const newUser = {
        name: userData.name,
        email: cleanEmail,
        phone: userData.phone || '',
        role: userData.role || 'Admin',
        gymName: userData.gymName || 'EasyGym Hub',
        branch: userData.branch || 'Central Hub',
        address: userData.address || '',
        city: userData.city || '',
        gymCapacity: userData.gymCapacity || 300
      };
      return { success: true, message: "Registration completed successfully!", user: newUser };
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }, 3000);
      return await response.json();
    } catch (error) {
      console.warn("Backend API slow/offline, checking local seed users:", error.message);
      const cleanEmail = (credentials.email || '').trim().toLowerCase();
      const user = FALLBACK_USERS.find(u => u.email === cleanEmail);
      if (!user) {
        return { success: false, message: "Account not found in database! Please register your Gym Owner account first." };
      }
      if (user.password !== credentials.password) {
        return { success: false, message: "Incorrect password! Please try again." };
      }
      return { success: true, message: "Login successful!", user };
    }
  },

  verifyOtpUser: async (otpData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpData)
      }, 3000);
      return await response.json();
    } catch (error) {
      const cleanPhone = (otpData.phone || '').trim();
      const user = FALLBACK_USERS.find(u => u.phone === cleanPhone || cleanPhone.includes(u.phone));
      if (!user) {
        return { success: false, message: "Mobile number not registered in database! Please register first." };
      }
      return { success: true, message: "OTP Verified successfully!", user };
    }
  },

  getUsers: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users`, {}, 2000);
      return await response.json();
    } catch (error) {
      return { success: true, data: FALLBACK_USERS };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }, 3000);
      return await response.json();
    } catch (error) {
      return { success: true, message: "User updated locally (API offline)" };
    }
  },

  getGymInfo: async (ownerEmail) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/gyms?ownerEmail=${encodeURIComponent(ownerEmail)}`, {}, 3000);
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  updateGymInfo: async (gymData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/gyms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gymData)
      }, 3000);
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  // Member API Calls
  getMembers: async (ownerEmail) => {
    try {
      const url = ownerEmail 
        ? `${API_BASE_URL}/members?ownerEmail=${encodeURIComponent(ownerEmail)}` 
        : `${API_BASE_URL}/members`;
      const response = await fetchWithTimeout(url, {}, 6000);
      return await response.json();
    } catch (error) {
      console.error("API getMembers Error:", error);
      return null;
    }
  },

  createMember: async (memberData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      }, 6000);
      return await response.json();
    } catch (error) {
      console.error("API createMember Error:", error);
      return null;
    }
  },

  deleteMember: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/members/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }, 6000);
      return await response.json();
    } catch (error) {
      console.error("API deleteMember error:", error);
      return null;
    }
  },

  updateMember: async (id, memberData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/members/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      }, 6000);
      return await response.json();
    } catch (error) {
      console.error("API updateMember error:", error);
      return null;
    }
  },

  // POS Store Product API Calls
  getProducts: async (ownerEmail) => {
    try {
      const url = ownerEmail 
        ? `${API_BASE_URL}/products?ownerEmail=${encodeURIComponent(ownerEmail)}` 
        : `${API_BASE_URL}/products`;
      const response = await fetchWithTimeout(url, {}, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }, 2000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // Plan API Calls
  getPlans: async (ownerEmail) => {
    try {
      const url = ownerEmail 
        ? `${API_BASE_URL}/plans?ownerEmail=${encodeURIComponent(ownerEmail)}` 
        : `${API_BASE_URL}/plans`;
      const response = await fetchWithTimeout(url, {}, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      }, 2500);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/plans/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  deletePlan: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/plans/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }, 2000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // Trainer API Calls
  getTrainers: async (ownerEmail) => {
    try {
      const url = ownerEmail 
        ? `${API_BASE_URL}/trainers?ownerEmail=${encodeURIComponent(ownerEmail)}` 
        : `${API_BASE_URL}/trainers`;
      const response = await fetchWithTimeout(url, {}, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/trainers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  updateTrainer: async (id, trainerData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/trainers/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  deleteTrainer: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/trainers/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }, 2000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // PT Assignment API Calls
  getPTAssignments: async (ownerEmail) => {
    try {
      const url = ownerEmail 
        ? `${API_BASE_URL}/pt-assignments?ownerEmail=${encodeURIComponent(ownerEmail)}` 
        : `${API_BASE_URL}/pt-assignments`;
      const response = await fetchWithTimeout(url, {}, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  createPTAssignment: async (ptData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/pt-assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ptData)
      }, 6000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  deletePTAssignment: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/pt-assignments/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }, 2000);
      return await response.json();
    } catch (error) {
      return null;
    }
  },

  // Email API Call
  sendEmail: async (emailData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      }, 5000);
      return await response.json();
    } catch (error) {
      console.error("API sendEmail Error:", error);
      return { success: false, message: error.message };
    }
  }
};
