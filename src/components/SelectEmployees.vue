<template>
  <v-autocomplete
    v-model="selectedEmployee"
    :items="employees"
    item-title="name"
    item-value="id"
    variant="outlined"
    density="compact"
    required
    @update:search="(value) => { updateSearch(value); sendValue(selectedEmployee); }"
    :loading="isLoading"
    :disabled="isDisabled"
    :clearable="isClearable"
  >
    <!-- Slot untuk Label -->
    <template #label>
      <span>
        Select an Employee <span class="text-error">*</span>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from "@/axios"; // Import Axios instance
import debounce from "lodash.debounce"; // Import debounce dari lodash

export default {
  name: 'SelectEmployees',
  data() {
    return {
      employees: [], // Array to store employees
      selectedEmployee: null, // Initialize with the value prop
      search: null,
      isLoading: true,
      isDisabled: true,
      isClearable: true,
      company_name: null
    };
  },
  watch: {
    selectedEmployee(newValue) {
      this.$emit('update:value', newValue);
    },
    search: debounce(function (newSearch) {
      this.fetchEmployees(newSearch);
    }, 300),
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    async fetchEmployees(query) {
      this.isLoading = true; // Set loading sebelum request
      try {
        const response = await axios.get("/employees", {
          params: {
            page: 1,
            size: 10,
            q: query || "", // Hindari `undefined`
          },
        });
        this.employees = response.data.employees;
        this.isDisabled = false;
      } catch (error) {
        console.error("Error fetching employees:", error.message);
      } finally {
        this.isLoading = false; // Set loading selesai
      }
    },
    updateSearch(value) {
      this.search = value; // Mengupdate search ketika user mengetik
    },
    sendValue(value) {
      this.company_name = this.employees.find(item => item.id === value) || null;
      this.$emit("updateData", this.company_name ? this.company_name.company : '');
    }
  },
};
</script>
