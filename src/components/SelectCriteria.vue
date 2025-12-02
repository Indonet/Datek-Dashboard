<template>
  <div>
    <v-text-field
      v-if="skipedOption"
      v-model="skipedOption"
      variant="outlined"
      density="compact"
      label="Select a Criteria"
      :disabled="isDisabled"
    >
      <template #label>
        <span> Select a Criteria <span class="text-error">*</span> </span>
      </template>
    </v-text-field>
    <v-autocomplete
      v-else
      v-model="selectedCriteria"
      :items="criteria"
      item-title="crtr_name"
      item-value="id"
      variant="outlined"
      density="compact"
      placeholder="Search..."
      required
      :loading="isLoading"
      :disabled="isDisabled"
      :clearable="isClearable"
    >
      <template #label>
        <span> Select a Criteria <span class="text-error">*</span> </span>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "SelectCriteria",
  props: {
    subCategoryId: {
      type: [String, Number, null],
      required: true,
    },
    categoryId: {
      type: [String, Number, null],
      required: true,
    },
    modelValue: {
      // Menangani v-model dari parent
      type: [String, Number, null],
      default: null,
    },
  },
  data() {
    return {
      criteria: [],
      selectedCriteria: this.modelValue, // Inisialisasi dari v-model
      isLoading: false,
      isDisabled: true,
      isClearable: false,
      skipedOption: null,
    };
  },
  watch: {
    subCategoryId(newValue) {
      this.selectedCriteria = null;
      this.criteria = [];
      this.isClearable = true;
      newValue != null
        ? this.fetchCriteria(newValue, this.categoryId)
        : (this.isDisabled = true);
    },
    modelValue(newValue) {
      // Update selectedCriteria jika modelValue berubah dari parent
      this.selectedCriteria = newValue;
    },
    selectedCriteria(newValue) {
      this.$emit("update:modelValue", newValue);
      const selected = this.criteria.find((item) => item.id == newValue);
      if (selected) {
        this.$emit("crtrId", selected.criteria_id);
      }
    },
  },
  mounted() {
    if (this.subCategoryId) {
      this.fetchCriteria(this.subCategoryId, this.categoryId);
    }
  },
  methods: {
    async fetchCriteria(subCategoryId, categoryId) {
      this.skipedOption = null;
      if (subCategoryId != 999) {
        this.isLoading = true;
        try {
          const response = await axios.post(`/categories/criteria_mapping`, {
            sub_ctgr_id: subCategoryId,
            ctgr_id: categoryId,
          });
          if (response.data.data.length > 0) {
            this.criteria = response.data.data;
            this.isDisabled = false;
            // Jika modelValue ada, set selectedCriteria yang sesuai
            if (this.modelValue) {
              const found = this.criteria.find(
                (item) => item.id == this.modelValue
              );
              if (found) this.selectedCriteria = found.id;
            }
          } else {
            this.isDisabled = true;
            this.skipedOption = "-";
            this.$emit("skipCriteria", true);
          }
        } catch (error) {
          console.error("Error fetching criteria:", error.message);
          this.isDisabled = false;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
};
</script>
