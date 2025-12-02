import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    status_filter: JSON.parse(localStorage.getItem("dashboard_status")) || {},
    search_key: localStorage.getItem("dashboard_search") || "",
  }),
  actions: {
    setFilters(status_value) {
      this.status_filter = status_value;
      localStorage.setItem("dashboard_status", JSON.stringify(status_value));
    },
    setSearch(search_value) {
      this.search_key = search_value;
      localStorage.setItem("dashboard_search", search_value);
    },
    resetDashboardState() {
      this.filters = {};
      this.search_key = "";
      localStorage.removeItem("dashboard_status");
      localStorage.removeItem("dashboard_search");
    }
  }
});
