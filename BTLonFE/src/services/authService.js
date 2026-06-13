import api from "@/api/axiosInstance";

const TOKEN_KEY = "sanctum_token";
const NAME_KEY = "admin_name";
const EMAIL_KEY = "admin_email";

const authService = {
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(NAME_KEY, res.data.user.name);
    localStorage.setItem(EMAIL_KEY, res.data.user.email);

    return res;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(NAME_KEY);
      localStorage.removeItem(EMAIL_KEY);
    }
  },
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getAdminInfo: () => ({
    name: localStorage.getItem(NAME_KEY) || "Admin",
    email: localStorage.getItem(EMAIL_KEY) || "",
  }),
};

export default authService;
