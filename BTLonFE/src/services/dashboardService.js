import api from "@/api/axiosInstance";
const dashboardService = {
  getDashboard: () => api.get("/dashboard"),
};

export default dashboardService;
