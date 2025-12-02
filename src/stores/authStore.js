import { defineStore } from "pinia";
import api from "../axios"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    roles: [], // Role user (misal: ['admin', 'editor'])
    permissions: [], // Hak akses (misal: ['view-dashboard', 'edit-user'])
    isLoggingOut: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    hasRole(role) {
      return this.roles.includes(role);
    },
    hasPermission(permission) {
      return this.permissions.includes(permission);
    },
    async login() {
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("dashboard_status");
      localStorage.removeItem("dashboard_search");
      try {
        const response = await api.get("/employees/profile");
        this.user = {
          id: response.data.employee.id,
          employee_id: response.data.employee.employee_id,
          username: response.data.employee.name,
          email: response.data.employee.email,
          company: response.data.employee.company,
          position: response.data.employee.position,
          is_active: response.data.employee.is_active,
          superior_id: response.data.employee.superior_id,
          superior_name: response.data.employee.superior_name,
          signature: response.data.employee.signature || "",
          permissions: ["edit-user", "delete-user"],
        };
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    async logout() {
      // ✅ Cegah logout dipanggil berulang kali
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;

      try {
        const response = await api.get("/auth/logout");

        // ✅ Tambahkan delay 1 detik agar tidak bounce
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Hapus data user dari state dan localStorage
        this.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("dashboard_status");
        localStorage.removeItem("dashboard_search");
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        // ✅ Pastikan flag di-reset meskipun terjadi error
        this.isLoggingOut = false;
      }
    },
  },
});
