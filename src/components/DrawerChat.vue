<template>
  <!-- Floating Action Button (FAB) -->
  <v-fab
    icon="mdi-message-text-outline"
    color="orange-darken-4"
    :class="'fab bounce'"
    @click="chat_dialog = true, this.fetchMessages(), this.markAsRead();"
  />

  <!-- Chat Drawer -->
  <v-navigation-drawer
    v-model="chat_dialog"
    :location="$vuetify.display.mobile ? 'end' : 'end'"
    temporary
    rail
    :rail-width="$vuetify.display.mobile ? '500' : drawerWidth"
    class="chat-drawer rounded-ts-lg"
    style="border: none"
  >
    <!-- Header -->
    <v-toolbar flat class="bg-orange-darken-4 rounded-ts-lg">
      <v-toolbar-title>Memo Chat</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="chat_dialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-divider />

    <!-- Body -->
    <div class="chat-body">
      <!-- Messages -->
      <div ref="chatContainer" class="chat-messages">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'chat-bubble',
            msg.sender_id == this.user_id ? 'from-you' : 'from-other',
          ]"
        >
          <div
            class="sender"
            :style="{
              color:
                msg.sender_id == this.user_id
                  ? this.black
                  : getColorFromString(msg.sender),
            }"
          >
            {{ msg.sender }}
          </div>
          <div class="message">{{ msg.message }}</div>
          <div class="time">{{ formatDate(msg.created_date, true) }}</div>
        </div>
      </div>
    </div>

    <!-- Chat Input (Fixed) -->
    <div class="chat-input-fixed">
      <v-divider />
      <div class="chat-input px-4 py-2">
        <v-textarea
          v-model="inputMessage"
          auto-grow
          density="compact"
          variant="outlined"
          placeholder="Type your message..."
          hide-details
          rows="1"
          max-rows="4"
          @keydown="handleKeyDown"
        >
          <template #append-inner>
            <v-icon
              color="orange-darken-4"
              class="mr-2"
              style="cursor: pointer"
              @click="sendMessage"
            >
              mdi-send
            </v-icon>
          </template>
        </v-textarea>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import axios from "@/axios";
import { useNotificationStore } from "@/stores/notificationStore";

export default {
  name: "DrawerChat",
  props: {
    myflow_id: [String, Number],
    user_id: [String, Number],
  },
  data: () => ({
    notificationStore: useNotificationStore(),
    chat_dialog: false,
    drawerWidth: window.innerWidth / 3,
    inputMessage: "",
    messages: [],
    black: "black",
  }),
  mounted() {
    if (this.notificationStore.notification_chat == true) {
      this.chat_dialog = true;
      this.notificationStore.setChatOpen(false);
    }
  },
  watch: {
    myflow_id() {
      this.fetchMessages();
    },
    messages() {
      this.scrollToBottom();
    },
    'notificationStore.timer_load': {
      handler() {
        if (this.chat_dialog == true) {
          this.fetchMessages();
          this.markAsRead();
        }
      },
      deep: true,
    }
  },
  methods: {
    async markAsRead() {
      this.notificationStore.setChatOpen(true);
      try {
        await axios.patch(`/chat/notifications/${this.myflow_id}/read`);
        this.notificationStore.setChatOpen(false);
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    },
    async fetchMessages() {
      try {
        const res = await axios.get(`/chat/${this.myflow_id}`);
        this.messages = res.data.data;
        this.scrollToBottom();
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    },
    async sendMessage() {
      const trimmed = this.inputMessage.trim();
      if (!trimmed) return;
      const tempMessage = trimmed;
      this.inputMessage = "";

      try {
        await axios.post("/chat", {
          message: tempMessage,
          myflow_id: parseInt(this.myflow_id), // ← dikirim dari parent
        });
        this.fetchMessages();
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    },
    handleKeyDown(e) {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Biarkan Enter bekerja normal untuk baris baru
          return;
        } else {
          e.preventDefault(); // Mencegah baris baru default
          this.sendMessage();
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatDate(inputDate, includeTime) {
      const parsedDate = new Date(inputDate);
      const day = parsedDate.getUTCDate();
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
      const month = monthNames[parsedDate.getUTCMonth()];
      const year = parsedDate.getUTCFullYear();
      const hours = `0${parsedDate.getUTCHours()}`.slice(-2);
      const minutes = `0${parsedDate.getUTCMinutes()}`.slice(-2);

      let formattedDate = `${day} ${month} ${year}`;
      if (includeTime) {
        formattedDate += ` - ${hours}:${minutes}`;
      }
      return formattedDate;
    },
    getColorFromString(str) {
      const colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#4A148C",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFC107",
        "#FF6D00",
        "#795548",
        "#37474F",
      ];

      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
  },
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 48px;
  right: 88px;
  z-index: 1000;
}

.bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.chat-drawer {
  position: relative;
  z-index: 3000 !important;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  max-height: calc(
    100vh - 220px
  ); /* Sesuaikan dengan tinggi drawer dan input */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}

.chat-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
  margin-bottom: 10px;
  word-wrap: break-word;
}

.chat-bubble .sender {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.chat-bubble .message {
  font-size: 1rem;
  white-space: pre-wrap; /* ← Ini penting */
  word-wrap: break-word;
}

.chat-bubble .time {
  font-size: 0.65rem;
}

.from-you {
  align-self: flex-end;
  background-color: #ffcdd2;
  border-top-right-radius: 0;
}

.from-other {
  align-self: flex-start;
  background-color: #f1f1f1;
  border-top-left-radius: 0;
}

.chat-input-fixed {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  border-top: 1px solid #ddd;
}
</style>
