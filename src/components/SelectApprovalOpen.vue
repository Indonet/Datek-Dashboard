<template>
  <div class="mb-3">
    <h3>Approval List</h3>
  </div>
  <v-row
    v-for="(employee, index) in selectedApproval"
    :key="index"
    class="d-flex align-center"
  >
    <v-col cols="12" md="6" xl="7" class="pt-4 mb-n6 mb-md-0">
      <v-autocomplete
        v-model="selectedApproval[index]"
        :items="filteredEmployees(index)"
        item-title="name"
        item-value="id"
        return-object
        variant="outlined"
        density="compact"
        required
        @update:search="updateSearch"
        @update:modelValue="(value) => handleChange(value, index)"
        :loading="isLoading"
        :disabled="isDisabled"
        :clearable="isClearable"
      >
        <template #label>
          <span> Approval - {{ index + 1 }}<span class="text-error">*</span></span>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="8" md="4" class="pb-0">
      <v-menu
        v-model="menu[index]"
        :close-on-content-click="false"
        location="center"
      >
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="formattedDate[index]"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-calendar"
            readonly
            :rules="[(v) => !!v || 'Target Date is required']"
            v-bind="props"
            @click:clear="formattedDate[index] = null"
          >
            <template #label>
              <span>
                Target Date - {{ index + 1 }}<span class="text-error">*</span>
              </span>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="model[index]"
          color="orange-darken-4"
          elevation="24"
          :hide-header="true"
          :min="new Date().toISOString().split('T')[0]"
          @update:modelValue="handleDateChange(model, index)"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="4" md="2" xl="1" class="py-0 mt-n2 d-flex justify-end">
      <v-btn
        v-if="selectedApproval.length > 1"
        @click="removeEmployee(index)"
        icon
        size="x-small"
        class="mr-2 my-0 text-h6"
      >-</v-btn>
      <v-btn
        v-if="index === selectedApproval.length - 1"
        @click="addEmployee"
        icon
        size="x-small"
        color="orange-darken-4"
        class="ma-0 text-h6"
      >+</v-btn>
      <span v-else style="width: 32px; display: inline-block"></span>
    </v-col>
  </v-row>
  <div class="my-3">
    <h3>Monitor List</h3>
  </div>
  <SelectMonitoringRevision
    :initialMonitor="filteredInitialMonitor"
    :excludedIds="this.excludedIds"
    v-model="add_monitor_list"
  ></SelectMonitoringRevision>
</template>

<script>
import axios from "@/axios";
import debounce from "lodash.debounce";
import SelectMonitoringRevision from "@/components/SelectMonitoringRevision.vue";

export default {
  name: "SelectApprovalOpen",
  components: {
    SelectMonitoringRevision,
  },
  props: {
    forbidenIds: {
      type: Array,
      default: () => [],
    },
    initialApprovals: {
      type: Array,
      default: () => [],
    },
    initialMonitor: {
      type: Array,
      default: () => [],
    },
    error_message_date: {
      type: [Array],
    },
  },
  data() {
    return {
      employees: [],
      selectedApproval: [{ id: null, name: "", target_date: null }],
      selectedMonitor: [],
      add_monitor_list: [""],
      all_monitor_list: [],
      model: [],
      formattedDate: [],
      menu: [],
      excludedIds: this.forbidenIds,
      search: null,
      isLoading: true,
      isDisabled: true,
      isClearable: true,
    };
  },
  computed: {
    filteredInitialMonitor() {
      const filtered = this.initialMonitor.filter(
        (im) => !this.selectedMonitor.some((sm) => sm.id == im.employee_id)
      );
      return filtered.length > 0 ? filtered : [];
    },
  },
  watch: {
    initialApprovals: {
      handler(newApprovals) {
        newApprovals.forEach((approvals, index) => {
          if (approvals.target_date) {
            const formatted = this.formatDate(approvals.target_date);
            this.formattedDate[index] = formatted;
            // this.selectedApproval.push({
            //   id: approvals.employee_id,
            //   name: approvals.name,
            //   target_date: formatted,
            // });
            this.selectedApproval[index] = {
              id: approvals.employee_id,
              name: approvals.name,
              target_date: formatted,
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
    selectedApproval: {
      deep: true,
      handler() {
        this.updateSelection();
      },
    },
    add_monitor_list(newValue) {
      const array_monitor = [];
      newValue.forEach((val) => {
        array_monitor.push(val);
      });
      this.all_monitor_list = array_monitor;
      this.$emit("monitorList", this.all_monitor_list);
    },
    search: debounce(function () {
      this.fetchEmployees();
    }, 300),
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await axios.get("/employees", {
          params: {
            page: 1,
            size: 10,
            q: this.search || "",
          },
        });

        const employeeMap = new Map(
          response.data.employees.map((emp) => [
            emp.id,
            emp.name,
            emp.target_date || "",
          ])
        );

        this.selectedApproval = this.selectedApproval.map((approval) => ({
          id: approval.id,
          name: approval.name || employeeMap.get(approval.id) || "",
          target_date: approval.target_date,
        }));

        let newEmployees = response.data.employees
          .filter((emp) => !this.forbidenIds.includes(emp.id))
          .map((emp) => ({
            id: emp.id,
            name: emp.name || "",
            target_date: null,
          }));

        const mergedEmployees = [...this.selectedApproval];

        newEmployees.forEach((emp) => {
          if (!mergedEmployees.some((e) => e.id === emp.id)) {
            mergedEmployees.push(emp);
          }
        });

        this.employees = mergedEmployees.filter((emp) => emp.id !== null);

        this.isLoading = false;
        this.isDisabled = false;
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      }
    },
    updateSearch(value) {
      this.search = value;
    },
    handleChange(value, index) {
      if (!value) {
        this.selectedApproval[index] = { id: null, name: "", target_date: null }; // Tangani jika input kosong
        this.formattedDate[index] = null;
        this.model[index] = null;
      } else {
        this.selectedApproval[index] = value;
        this.formattedDate[index] = null;
        this.model[index] = null;
      }
    },
    addEmployee() {
      this.selectedApproval.push({ id: null, name: "", target_date: null });
      this.search = "";
    },
    removeEmployee(index) {
      this.selectedApproval.splice(index, 1);
      this.formattedDate.splice(index, 1);
    },
    updateSelection() {
      this.$emit(
        "update:modelValue",
        this.selectedApproval.map((emp) => ({
          id: emp.id,
          target_date: emp.target_date,
        }))
      );
    },
    filteredEmployees(index) {
      const selectedIds = this.selectedApproval
        .map((emp) => emp.id)
        .filter((id) => id !== null);
      return this.employees.filter(
        (emp) =>
          !selectedIds.includes(emp.id) ||
          emp.id === this.selectedApproval[index]?.id
      );
    },

    handleDateChange(newDate, index) {
      this.formattedDate[index] = this.formatDate(newDate[index]);
      if (this.selectedApproval[index]) {
        this.selectedApproval[index].target_date = this.formattedDate[index];
      } else {
        this.selectedApproval[index] = {
          target_date: this.formattedDate[index],
        };
      }
      this.menu[index] = false;
    },

    formatDate(inputDate) {
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
      let formattedDate = `${day} ${month} ${year}`;
      return formattedDate;
    },
  },
};
</script>
