<template>
  <!-- {{ notificationStore.notification_chat }} -->
  <!-- {{ notificationStore.timer_load }} -->
  <v-menu v-model="notifMenu" :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-bell-outline" class="mx-0" v-bind="props" />
      <v-badge
        v-if="chat_list.length > 0"
        color="orange-darken-4"
        dot
        location="top end"
        offset-x="10"
        offset-y="-15"
      >
      </v-badge>
    </template>

    <v-card min-width="350">
      <v-list>
        <v-list-item
          v-for="(notif, index) in chat_list"
          :key="notif.myflow_id"
          @click="markAsReadAndGo(notif.myflow_id)"
          style="cursor: pointer"
        >
          <template v-slot:title>
            {{ notif.subject }}
          </template>
          <template v-slot:subtitle>
            {{ formatDate(notif.last_update, true) }}
          </template>

          <template v-slot:append>
            <v-icon>mdi-launch</v-icon>
          </template>
        </v-list-item>

        <v-list-item v-if="chat_list.length === 0">
          <v-list-item-title>No notifications</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
    </v-card>
  </v-menu>
</template>

<script>
import axios from "@/axios";
import { useNotificationStore } from "@/stores/notificationStore";

export default {
  name: "ChatNotification",
  data: () => ({
    notificationStore: useNotificationStore(),
    notificationInterval: null,
    notifMenu: false,
    chat_list: [],
  }),
  watch: {
    notifMenu(val) {
      if (val) {
        this.fetchNotifications();
      }
    },
    'notificationStore.notification_chat': {
      handler(newValue) {
        if (newValue == false) {
          this.initNotificationPolling();
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.initNotificationPolling();
  },
  beforeUnmount() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
  },
  methods: {
    async initNotificationPolling() {
      await this.fetchNotifications();

      // Jika chat_list kosong, jalankan polling
      if (this.chat_list.length === 0) {
        this.startPollingIfEmpty();
      }
    },

    startPollingIfEmpty() {
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval); // Hindari interval dobel
      }

      this.notificationInterval = setInterval(async () => {
        await this.fetchNotifications();

        // Toggle state setiap 10 detik
        if (this.notificationStore.timer_load === true) {
          this.notificationStore.setTimeLoad(false);
        } else {
          this.notificationStore.setTimeLoad(true);
        }

        // Jika data sudah ada, hentikan polling
        if (this.chat_list.length > 0) {
          clearInterval(this.notificationInterval);
          this.notificationInterval = null;
        }
      }, 300000); // 300 detik = 5 menit
    },
    async fetchNotifications() {
      try {
        const response = await axios.get("/chat/notifications");
        this.chat_list = response.data.data || [];
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    },
    async markAsReadAndGo(id) {
      try {
        await axios.patch(`/chat/notifications/${id}/read`);
        this.notifMenu = false;
        this.fetchNotifications();
        this.notificationStore.setChatOpen(true);

        const targetPath = `/details/${id}`;

        if (this.$route.path === targetPath) {
          this.softReloadPage(); // 👈 Pakai soft reload
        } else {
          this.$router.push(targetPath);
        }
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    },

    async softReloadPage() {
      const currentPath = this.$route.fullPath;

      // Navigasi ke route dummy (pastikan route ini tidak memiliki component)
      await this.$router.replace({ path: '/_refresh', query: { redirect: currentPath } });
      
      // Lalu kembali ke halaman asal
      await this.$router.replace(currentPath);
    },
    formatDate(inputDate, includeTime) {
      const parsedDate = new Date(inputDate);
      const day = parsedDate.getDate();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[parsedDate.getMonth()];
      const year = parsedDate.getFullYear();
      const hours = `0${parsedDate.getHours()}`.slice(-2);
      const minutes = `0${parsedDate.getMinutes()}`.slice(-2);

      let formattedDate = `${day} ${month} ${year}`;
      if (includeTime) {
        formattedDate += ` - ${hours}:${minutes}`;
      }
      return formattedDate;
    },
  },
}
</script>
