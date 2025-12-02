<template>
  <v-app-bar class="px-3" rounded>
    <!-- Logo -->
    <v-img src="@/assets/indonet-logo-new.png" alt="Logo" max-width="60" class="ml-4" />
    <!-- Tabs Menu-->
    <v-tabs v-model="activeTab" class="ml-10" color="grey-darken-2" centered>
      <v-tab v-show="!$vuetify.display.smAndDown" v-for="link in links" :key="link.text" :value="link.path"
        :to="link.path">
        {{ link.text }}
      </v-tab>
    </v-tabs>
    <!-- <v-btn
      v-show="!$vuetify.display.smAndDown"
      variant="text"
      href="https://myflow.indonet.id"
      target="_blank"
      rel="noopener"
    >
      <span class="text-orange-darken-4">Dashboard Myflow1</span>
    </v-btn> -->
    <v-spacer></v-spacer>
    <!-- v-show="!$vuetify.display.mobile" -->
    <!-- Action Button -->

    <ChatNotification></ChatNotification>

    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn size="large" variant="text" v-bind="props" class="mx-0">
          <span v-show="!$vuetify.display.smAndDown" class="mr-2">{{
            authStore.user?.username
          }}</span>
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn>
      </template>

      <v-card min-width="350">
        <!-- :prepend-avatar="authStore.user?.image || 'https://cdn.vuetifyjs.com/images/john.jpg'" -->
        <v-list-item :subtitle="authStore.user?.email || 'No email'" :title="authStore.user?.username || 'Guest'">
          <template #prepend>
            <v-avatar color="grey-darken-1" size="36">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-show="$vuetify.display.smAndDown" to="/dashboard" link title="Dashboard" @click="menu = false" />
        <v-divider v-show="$vuetify.display.smAndDown"></v-divider>
        <v-list-item v-show="$vuetify.display.smAndDown" to="/create" link title="Create MyFlow"
          @click="menu = false" />
        <v-divider v-show="$vuetify.display.smAndDown"></v-divider>
        <v-list-item to="/profile" link title="Profile" @click="menu = false" />

        <v-divider v-show="$vuetify.display.smAndDown"></v-divider>
        <v-list-item v-show="$vuetify.display.smAndDown" @click="menu = false; showChangelog()" link
          title="What's New" />

        <v-divider v-show="$vuetify.display.smAndDown"></v-divider>
        <v-list-item v-show="$vuetify.display.smAndDown" @click="menu = false; showUserGuide()" link
          title="User Guide" />

        <v-divider></v-divider>
        <v-btn @click="logout" color="orange-darken-4" size="small" class="ma-2">Logout</v-btn>
      </v-card>
    </v-menu>

    <template v-slot:extension>
      <v-row class="mx-0 align-center">
        <!-- Kolom kiri: Breadcrumbs -->
        <v-col cols="8" class="pl-0">
          <v-breadcrumbs :items="breadcrumbs" class="text-caption">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :href="item.href">
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon small>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </v-col>

        <!-- Kolom tengah: Kosong -->
        <!-- <v-col cols="1"></v-col> -->

        <!-- Kolom kanan: Tombol di pojok kanan -->
        <v-col cols="4" v-if="!$vuetify.display.smAndDown" class="text-right pr-0">
          <v-btn variant="text" size="small" @click="showChangelog" class="mr-2">
            What's New
          </v-btn>
          <v-btn variant="text" size="small" @click="showUserGuide" class="mr-2">
            User Guide
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-app-bar>

  <router-view />

  <!-- Modal placed outside the navbar to overlay the entire app -->
  <ChangelogModal ref="changelogModal"></ChangelogModal>
</template>

<script>
import axios from "@/axios";
import { useAuthStore } from "../stores/authStore"; // Sesuaikan path jika diperlukan
import ChatNotification from "../components/ChatNotification.vue"; // Sesuaikan path jika diperlukan
import ChangelogModal from "../components/ChangelogModal.vue"; // Sesuaikan path jika diperlukan

export default {
  name: "MyFlowLayout",
  data: () => ({
    authStore: useAuthStore(),
    activeTab: "",
    breadcrumbs: [
      {
        text: "",
        href: "",
      },
    ],
    links: [
      { text: "Dashboard", path: "/dashboard" },
      { text: "Create MyFlow", path: "/create" },
    ],
    menu: false,
    notifMenu: false,
    hints: true,
  }),
  watch: {
    $route(to) {
      this.updateBreadcrumbs(to);
    },
  },
  mounted() {
    this.updateBreadcrumbs(this.$route);
  },
  methods: {
    updateBreadcrumbs(route) {
      // Ambil data breadcrumb dari meta
      const breadcrumbArray = route.meta.breadCrumb || [];

      // Inisialisasi array untuk breadcrumbs
      const breadcrumbs = breadcrumbArray.map((crumb) => ({
        text: crumb.text.charAt(0).toUpperCase() + crumb.text.slice(1), // Kapitalisasi teks
        href: crumb.to, // Gunakan properti `to` sebagai hyperlink
      }));

      // Update breadcrumbs ke state
      this.breadcrumbs = breadcrumbs;

      // Set activeTab berdasarkan breadcrumb pertama
      if (breadcrumbArray.length > 0) {
        this.activeTab = breadcrumbArray[0].to;
      }
    },
    logout() {
      this.authStore.logout();
      this.$router.push("/login");
    },
    showChangelog() {
      this.$refs.changelogModal.showChangelog();
    },
    showUserGuide() {
      axios.get('/media/user-guide')
        .then(response => {
          console.log(response.data.data);
          
          const url = response.data.data.url;
          if (url) {
            window.open(url, '_blank');
          } else {
            console.error('URL tidak ditemukan dalam respons:', response.data);
          }
        })
        .catch(error => {
          console.error('Gagal mengambil user guide:', error);
        });
    }
  },
};
</script>
