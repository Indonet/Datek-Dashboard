<!-- Tinggal setting Date Monitor -->
<template>
  <div>
    <v-alert
      v-if="note"
      v-model="alert"
      border="start"
      title="Note"
      type="warning"
      variant="outlined"
      class="mb-6"
    >
      {{ note }}
    </v-alert>

    <div class="mb-3" v-if="this.approvers.length > 0">
      <h3>Approval List</h3>
    </div>
    <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
    <v-row class="mt-n3" v-for="(approver, index) in approvers" :key="index">
      <v-col cols="12" sm="8" class="mt-3 mt-sm-0 mb-n6 mb-sm-0">
        <v-text-field
          v-if="approver.type == 'fixed' || approver.type == 'group'"
          v-model="selectedApproval[index].name"
          variant="outlined"
          density="compact"
          readonly
          bg-color="grey-lighten-4"
        >
          <template #label>
            <span> Approval - {{ index + 1 }} </span>
          </template>
        </v-text-field>

        <v-autocomplete
          v-for="i in approver.selectNum"
          :key="i"
          v-if="approver.type == 'select'"
          v-model="selectedApproval[index + (i - 1)]"
          :items="
            filteredApproverGroup(index + (i - 1), approver.approverGroup)
          "
          item-title="name"
          :item-value="(obj) => obj"
          variant="outlined"
          density="compact"
          class="mb-3"
          placeholder="Select an Approver"
          persistent-placeholder
        >
          <template #label>
            <span>
              Approval - {{ index + i }} <span class="text-error">*</span>
            </span>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="4">
        <!-- <v-menu
          v-if="approver.type == 'fixed' || approver.type == 'group'"
          v-model="menu[index]"
          :close-on-content-click="false"
          location="center"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedDate[index]"
              density="compact"
              label="Target Date"
              variant="outlined"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              readonly
              :error-messages="error_message_date[index]"
              :rules="[(v) => !!v || 'Target Date is required']"
              :disabled="!selectedApproval[index]"
              v-bind="props"
              @click="menu[index] = true"
              @click:clear="formattedDate[index] = null"
            />
          </template>

          <div class="position-relative">
            <v-date-picker
              v-model="model[index]"
              color="orange-darken-4"
              elevation="24"
              height="auto"
              :hide-header="true"
              show-adjacent-months
              :min="new Date().toISOString().split('T')[0]"
              @update:modelValue="handleDateChange(index)"
            />
          </div>
        </v-menu> -->

        <v-menu
          v-if="approver.type == 'fixed' || approver.type == 'group'"
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
              :error-messages="error_message_date[index]"
              :rules="[(v) => !!v || 'Target Date is required']"
              :disabled="!selectedApproval[index]"
              v-bind="props"
              @click="menu[index] = true"
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
          />
        </v-menu>
        <!-- <v-menu
          v-if="approver.type == 'select'"
          v-for="i in approver.selectNum"
          :key="i"
          v-model="menu[index + (i - 1)]"
          :close-on-content-click="true"
          location="center"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="formattedDate[index + (i - 1)]"
              density="compact"
              label="Target Date"
              variant="outlined"
              hide-details="auto"
              prepend-inner-icon="mdi-calendar"
              style="margin-bottom: 34px"
              readonly
              :error-messages="error_message_date[index]"
              :rules="[(v) => !!v || 'Target Date is required']"
              :disabled="!selectedApproval[index + (i - 1)]"
              v-bind="props"
              @click:clear="formattedDate[index + (i - 1)] = null"
            >
              <template #label>
                <span>
                  Target Date - {{ index + i }}<span class="text-error">*</span>
                </span>
              </template>
            </v-text-field>
          </template>
          <div class="position-relative">
            <v-date-picker
              v-model="model[index + (i - 1)]"
              color="orange-darken-4"
              elevation="24"
              height="auto"
              :hide-header="true"
              show-adjacent-months
              :min="new Date().toISOString().split('T')[0]"
              @update:modelValue="handleDateChange(model, index + (i - 1))"
            />
          </div>
        </v-menu> -->
      </v-col>
    </v-row>

    <div class="text-red" v-if="error_messages.length > 0">
      {{ error_messages }}
    </div>
    <div
      class="my-3"
      v-if="this.monitors.length > 0 || !(this.selectedMonitor.length > 0)"
    >
      <h3>Monitor List</h3>
    </div>
    <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>
    <v-row v-for="(monitor, index) in monitors" :key="index">
      <v-col cols="12">
        <v-text-field
          v-if="selectedMonitor.length > 0"
          v-model="selectedMonitor[index].name"
          variant="outlined"
          density="compact"
          item-text="djdshfjsdhf"
          readonly
          bg-color="grey-lighten-4"
        >
          <template #label>
            <span> Monitor - {{ index + 1 }} </span>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <!-- <SelectMonitoringRevision
      v-if="this.monitors.length > 0 || this.initialMonitor.length > 0 && (this.selectedMonitor.length > 0)"
      :initialMonitor="filteredInitialMonitor"
      :excludedIds="this.excludedIds"
      v-model="add_monitor_list"
    ></SelectMonitoringRevision> -->
    <SelectMonitoringRevision
      v-if="monitors.length"
      :initialMonitor="filteredInitialMonitor"
      :excludedIds="excludedIds"
      v-model="add_monitor_list"
    />
    <SelectMonitoringRevision
      v-else-if="initialMonitor.length"
      :initialMonitor="filteredInitialMonitor"
      :excludedIds="excludedIds"
      v-model="add_monitor_list"
    />
    <SelectMonitoring
      v-else-if="this.monitors.length > 0 || !(this.selectedMonitor.length > 0)"
      :initialMonitor="filteredInitialMonitor"
      :excludedIds="this.excludedIds"
      v-model="add_monitor_list"
    ></SelectMonitoring>
  </div>
</template>

<script>
import axios from "@/axios";
import { ref } from "vue";
import SelectMonitoringRevision from "@/components/SelectMonitoringRevision.vue";
import SelectMonitoring from "@/components/SelectMonitoring.vue";

export default {
  name: "SelectApprovalRevision",
  components: {
    SelectMonitoringRevision,
    SelectMonitoring,
  },
  props: {
    subCategoryId: {
      type: [String, Number, null],
      required: true,
    },
    categoryId: {
      type: [String, Number, null],
      required: true,
    },
    criteriaId: {
      type: [String, Number, null],
      required: true,
    },
    totalAmount: {
      type: [String, Number, null],
      required: true,
    },
    employeeId: {
      type: [String, Number, null],
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
  setup() {
    const menu = ref([]);
    return { menu };
  },
  data() {
    return {
      loading: true,
      alert: true,
      note: null,
      approvers: [],
      monitors: [],
      add_monitor_list: [""],
      all_monitor_list: [],
      selectedApproval: [],
      selectedInitApproval: [],
      selectedMonitor: [],
      model: [],
      formattedDate: [],
      excludedIds: [],
      error_messages: [],
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
        const groupedByLevel = {};

        newApprovals.forEach((approval) => {
          if (approval.target_date) {
            const formatted = this.formatDate(approval.target_date);

            if (!groupedByLevel[approval.level]) {
              groupedByLevel[approval.level] = {
                level: approval.level,
                ids: [approval.employee_id],
                names: [approval.name],
                target_date: formatted,
              };
            } else {
              groupedByLevel[approval.level].ids.push(approval.employee_id);
              groupedByLevel[approval.level].names.push(approval.name);
            }
          }
        });

        // Set formattedDate and selectedInitApproval from grouped data
        this.formattedDate = [];
        this.selectedInitApproval = [];

        Object.values(groupedByLevel).forEach((group, index) => {
          this.formattedDate[index] = group.target_date;
          this.selectedInitApproval.push({
            id: group.ids.join(","), // gabungkan semua ID jika perlu
            name: group.names.join(" OR "), // gabungkan nama dengan '&'
            target_date: group.target_date,
          });
        });
      },
      deep: true,
      immediate: true,
    },
    selectedApproval: {
      handler(newValue) {
        const formatedValue = [];
        newValue.forEach((val) => {
          formatedValue.push({
            id: val.id,
            target_date: val.target_date,
          });
        });
        this.$emit("update:modelValue", formatedValue);
      },
      deep: true,
      immediate: true,
    },
    totalAmount(newValue) {
      this.approvers = [];
      this.selectedApproval = [];
    },
    add_monitor_list(newValue) {
      const array_monitor = [];
      this.selectedMonitor.forEach((val) => {
        array_monitor.push(val.id);
      });
      newValue.forEach((val) => {
        array_monitor.push(val);
      });
      this.all_monitor_list = array_monitor;
      this.$emit("monitorList", this.all_monitor_list);
    },
  },

  async mounted() {
    await this.fetchApprovers();
  },

  methods: {
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
    // formatDate(inputDate) {
    //   const parsedDate = new Date(inputDate);
    //   const day = `0${parsedDate.getDate()}`.slice(-2);
    //   const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    //   const year = parsedDate.getFullYear();

    //   let formattedDate = `${day}-${month}-${year}`;
    //   return formattedDate;
    // },

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

    async fetchApprovers() {
      const setParamData = {
        cid: this.categoryId,
        sid: this.subCategoryId,
        am: this.totalAmount || 0,
      };
      // Jika categoryId bukan 999 (tidak punya criteria), tambahkan ke objek
      if (this.criteriaId !== 999) {
        setParamData.crid = this.criteriaId;
      }
      try {
        const response = await axios.get("/tiers/approvers", {
          params: setParamData,
        });
        this.approvers = response.data.data.approvers;
        this.monitors = response.data.data.monitors;
        this.note = response.data.data.note ? response.data.data.note : null;

        this.loading = false;

        if (this.approvers.length == 0) {
          this.error_messages = "Approvers Not Set";
        } else {
          this.error_messages = [];
        }

        // Set v-model otomatis ke array kategori dengan struktur objek
        response.data.data.approvers.forEach((val, index) => {
          if (val.type == "fixed") {
            this.formattedDate[index] = [];
            this.formattedDate[index] = this.selectedInitApproval[index]?.target_date ? this.selectedInitApproval[index]?.target_date : null;

            this.selectedApproval.push({
              id: val.approver.id,
              name: val.approver.name,
              target_date: this.formattedDate[index],
            });
            this.excludedIds.push(val.approver.id);
          }
          if (val.type == "group") {
            // Masukkan semua id ke excludedIds
            val.approverGroup.forEach((v) => {
              this.excludedIds.push(v.id);
            });
            
            // Ambil semua nama dari approverGroup dan gabungkan dengan " OR "
            const approverNames = val.approverGroup
              .map((a) => a.name)
              .join(" -  OR  - ");
            const approverID = val.approverGroup.map((a) => a.id);

            this.formattedDate[index] = [];
            this.formattedDate[index] = this.selectedInitApproval[index]?.target_date ? this.selectedInitApproval[index]?.target_date : null;
            
            this.selectedApproval.push({
              id: approverID,
              name: approverNames,
              target_date: this.formattedDate[index],
            });
          }
        });

        // Set v-model otomatis ke array kategori dengan struktur objek
        response.data.data.monitors.forEach((valMonitor) => {
          this.selectedMonitor.push({
            id: valMonitor.approver.id,
            name: valMonitor.approver.name,
          });
          if (!this.excludedIds.includes(valMonitor.approver.id)) {
            this.excludedIds.push(valMonitor.approver.id);
          }
          this.all_monitor_list.push(valMonitor.approver.id);
        });
      } catch (error) {
        console.error("Error fetching approvers:", error.message);
        this.$emit("errorFetch", error.message); // Emit selectedSubCategory ke parent
      }
    },
    
    filteredApproverGroup(index, approverGroup) {
      const selectedIds = this.selectedApproval
        .filter((_, i) => i !== index)
        .map((item) => item?.id);
      return approverGroup.filter((item) => !selectedIds.includes(item.id));
    },
  },
};
</script>
