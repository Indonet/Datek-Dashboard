import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notification_chat: localStorage.getItem("notification_memo_id") || false,
    timer_load: localStorage.getItem("notification_timer") || false,
  }),
  actions: {
    setChatOpen(notif_value) {
      this.notification_chat = notif_value;
      localStorage.setItem("notification_memo_id", notif_value);
    },
    setTimeLoad(time_value) {
      this.timer_load = time_value;
      localStorage.setItem("notification_timer", time_value);
    },
    resetDashboardState() {
      this.notification_chat = false;
      localStorage.removeItem("notification_memo_id");
    }
  }
});