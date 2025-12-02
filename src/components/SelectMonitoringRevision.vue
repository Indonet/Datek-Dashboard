<template>
  <div
    v-for="(employee, index) in selectedMonitors"
    :key="index"
    class="d-flex align-center mt-n3"
  >
    <v-autocomplete
      v-model="selectedMonitors[index]"
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
      class="my-3"
    >
      <template #label>
        <span> Select a Monitor (Optional) </span>
      </template>
      <template v-slot:append>
        <v-btn
          v-if="selectedMonitors.length > 1"
          @click="removeEmployee(index)"
          icon
          size="x-small"
          class="mr-2 text-h6 ma-0"
        >
          -
        </v-btn>
        <v-btn
          v-if="index === selectedMonitors.length - 1"
          @click="addEmployee"
          icon
          size="x-small"
          color="orange-darken-4"
          class="text-h6 ma-0"
        >
          +
        </v-btn>
        <span v-else style="width: 32px; display: inline-block"></span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import axios from "@/axios";
import debounce from "lodash.debounce";

export default {
  name: "SelectMonitoring",
  props: {
    excludedIds: {
      type: Array,
      default: () => [],
    },
    initialMonitor: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      employees: [],
      selectedMonitors: [{ id: null, name: "" }],
      search: null,
      isLoading: true,
      isDisabled: true,
      isClearable: true,
    };
  },
  watch: {
    initialMonitor: {
      handler(value) {
        this.selectedMonitors = value
          .filter(
            (monitor) => !this.excludedIds.includes(Number(monitor.employee_id))
          ) // Pastikan tipe data cocok
          .map((monitor) => ({
            id: monitor.employee_id || null,
            name: monitor.name || "",
          }));
      },
      deep: true,
      immediate: true,
    },
    selectedMonitors: {
      deep: true,
      handler() {
        this.updateSelection();
      },
    },
    search: debounce(function () {
      this.fetchEmployees();
    }, 300),
  },
  mounted() {
    if (this.initialMonitor.length == 0) {
      this.selectedMonitors.push({ id: null, name: "" });
    }
    this.search = "";
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
          response.data.employees.map((emp) => [emp.id, emp.name || ""])
        );

        this.selectedMonitors = this.selectedMonitors ? this.selectedMonitors.map((monitor) => ({
          id: monitor.id,
          name: monitor.name || employeeMap.get(monitor.id) || "",
        })) : [];

        let newEmployees = response.data.employees
          .filter((emp) => !this.excludedIds.includes(emp.id))
          .map((emp) => ({
            id: emp.id,
            name: emp.name || "",
          }));

        const mergedEmployees = [...this.selectedMonitors];

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
        this.selectedMonitors[index] = { id: null, name: "" }; // Tangani jika input kosong
      } else {
        this.selectedMonitors[index] = value;
      }
    },
    addEmployee() {
      this.selectedMonitors.push({ id: null, name: "" });
      this.search = "";
    },
    removeEmployee(index) {
      this.selectedMonitors.splice(index, 1);
    },
    updateSelection() {
      this.$emit(
        "update:modelValue",
        this.selectedMonitors.map((emp) => emp.id)
      );
    },
    filteredEmployees(index) {
      const selectedIds = this.selectedMonitors
        .map((emp) => emp.id)
        .filter((id) => id !== null);
      return this.employees.filter(
        (emp) =>
          !selectedIds.includes(emp.id) ||
          emp.id === this.selectedMonitors[index]?.id
      );
    },
  },
};
</script>
