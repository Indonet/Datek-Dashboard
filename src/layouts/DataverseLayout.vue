<template>
  <v-layout class="rounded rounded-md border" height="100vh">
    <!-- APP BAR -->
    <v-app-bar class="px-3 bg-white" rounded>

      <v-btn
        v-if="!drawer"
        icon
        density="comfortable"
        class="floating-menu-open elevation-2 text-white"
        @click="toggleDrawer"
      >
        <v-icon>
          mdi-view-list
        </v-icon>
      </v-btn>
      
      <!-- Drawer Toggle Button -->
      <!-- <v-btn icon @click="toggleDrawer">
        <v-icon>
          {{ drawer ? 'mdi-chevron-double-left' : 'mdi-menu' }}
        </v-icon>
      </v-btn> -->

      <!-- Logo -->
      <v-img
        src="@/assets/indonet-logo-new.png"
        alt="Logo"
        max-width="60"
        class="ml-4 mr-8 mb-2"
      />

      <!-- Tabs Menu -->
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
      

      <v-spacer />

      <!-- <v-btn variant="text" size="small" @click="showChangelog" class="mr-2">
        What's New
      </v-btn>
      <v-btn variant="text" size="small" @click="showUserGuide" class="mr-2">
        User Guide
      </v-btn> -->
      
      <!-- Notification -->
      <!-- <ChatNotification></ChatNotification> -->

      <!-- Menu (user) -->
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="mx-0">
            <span v-show="!$vuetify.display.smAndDown">
              {{ authStore.user?.username }}
            </span>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card min-width="350">
          <v-list-item
            :subtitle="authStore.user?.email || 'No email'"
            :title="authStore.user?.username || 'Guest'"
          >
            <template #prepend>
              <v-avatar color="grey-darken-1" size="36">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </template>
          </v-list-item>

          <v-divider />

          <v-list-item
            v-show="$vuetify.display.smAndDown"
            to="/dashboard"
            link
            title="Dashboard"
            @click="menu = false"
          />

          <v-divider v-show="$vuetify.display.smAndDown" />

          <v-list-item
            v-show="$vuetify.display.smAndDown"
            to="/create"
            link
            title="Create MyFlow"
            @click="menu = false"
          />

          <v-divider v-show="$vuetify.display.smAndDown" />

          <v-list-item
            to="/profile"
            link
            title="Profile"
            @click="menu = false"
          />

          <v-divider />

          <v-btn @click="logout" color="orange-darken-4" size="small" class="ma-2">
            Logout
          </v-btn>
        </v-card>
      </v-menu>

    </v-app-bar>

    <!-- NAVIGATION DRAWER -->
    <v-navigation-drawer v-model="drawer" class="bg-grey-darken-4 elevation-4">
      <v-btn
        v-if="drawer"
        icon
        density="comfortable"
        class="floating-menu-close"
        @click="toggleDrawer"
      >
        <v-icon>
          mdi-chevron-double-left
        </v-icon>
      </v-btn>

      <v-list nav class="mt-8">

        <!-- Dashboard (no child) -->
        <v-list-item
          title="Dashboard"
          link
          to="/dashboard"
        ></v-list-item>

        <!-- Inventory (with child) -->
        <v-list-group value="inventory">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Inventory"></v-list-item>
          </template>

          <v-list-item title="Customer" to="/customer-list"></v-list-item>
          <v-list-item title="Devices" to="/device-list"></v-list-item>
          <v-list-item title="Datacenter" to="/datacenter-list"></v-list-item>
          <v-list-item title="Rack" to="/rack-list"></v-list-item>
          <v-list-item title="Virtual LAN" to="/vlan-list"></v-list-item>
          <v-list-item title="Cross Connect" to="/cross-connect-list"></v-list-item>
          <v-list-item title="Route Group" to="/route-group-list"></v-list-item>
          <v-list-item title="Route" to="/route-list"></v-list-item>
          <v-list-item title="FO" to="/fo-list"></v-list-item>
        </v-list-group>

        <!-- Services (with child) -->
        <v-list-group value="services">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Services"></v-list-item>
          </template>

          <v-list-item title="Local Loop" to="/local-loop-create"></v-list-item>
          <v-list-item title="Internet" to="/internet-create"></v-list-item>
        </v-list-group>

        <!-- Documentation (no child) -->
        <v-list-item
          title="Documentation"
          link
          to="/document-list"
        ></v-list-item>

        <!-- Knowledge (no child) -->
        <v-list-item
          title="Knowledge"
          link
          to="/knowledge-list"
        ></v-list-item>

        <!-- Config (with child) -->
        <v-list-group value="config">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Configuration"></v-list-item>
          </template>

          <v-list-item title="Backup Config (Gitea)" to="/backup-config-list"></v-list-item>
          <v-list-item title="Generate Config" to="/general-config-list"></v-list-item>
        </v-list-group>

        <!-- KPI/Task (no child) -->
        <v-list-item
          title="Task"
          link
          to="/task-list"
        ></v-list-item>

      </v-list>

    </v-navigation-drawer>

    <!-- MAIN -->
    <v-main>
      <div style="height: 100%; overflow-y: auto;">
        <v-container class="py-6">
          <router-view />
        </v-container>
      </div>
    </v-main>

    <!-- Modals -->
    <ChangelogModal ref="changelogModal" />
  </v-layout>
</template>

<script>
import axios from "@/axios";
import { useAuthStore } from "../stores/authStore";
import ChatNotification from "../components/ChatNotification.vue";
import ChangelogModal from "../components/ChangelogModal.vue";

export default {
  name: "LayoutWithDrawer",
  data() {
    return {
      drawer: true,
      menu: false,
      authStore: useAuthStore(),

      activeTab: "",
      breadcrumbs: [],

      links: [
        { text: "Dashboard", path: "/dashboard" },
        { text: "Create MyFlow", path: "/create" },
      ],
    };
  },

  watch: {
    $route(to) {
      this.updateBreadcrumbs(to);
    },
  },

  mounted() {
    this.updateBreadcrumbs(this.$route);
  },

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },

    updateBreadcrumbs(route) {
      const crumb = route.meta.breadCrumb || [];

      this.breadcrumbs = crumb.map((c) => ({
        text: c.text.charAt(0).toUpperCase() + c.text.slice(1),
        href: c.to,
      }));

      if (crumb.length > 0) {
        this.activeTab = crumb[0].to;
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
      axios.get("/media/user-guide")
        .then(res => {
          const url = res.data.data?.url;
          if (url) window.open(url, "_blank");
        })
    },
  },
};
</script>
<style scoped>
.floating-menu-open {
  position: fixed;
  top: 65px;
  left: 5px;
  z-index: 9999;
  background: #FF7A00;
}
.floating-menu-close {
  position: fixed;
  top: 0px;
  right: -26px;
  z-index: 9999;
  color: white;
  background: #FF7A00;
}
/* Untuk Chrome, Edge, Safari */
:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 5 !important;
  height: 5 !important;
}

/* Untuk Firefox */
:deep(.v-navigation-drawer__content) {
  scrollbar-width: none !important;
}

/* Untuk semua browser */
:deep(.v-navigation-drawer__content) {
  -ms-overflow-style: none !important;
}
:deep(.v-container) {
  max-width: 95% !important;
}
</style>
