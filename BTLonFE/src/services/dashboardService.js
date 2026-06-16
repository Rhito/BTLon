import api from "@/api/axiosInstance";
const dashboardService = {
  getDashboard: () => api.get("/dashboard", { timeout: 300_000 }),
};

export default dashboardService;
