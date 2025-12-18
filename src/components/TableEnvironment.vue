<template>
  <v-row>
    <v-col cols="12" class="mx-0 mt-n2 mb-1">
      <span class="ml-2" v-if="formattedDateFrom || formattedDateTo">
        Filtered by created date:
      </span>
      <span v-if="formattedDateFrom">
        {{ "&nbsp" + formattedDateFrom }}
      </span>
      <span v-if="formattedDateFrom && formattedDateTo"> &nbsp- </span>
      <span v-if="formattedDateTo">
        {{ "&nbsp" + formattedDateTo }}
      </span>
      <span
        @click="resetFilters"
        class="ml-2 text-orange cursor-pointer hover:underline hover:text-red-darken-2"
        v-if="formattedDateFrom || formattedDateTo"
      >
        Reset Filter
      </span>
    </v-col>
  </v-row>
  <v-card
    class="text-white bg-black rounded-t-lg py-0"
    :title="'Environment'"
    variant="flat"
    image="../assets/bg-image-black.jpg"
  >
    <template v-slot:append>
      <v-text-field
        label="Search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="solo-filled"
        width="300"
        flat
        hide-details
        placeholder="Search..."
        persistent-placeholder
        single-line
        v-model="search_input"
        style="height: 40px"
      ></v-text-field>

      <v-btn
        v-show="$vuetify.display.mdAndUp"
        variant="tonal"
        prepend-icon="mdi-filter-plus"
        class="mr-2 indonet-orange"
        @click="showFilterDialog = true"
        style="height: 40px"
      >
        <span>Filter</span>
      </v-btn>
    </template>
  </v-card>
  <v-card class="rounded-b-lg">
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page-options="item_per_page"
      sort-asc-icon="mdi-chevron-up"
      sort-desc-icon="mdi-chevron-down"
      class="elevation-1 primary mt-0"
    >
      <!-- Custom Cells -->
      <template v-slot:item.myflow_id="{ item }">
        <router-link
          :to="
            item.status == 'draft' ? `/draft/${item.id}` : `/details/${item.id}`
          "
          class="text-decoration-none text-primary"
        >
          <b>{{ item.myflow_id }}</b> <br />
          <span class="text-grey">{{ item.ctgr_name }}</span>
        </router-link>
      </template>
      <template v-slot:item.subject="{ item }">
        <router-link
          :to="
            item.status == 'draft' ? `/draft/${item.id}` : `/details/${item.id}`
          "
          class="text-decoration-none text-primary"
        >
          <b>{{ item.subject }}</b>
        </router-link>
      </template>
      <template v-slot:item.next_approval="{ item }">
        <span v-if="item.status == 'cancelled'">
          <b>Cancelled by:</b> Creator
        </span>
        <span v-else-if="item.status == 'revision'">
          <b>Waiting Revision by:</b> Creator
        </span>
        <span v-else-if="item.status == 'rejected'">
          <b>Rejected by: </b>
          <span v-for="(approval, index) in item.next_approval" :key="index">
            {{ approval.name }}
            <span v-if="index !== item.next_approval.length - 1"
              ><b>OR </b></span
            >
          </span>
        </span>
        <span v-else-if="item.next_approval.length > 0">
          <b>Next Approval: </b>
          <span v-for="(approval, index) in item.next_approval" :key="index">
            {{ approval.name }}
            <span v-if="index !== item.next_approval.length - 1"
              ><b>OR </b></span
            > </span
          ><br />
          <span class="text-grey-darken-3"
            >Target: {{ item.next_approval[0].deadline }}</span
          >
        </span>
        <span v-else>
          <v-btn
            variant="tonal"
            prepend-icon="mdi-download"
            class="mr-4 bg-orange-darken-4"
            style="border: 2px solid white"
          >
            Download
          </v-btn>
        </span>
      </template>
      <template v-slot:item.created_date="{ item }">
        {{ item.created_date ? formatDate(item.created_date) : "Not Set" }}
      </template>
      <template v-slot:item.deadline="{ item }">
        {{ item.deadline ? formatDate(item.deadline) : "Not Set" }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          class="text-capitalize"
          :color="$root.getStatusClass(item.status)"
          dark
        >
          <span v-if="item.status == 'need_approve' && this.need_approve_btn"
            >Need Approve</span
          >
          <span v-else>{{ item.status }}</span>
        </v-chip>
      </template>
    </v-data-table>
  </v-card>

  <v-fab
    v-show="$vuetify.display.smAndDown"
    icon="mdi-plus"
    color="orange-darken-4"
    class="fab"
    @click="$router.push('/create')"
  />

  <v-dialog v-model="showFilterDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h6">Filter by Created Date</v-card-title>
      <v-card-text>
        <!-- Start Date -->
        <v-menu
          v-model="menuStartDate"
          :close-on-content-click="false"
          location="center"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedDateFrom"
              label="Start Date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              @click="menuStartDate = true"
              @click:clear="clearStartDate"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date_from"
            color="orange-darken-4"
            elevation="24"
            :hide-header="true"
            @update:modelValue="updateStartDate"
          />
        </v-menu>

        <!-- End Date -->
        <v-menu
          v-model="menuEndDate"
          :close-on-content-click="false"
          location="center"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedDateTo"
              label="End Date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="props"
              @click="menuEndDate = true"
              @click:clear="clearEndDate"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date_to"
            color="orange-darken-4"
            elevation="24"
            :hide-header="true"
            @update:modelValue="updateEndDate"
          />
        </v-menu>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="resetFilters">Reset</v-btn>
        <v-btn color="orange-darken-4" @click="applyFilter">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular
      color="orange-darken-4"
      size="64"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import axios from "@/axios";
import { useDashboardStore } from "@/stores/dashboardStore";

export default {
  components: {
    useDashboardStore,
  },
  data() {
    return {
      dashboardStore: useDashboardStore(),
      search_input: "",
      loading: false,

      showFilterDialog: false, // Menampilkan popup filter
      menuStartDate: false, // Kontrol menu untuk Start Date
      menuEndDate: false, // Kontrol menu untuk End Date
      date_from: null, // Tanggal awal (format YYYY-MM-DD)
      date_to: null, // Tanggal akhir (format YYYY-MM-DD)
      formattedDateFrom: "", // Tanggal awal dalam format tampilan
      formattedDateTo: "", // Tanggal akhir dalam format tampilan
      headers: [
        {
          title: "No.",
          value: "index",
          width: "50px",
        },
        {
          title: "Environment",
          value: "subject",
          sortable: true,
        },
        {
          title: "Device Name",
          value: "myflow_id",
          sortable: true,
        },
        {
          title: "IP Address",
          value: "creator",
          sortable: true,
        },
        {
          title: "Datacenter",
          value: "creator",
          sortable: true,
        },
        {
          title: "Date Time",
          value: "next_approval",
          sortable: true,
        },
        {
          title: "Duration",
          value: "created_date",
          sortable: true, // Aktifkan fitur sorting
        }
      ],
      item_per_page: [
        { value: 10, title: "10" },
        { value: 25, title: "25" },
        { value: 50, title: "50" },
        { value: 100, title: "100" },
      ],
      items: [],
    };
  },
  methods: {
    updateStartDate() {
      if (this.date_from) {
        this.formattedDateFrom = this.formatDate(this.date_from);
        this.checkAndSwapDates();
        this.menuStartDate = false; // Tutup menu setelah memilih
      }
    },
    updateEndDate() {
      if (this.date_to) {
        this.formattedDateTo = this.formatDate(this.date_to);
        this.checkAndSwapDates();
        this.menuEndDate = false; // Tutup menu setelah memilih
      }
    },
    checkAndSwapDates() {
      // Jika Start Date lebih besar dari End Date, tukar
      if (this.date_from && this.date_to && this.date_from > this.date_to) {
        const temp = this.date_from;
        this.date_from = this.date_to;
        this.date_to = temp;
        this.formattedDateFrom = this.formatDate(this.date_from);
        this.formattedDateTo = this.formatDate(this.date_to);
      }
    },
    applyFilter() {
      this.fetchMemos();
      this.showFilterDialog = false;
    },
    resetFilters() {
      this.date_from = null;
      this.formattedDateFrom = "";
      this.date_to = null;
      this.formattedDateTo = "";
      this.fetchMemos();
      this.showFilterDialog = false;
    },
    formatDate(inputDate, includeTime) {
      const parsedDate = new Date(inputDate);
      const day = `0${parsedDate.getDate()}`.slice(-2);
      const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
      const year = parsedDate.getFullYear();
      const hours = `0${parsedDate.getHours()}`.slice(-2);
      const minutes = `0${parsedDate.getMinutes()}`.slice(-2);
      const seconds = `0${parsedDate.getSeconds()}`.slice(-2);

      let formattedDate = `${day}-${month}-${year}`;
      if (includeTime) {
        formattedDate += ` ${hours}:${minutes}:${seconds}`;
      }
      return formattedDate;
    },
    async fetchMemos() {
      this.loading = true;
      this.items = [];
      try {
        var requestBody = {
          type: this.status_type,
          page: 1,
          sorting: "desc",
        };

        if (this.search_input && this.search_input.length >= 3) {
          requestBody.search_key = this.search_input;
        }

        // Tambahkan filter date jika diisi
        if (this.date_from) {
          requestBody.date_from = this.formatDate(this.date_from);
        }
        if (this.date_to) {
          requestBody.date_to = this.formatDate(this.date_to);
        }

        const response = await axios.post("/memo/list", requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        if (data && data.data) {
          this.items = data.data.map((item) => ({
            id: item.id,
            myflow_id: item.code,
            subject: item.subject,
            ctgr_name: item.ctgr_name,
            creator: item.creator_name,
            next_approval: item.next_approve,
            created_date: item.created_date || "-",
            deadline: item.deadline || "-",
            status:
              item.next_approve.length > 0
                ? (item.next_approve[0]?.name == this.authStore.user.username ||
                    item.next_approve[1]?.name ==
                      this.authStore.user.username) &&
                  item.status == "process"
                  ? "need_approve"
                  : item.status
                : item.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    if (this.dashboardStore.search_key) {
      this.search_input = this.dashboardStore.search_key;
    }
  },
  watch: {
    search_input(newVal) {
      if (!newVal || newVal.length >= 3) {
        this.debounceTimer = setTimeout(() => {
          this.fetchMemos();
        }, 400);
        this.dashboardStore.setSearch(newVal);
      }
    },
  },
};
</script>
<style scoped>
::v-deep(
    .v-data-table
      .v-table__wrapper
      > table
      > thead
      > tr
      > th:not(.v-data-table__th--sorted)
      .v-data-table-header__sort-icon,
    .v-data-table
      .v-table__wrapper
      > table
      tbody
      > tr
      > th:not(.v-data-table__th--sorted)
      .v-data-table-header__sort-icon
  ) {
  opacity: 0.4;
}

::v-deep(.v-data-table thead) {
  /* background: url("@/assets/background.png") no-repeat center center;
  background-size: cover; */
}

::v-deep(.v-data-table thead th) {
  color: #ff5722 !important;
  font-weight: bolder;
}
</style>
