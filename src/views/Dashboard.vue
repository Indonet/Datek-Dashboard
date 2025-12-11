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
          class="nav-btn mt-0 mx-0 rounded-lg"
          color="white"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <span class="text-caption">{{ item.label }}</span>
        </v-btn>
      </div>
    </v-bottom-navigation>
  </v-layout>

  <TableDevices v-if="value == 0"></TableDevices>
  <TableInterfaces v-if="value == 1"></TableInterfaces>
  <TableThreshold v-if="value == 2"></TableThreshold>
  <TableEnvironment v-if="value == 3"></TableEnvironment>
  <TableBGP v-if="value == 4"></TableBGP>
  <TableCustomer v-if="value == 5"></TableCustomer>
</template>

<script>TableEnvironment
import TableDevices from "../components/TableDevices.vue";
import TableInterfaces from "../components/TableInterfaces.vue";
import TableThreshold from "../components/TableThreshold.vue";
import TableEnvironment from "../components/TableEnvironment.vue";
import TableBGP from "../components/TableBGP.vue";
import TableCustomer from "../components/TableCustomer.vue";
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
        { icon: "mdi-shape-plus", label: "Devices" },
        { icon: "mdi-close-network", label: "Interfaces" },
        { icon: "mdi-speedometer", label: "Threshold" },
        { icon: "mdi-server", label: "Environment" },
        { icon: "mdi-shuffle", label: "BGP" },
        { icon: "mdi-account", label: "Customer" },
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
.bottom-nav-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.bottom-nav-scroll::-webkit-scrollbar {
  display: thin;
}

.nav-btn {
  flex: 2 0 auto;
  /* grow secara proporsional */
  height: 100%;
  /* tinggi penuh dari parent */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.v-btn--selected {
  /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); */
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
