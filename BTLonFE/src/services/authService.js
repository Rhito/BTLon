const TOKEN_KEY = "sanctum_token";
const USER_KEY = "admin_user";

/**
 * authService — read-only helper for admin info.
 * Login/logout are handled by AuthProvider (single source of truth).
 */
const authService = {
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getAdminInfo: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return { name: "Admin", email: "" };
      const user = JSON.parse(raw);
      return {
        name: user?.name || "Admin",
        email: user?.email || "",
      };
    } catch {
      return { name: "Admin", email: "" };
    }
  },
};

export default authService;
