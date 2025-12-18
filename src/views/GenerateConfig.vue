<template>
  <v-layout class="overflow-visible mt-16 mb-6">
    <v-bottom-navigation
      v-model="value"
      bg-color="black"
      elevation="0"
      class="bottom-nav-wrapper rounded py-1 px-2 rounded-lg"
      mandatory
      style="height: 70px"
    >
      <div class="bottom-nav-scroll">
        <v-btn
          v-for="(item, index) in navItems"
          :key="index"
          class="nav-btn mt-0 px-0 px-sm-8 px-md-16 rounded-lg"
          color="white"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <span class="text-caption">{{ item.label }}</span>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </v-layout>

  <VirtualPWSConfig v-if="value == 0"></VirtualPWSConfig>
  <MACVRFConfig v-if="value == 1"></MACVRFConfig>
  <InternetConfig v-if="value == 2"></InternetConfig>
</template>

<script>
import VirtualPWSConfig from "./VirtualPWSConfig.vue";
import MACVRFConfig from "./MACVRFConfig.vue";
import InternetConfig from "./InternetConfig.vue";
import { useDashboardStore } from "@/stores/dashboardStore";

export default {
  components: {
    useDashboardStore,
  },
  data() {
    return {
      dashboardStore: useDashboardStore(),
      value: useDashboardStore().status_filter - 1,
      navItems: [
        { icon: "mdi-cog-outline", label: "XL VPWS" },
        { icon: "mdi-cog-outline", label: "MACC VRF" },
        { icon: "mdi-cog-outline", label: "Internet" }
      ],
    };
  },
  methods: {},
  mounted() {
    if (this.dashboardStore.status_filter.constructor === Object) {
      this.value = 1;
    }
  },
  watch: {
    value(newVal){
      this.dashboardStore.setFilters(newVal + 1);
    }
  },
};
</script>
<style scoped>
.nav-btn {
  height: 100%;
}

.v-btn--selected {
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
