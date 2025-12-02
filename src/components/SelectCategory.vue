<template>
  <v-autocomplete
    v-model="selectedCategory"
    :items="categories"
    item-title="ctgr_name"
    item-value="id"
    variant="outlined"
    density="compact"
    placeholder="Search..."
    required
    @update:model-value="sendValue(selectedCategory)"
    :loading="isLoading"
    :disabled="isDisabled"
    :clearable="isClearable"
    :rules="[rules.required]"
    :hint="selectedCategory ? null : 'Please Select a Category First'"
    persistent-hint
  >
    <!-- Slot untuk Label -->
    <template #label>
      <span>
        Select a Category <span class="text-error">*</span>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from "@/axios"; // Import Axios instance

export default {
  name: 'SelectCatagory',
  props: {
    companyName: {
      type: [String, Number, null],
      required: true,
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      categoryType: null,
      isLoading: null,
      isDisabled: true,
      isClearable: true,
      rules: {
        required: value => !!value || 'Category is required',
      },
    };
  },
  watch: {
    selectedCategory(newValue) {
      this.$emit('update:value', newValue);
    },
    companyName(newValue) {
      this.categories = [];
      this.selectedCategory = null;
      this.isClearable = true;
      newValue ? this.fetchCategories() : this.isDisabled = true;
    }
  },
  mounted() {
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.post("/categories/category",{
          cmpy_name: this.companyName
        });
        this.categories = response.data.data;
        this.isLoading = false;
        this.isDisabled = false;
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        this.isLoading = false;
      }
    },
    sendValue(value) {
      this.categoryType = this.categories.find(item => item.id === value) || null;
      this.$emit("categoryType", this.categoryType != null ? this.categoryType.ctgr_type : ''); // Emit selectedSubCategory ke parent
    }
  },
};
</script>
