<template>
  <v-autocomplete
    v-model="selectedSubCategories"
    :items="sub_categories"
    item-title="sub_ctgr_name"
    item-value="id"
    variant="outlined"
    density="compact"
    placeholder="Search..."
    required
    @update:model-value="sendValue(selectedSubCategories)"
    :loading="isLoading"
    :disabled="isDisabled"
    :clearable="isClearable"
    :hint="selectedIndex !== -1 ? selectedIndex : ''"
    persistent-hint
  >
    <!-- Slot untuk Label -->
    <template #label>
      <span>
        Select a Sub Categories <span class="text-error">*</span>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
import axios from "@/axios"; // Import Axios instance

export default {
  name: "SelectSubCategory",
  props: {
    categoryId: {
      type: [String, Number, null],
      required: true,
    },
  },
  data() {
    return {
      sub_categories: [],
      selectedSubCategories: null,
      amountType: null,
      currency: null,
      isLoading: false,
      isDisabled: true,
      isClearable: false,
    };
  },
  mounted() {
    this.categoryId != null ? this.fetchSubCategories(this.categoryId) : (this.isDisabled = true);
  },
  computed: {
    selectedIndex() {
      var index_val = this.sub_categories.findIndex(item => item.id === this.selectedSubCategories);
      return this.sub_categories[index_val]?.notes;
    }
  },
  watch: {
    categoryId(newValue) {
      this.selectedSubCategories = null;
      this.sub_categories = [];
      this.isClearable = true;
      newValue != null ? this.fetchSubCategories(newValue) : (this.isDisabled = true);
    },
  },
  methods: {
    async fetchSubCategories(categoryId) {
      this.isLoading = true;
      this.selectedSubCategories = null;
      try {
        const response = await axios.post(`/categories/sub_category`, {
          ctgr_id: categoryId,
        });
        this.sub_categories = response.data.data;

        this.isLoading = false;
        this.isDisabled = false;
      } catch (error) {
        this.isLoading = false;
        this.isDisabled = false;
      }
    },
    sendValue(value) {
      this.amountType = this.sub_categories.find(item => item.id === value) || null;
      this.$emit("amountType", this.amountType != null ? this.amountType.type_amount : ''); // Emit amountType ke parent
      this.$emit("currency", this.amountType != null ? this.amountType.currency : ''); 
      this.$emit("form", this.amountType != null ? this.amountType.form : ''); 
    }
  },
};
</script>