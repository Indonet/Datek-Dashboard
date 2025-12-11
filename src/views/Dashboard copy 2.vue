<template>
    <v-card>
      <v-row class="mt-3 px-2">
        <v-col cols="12" lg="7" xl="6">
          <v-layout class="overflow-visible" style="height: 40px">
            <v-bottom-navigation
              v-model="value"
              bg-color="grey-lighten-4"
              elevation="0"
              class="bottom-nav-wrapper rounded"
              mandatory
            >
              <div
                class="bottom-nav-scroll"
              >
                <v-btn
                  v-for="(item, index) in navItems"
                  :key="index"
                  class="nav-btn mt-0 mx-0 rounded-0"
                  :color="$root.getStatusClass(color)"
                >
                  <v-icon>{{ item.icon }}</v-icon>
                  <span class="text-caption">{{ item.label }}</span>
                </v-btn>
              </div>
            </v-bottom-navigation>
          </v-layout>
        </v-col>
        <v-col cols="8" sm="10" lg="3" xl="4" class="mx-0 px-0">
          <v-text-field
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            placeholder="Search..."
            persistent-placeholder
            single-line
            class="mt-n4 ml-3 ml-lg-0 rounded-xl"
            v-model="search_input"
          ></v-text-field>
        </v-col>
        <v-col cols="4" sm="2" lg="2" xl="2">
          <!-- <v-row class="d-flex justify-space-between"> -->
          <div class="mt-n3 d-flex justify-space-between">
            <v-btn
              variant="tonal"
              stacked
              size="x-small"
              @click="showFilterDialog = true"
              prepend-icon="mdi-filter-plus"
              class="bg-orange-darken-4 mt-n1 px-0 mx-0"
              style="flex: 1; width: 100%"
            >
              Filter
            </v-btn>
            <router-link
              to="/create"
              class="pl-1"
              style="flex: 1"
              v-show="!$vuetify.display.mobile"
            >
              <v-btn
                variant="tonal"
                stacked
                size="x-small"
                prepend-icon="mdi-pencil-outline"
                class="bg-orange-darken-4 mt-n1 px-0 mx-0"
                style="width: 100%"
              >
                Create
              </v-btn>
            </router-link>
          </div>
          <!-- </v-row> -->
        </v-col>
      </v-row>

      <v-row class="pt-1" no-gutters>
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
          class="ml-2 text-primary cursor-pointer hover:underline hover:text-red-darken-2"
          v-if="formattedDateFrom || formattedDateTo"
        >
          Reset Filter
        </span>
        <!-- <v-data-table :items="items" class="elevation-1 primary">
              <template v-slot:header="{ props }">
                  <thead>
                      <tr>
                          <th v-for="header in props.headers" :key="header.text">
                              {{ header.text }}
                          </th>
                      </tr>
                  </thead>
              </template>
        </v-data-table> -->
        <!-- {{ this.dashboardStore.status_filter }} -->
        <!-- {{ this.authStore.user.signature }} -->

        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page-options="item_per_page"
          sort-asc-icon="mdi-chevron-up"
          sort-desc-icon="mdi-chevron-down"
          class="elevation-1 primary mt-0"
        >
          <!-- Custom Header -->
          <!-- <template v-slot:header.myflow_id="{ column }">
                <span class="text-orange-darken-4">{{ column.title }}</span>
            </template>
            <template v-slot:header.subject="{ column }">
                <span class="text-orange-darken-4">{{ column.title }}</span>
            </template> -->

          <!-- Custom Cells -->
          <template v-slot:item.myflow_id="{ item }">
            <router-link
              :to="item.status == 'draft' ? `/draft/${item.id}` : `/details/${item.id}`"
              class="text-decoration-none text-primary"
            >
              <b>{{ item.myflow_id }}</b> <br />
              <span class="text-grey">{{ item.ctgr_name }}</span>
            </router-link>
          </template>
          <template v-slot:item.subject="{ item }">
            <router-link
              :to="item.status == 'draft' ? `/draft/${item.id}` : `/details/${item.id}`"
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
              <span
                v-for="(approval, index) in item.next_approval"
                :key="index"
              >
                {{ approval.name }}
                <span v-if="index !== item.next_approval.length - 1"
                  ><b>OR </b></span
                >
              </span>
            </span>
            <span v-else-if="item.next_approval.length > 0">
              <b>Next Approval: </b>
              <span
                v-for="(approval, index) in item.next_approval"
                :key="index"
              >
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
                @click="downloadMemo(item.id)"
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
              <span
                v-if="item.status == 'need_approve' && this.need_approve_btn"
                >Need Approve</span
              >
              <span v-else>{{ item.status }}</span>
            </v-chip>
          </template>
        </v-data-table>
      </v-row>
    </v-card>

    <v-fab
      v-show="$vuetify.display.smAndDown"
      icon="mdi-plus"
      color="orange-darken-4"
      class="fab"
      @click="$router.push('/create');"
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
import { useAuthStore } from "../stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";

export default {
  components: {
    useAuthStore,
    useDashboardStore,
  },
  data() {
    return {
      authStore: useAuthStore(),
      dashboardStore: useDashboardStore(),
      search_input: "",
      loading: true,

      showFilterDialog: false, // Menampilkan popup filter
      menuStartDate: false, // Kontrol menu untuk Start Date
      menuEndDate: false, // Kontrol menu untuk End Date
      date_from: null, // Tanggal awal (format YYYY-MM-DD)
      date_to: null, // Tanggal akhir (format YYYY-MM-DD)
      formattedDateFrom: "", // Tanggal awal dalam format tampilan
      formattedDateTo: "", // Tanggal akhir dalam format tampilan
      value: useDashboardStore().status_filter - 1,
      navItems: [
        { icon: "mdi-file-outline", label: "My Memo" },
        { icon: "mdi-clock-alert", label: "Need My Approval" },
        { icon: "mdi-sync", label: "On Process" },
        { icon: "mdi-pencil-circle-outline", label: "Revision" },
        { icon: "mdi-close-circle-outline", label: "Rejected" },
        { icon: "mdi-cancel", label: "Cancelled" },
        { icon: "mdi-monitor-multiple", label: "Monitoring" },
        { icon: "mdi-file-multiple", label: "All Memo" },
      ],
      status_type: "needaprove",
      headers: [
        {
          title: "MyFlow ID",
          value: "myflow_id",
          sortable: true,
        },
        {
          title: "Subject",
          value: "subject",
          sortable: true,
        },
        {
          title: "Creator",
          value: "creator",
          sortable: true,
        },
        {
          title: "Progress",
          value: "next_approval",
          sortable: true,
        },
        {
          title: "Created Date",
          value: "created_date",
          sortable: true, // Aktifkan fitur sorting
        },
        {
          title: "Memo Deadline",
          value: "deadline",
          sortable: true,
        },
        {
          title: "Status",
          value: "status",
          sortable: true,
        },
      ],
      item_per_page: [
        { value: 10, title: "10" },
        { value: 25, title: "25" },
        { value: 50, title: "50" },
        { value: 100, title: "100" },
      ],
      items: [],
      need_approve_btn: false,
    };
  },
  methods: {
    async fetchUser() {
      try {
        // Ambil data profil karyawan
        const response = await axios.get("/employees/profile");
        this.user = response.data.employee;

        // Setelah user.id ada, cek tanda tangan
        if (!this.user.signature) {
          this.$router.push("/profile");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async downloadMemo(val) {
      try {
        // const response = await axios.post('/media/memo/pdf', { memo_id: parseInt(val) });
        window.open(
          `/api/media/memo/${val}/download`,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    },
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
                ? (item.next_approve[0]?.name == this.authStore.user.username || item.next_approve[1]?.name == this.authStore.user.username) &&
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
    this.fetchUser();
    if (this.dashboardStore.status_filter.constructor === Object) {
      this.value = 1;
    }
    if (this.dashboardStore.search_key) {
      this.search_input = this.dashboardStore.search_key;
    }
  },
  watch: {
    status_type() {
      this.fetchMemos();
    },
    search_input(newVal) {
      if (!newVal || newVal.length >= 3) {
        this.debounceTimer = setTimeout(() => {
          this.fetchMemos();
        }, 400);
        this.dashboardStore.setSearch(newVal);
      }
    },
  },
  computed: {
    color() {
      switch (this.value + 1) {
        case 1: {
          this.status_type = "self";
          this.dashboardStore.setFilters(1);
          return "my_memo";
        }
        case 2: {
          this.status_type = "need_appr";
          this.need_approve_btn = true;
          this.dashboardStore.setFilters(2);
          return "need_approve";
        }
        case 3: {
          this.status_type = "process";
          this.need_approve_btn = false;
          this.dashboardStore.setFilters(3);
          return "process";
        }
        case 4: {
          this.status_type = "revision";
          this.dashboardStore.setFilters(4);
          return "revision";
        }
        case 5: {
          this.status_type = "reject";
          this.dashboardStore.setFilters(5);
          return "rejected";
        }
        case 6: {
          this.status_type = "cancel";
          this.dashboardStore.setFilters(6);
          return "cancelled";
        }
        case 7: {
          this.status_type = "monitor";
          this.dashboardStore.setFilters(7);
          return "monitoring";
        }
        case 8: {
          this.status_type = "all";
          this.dashboardStore.setFilters(8);
          return "all";
        }
        // default: {
        //   this.status_type = "all";
        //   return "blue-grey";
        // }
      }
    },
  },
};
</script>
<style scoped>
.fab {
  position: fixed;
  bottom: 48px;
  right: 88px;
  z-index: 1000;
}

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
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.15);
}

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
  background: url("@/assets/background.png") no-repeat center center;
  background-size: cover;
}

::v-deep(.v-data-table thead th) {
  color: white !important;
  /* Warna teks */
  font-weight: bold;
}
</style>
