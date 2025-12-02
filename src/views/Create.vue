<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card class="text-white bg-animate" flat>
              <v-card-title class="d-flex text-white align-center py-3">
                <h2 v-show="!$vuetify.display.mobile">Create My Flow</h2>
                <h4 v-show="$vuetify.display.mobile">Create My Flow</h4>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="this.user.is_multi_company">
            <v-select
              v-model="selectedCompany"
              label="Select Company"
              density="compact"
              class="mb-n3"
              :items="['Indonet', 'Edge']"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <SelectCategory
              v-model="selectedCategory"
              :companyName="selectedCompany ? selectedCompany : company_name"
              @categoryType="handleTypeCategory"
            />
          </v-col>
          <v-col v-if="selectedCategory ? category_type == 'fix' : true" cols="12" class="mt-n3">
            <SelectSubCategory
              v-model="selectedSubCategory"
              :categoryId="selectedCategory"
              @amountType="handleTypeAmount"
              @currency="handleCurrency"
              @form="handleForm"
            />
          </v-col>
          <v-col v-if="selectedCategory ? category_type == 'fix' : true" cols="12" class="mt-n3">
            <SelectCriteria
              v-model="selectedCriteriaMap"
              :subCategoryId="selectedSubCategory || 999"
              :categoryId="selectedCategory"
              @skipCriteria="selectedCriteriaMap = 999"
              @crtrId="handleCriteriaId"
            />
          </v-col>
          <v-row v-if="selectedAmountType == 'perpax'" class="px-3">
            <v-col cols="12" sm="5">
              <v-text-field
                :prefix="selectedCurrency"
                suffix="/pax"
                variant="outlined"
                density="compact"
                v-model="formatAmountPerPax"
                @keypress="validateNumber"
                @paste.prevent
                :disabled="selectedCriteriaMap == null"
                :hint="amount_hint"
                persistent-hint
              >
                <template #label>
                  <span>
                    Amount per Pax <span class="text-error">*</span>
                  </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="2" class="mt-n4 mt-sm-0">
              <v-text-field
                variant="outlined"
                density="compact"
                type="number"
                v-model="quantity"
                :disabled="selectedCriteriaMap == null"
              >
                <template #label>
                  <span> Qty <span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="5" class="mt-n4 mt-sm-0">
              <v-text-field
                label="Total Amount"
                :prefix="selectedCurrency"
                variant="outlined"
                density="compact"
                v-model="formatTotalAmountPerPax"
                readonly
                bg-color="grey-lighten-4"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-col
            cols="12"
            v-if="selectedAmountType == 'percentage'"
            class="mt-n3"
          >
            <v-text-field
              suffix="%"
              variant="outlined"
              density="compact"
              v-model="formatPercentage"
              @keypress="validateFloatNumber"
              @paste.prevent
              :disabled="selectedCriteriaMap == null"
              :hint="amount_hint"
              persistent-hint
            >
              <template #label>
                <span> Percentage <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="12"
            v-if="selectedAmountType == 'amount' && selectedCurrency != 'USD'"
            class="mt-n3"
          >
            <v-text-field
              :prefix="selectedCurrency"
              variant="outlined"
              density="compact"
              v-model="formatTotalAmount"
              @keypress="validateNumber"
              @paste.prevent
              :disabled="selectedCriteriaMap == null"
              :hint="amount_hint"
              persistent-hint
            >
              <template #label>
                <span> Total Amount <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="12"
            v-if="selectedAmountType == 'amount' && selectedCurrency == 'USD'"
            class="mt-n3"
          >
            <v-text-field
              :prefix="selectedCurrency"
              variant="outlined"
              density="compact"
              v-model="formatTotalAmountUSD"
              @keypress="validateNumberUSD"
              @paste.prevent
              :disabled="selectedCriteriaMap == null"
              :hint="amount_hint"
              persistent-hint
            >
              <template #label>
                <span> Total Amount <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>
          
          <v-col
            v-if="totalAmount != null || totalAmountPax > 0"
            cols="12"
            class="mt-n3 mb-3"
          >
            <v-btn
              v-if="
                manual_approval_btn == false && generate_approval_btn == false
              "
              color="orange-darken-4"
              variant="flat"
              @click="
                generate_approval_btn = true;
                errSelectApproval = null;
              "
            >
              Generate Approval List
            </v-btn>
            <v-btn
              v-if="
                manual_approval_btn == false &&
                generate_approval_btn == false &&
                (selectedCompany == 'Edge' || company_name == 'Edge')
              "
              color="orange-darken-4"
              variant="flat"
              @click="
                manual_approval_btn = true;
                errSelectApproval = null;
              "
            >
              Manual Approval List
            </v-btn>
            <v-btn
              v-if="
                (generate_approval_btn || manual_approval_btn) &&
                (selectedCompany == 'Edge' || company_name == 'Edge')
              "
              color="grey-lighten-4"
              variant="flat"
              @click="
                generate_approval_btn = false;
                manual_approval_btn = false;
              "
            >
              Reset Approval List
            </v-btn>
            {{ errSelectApproval }}
          </v-col>

          <v-col cols="12" class="mt-n3" v-if="generate_approval_btn">
            <SelectApproval
              v-model="selectedApproval"
              :employeeId="selectedEmployee"
              :subCategoryId="selectedSubCategory"
              :categoryId="selectedCategory"
              :criteriaId="selectedCriteriaMap"
              :totalAmount="
                (selectedAmountType == 'percentage'
                  ? parseFloat(totalAmount.replace(/,/g, '.'))
                  : totalAmount) || amountPerPax
              "
              :error_message_date="err_target_date"
              @monitorList="handleMonitorList"
              @errorFetch="handleError"
            ></SelectApproval>
          </v-col>
          <v-col
            cols="12"
            class="mt-n3 py-0"
            v-if="
              (category_type == 'custom' || manual_approval_btn) &&
              !generate_approval_btn
            "
          >
            <SelectApprovalOpen
              v-model="selectedApproval"
              :forbidenIds="this.forbidenIds"
              @monitorList="handleMonitorList"
            ></SelectApprovalOpen>
          </v-col>
        </v-row>

        <v-divider class="mb-12 mt-5"></v-divider>

        <v-row>
          <v-col cols="12">
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="subject"
              ref="subjectInput"
              :error-messages="err_subject"
            >
              <template #label>
                <span> Subject <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" class="mt-n5">
            <ExampleWangEditor v-model="content"></ExampleWangEditor>
          </v-col>
          <v-col cols="12" class="mt-3">
            <SelectMultiFiles @files-updated="handleFilesUpdated" />
          </v-col>
        </v-row>
        <!-- <div>
          <p>Selected Employee: {{ selectedEmployee }}</p>
          <p>Selected Category ID: {{ selectedCategory }}</p>
          <p>Selected Sub Category ID: {{ selectedSubCategory }} - {{ ['70', '71', '72'].includes(selectedSubCategory) ? selectedSubCategory : null }}</p> 
          <p>Amount type: {{ selectedAmountType }} {{ selectedCurrency }}</p>
          <p>Selected Criteria Map: {{ selectedCriteriaMap }}</p>
          <p>Selected Criteria ID: {{ selectedCriteriaID }}</p>
          <p>Amount Per Pax: {{ amountPerPax }}</p>
          <p>Quantity: {{ quantity }}</p>
          <p>Total Amount: {{ totalAmount }}</p>
          <p>error: {{ errSelectApproval }}</p>
          <p>Approval: {{ selectedApproval }}</p>
          <p>Monitor: {{ selectedMonitor }}</p>
          <p>{{ subject }}</p>
          <p>{{ content }}</p>
          <p>Files Uploaded {{ selectedFiles }}</p>
        </div> -->
        <v-divider class="my-4"></v-divider>
        <v-card-actions class="px-0">
          <v-spacer v-show="$vuetify.display.mdAndUp"></v-spacer>
          <v-btn class="ma-0 px-0" color="medium-emphasis" @click="this.$router.back()"
            >Cancel</v-btn
          >
          <v-btn
            class="ma-0"
            :prepend-icon="!$vuetify.display.smAndDown ? 'mdi-sd' : ''"
            variant="flat"
            color="blue-grey"
            @click="validateForm('draft')"
            >Save Draft</v-btn
          >
          <v-btn
            :prepend-icon="!$vuetify.display.smAndDown ? 'mdi-send' : ''"
            class="px-6 ma-0"
            variant="flat"
            color="orange-darken-4"
            @click="showModal = true"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Snackbar Alert -->
  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    location="top right"
    color="orange-darken-4"
  >
    {{ snackbarMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <!-- MODAL -->
  <v-dialog v-model="showModal" max-width="400" persistent>
    <v-card>
      <v-card-title class="headline">Confirm Submit</v-card-title>
      <v-card-text> Are you sure all data is correct? </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="medium-emphasis" @click="showModal = false">Close</v-btn>
        <v-btn
          color="orange-darken-4"
          variant="flat"
          @click="validateForm(), (showModal = false)"
          >Yes</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import SelectEmployees from "@/components/SelectEmployees";
import SelectCategory from "@/components/SelectCategory";
import SelectSubCategory from "@/components/SelectSubCategory";
import SelectCriteria from "@/components/SelectCriteria.vue";
import ExampleWangEditor from "@/components/ExampleWangEditor.vue";
import SelectMultiFiles from "@/components/SelectMultiFiles.vue";
import SelectApproval from "@/components/SelectApproval.vue";
import SelectApprovalOpen from "@/components/SelectApprovalOpen.vue";

export default {
  components: {
    useAuthStore,
    useRouter,
    SelectEmployees,
    SelectCategory,
    SelectSubCategory,
    SelectCriteria,
    ExampleWangEditor,
    SelectMultiFiles,
    SelectApproval,
    SelectApprovalOpen,
  },
  data() {
    return {
      forbidenIds: null,
      router: useRouter(),
      selectedCompany: null,
      selectedEmployee: null,
      company_name: null,
      category_type: 'fix',
      selectedCategory: null,
      selectedSubCategory: null,
      selectedAmountType: null,
      selectedCurrency: null,
      selectedCriteriaMap: null,
      selectedCriteriaID: null,
      amountPerPax: null,
      quantity: null,
      totalAmountPax: null,
      totalAmount: null,
      generate_approval_btn: false,
      manual_approval_btn: false,
      selectedApproval: null,
      selectedMonitor: null,
      subject: null,
      content: "",
      selectedFiles: null,
      rawValue: null,
      errSelectApproval: null,
      err_target_date: [],
      err_subject: null,
      formData: {},
      user: {},
      showModal: false,
      snackbar: false,
      snackbarMessage: "",
      amount_hint:
        "Amounts refer to the selling price/transaction value, excluding applicable VAT collection and PPh deductions.",
    };
  },
  mounted() {
    useAuthStore().login();
    this.fetchUser();
  },
  computed: {
    formatAmountPerPax: {
      get() {
        return this.amountPerPax !== null
          ? new Intl.NumberFormat("id-ID").format(this.amountPerPax) // Format ke Rupiah (tanpa simbol)
          : "";
      },
      set(value) {
        this.amountPerPax = Number(value.replace(/\D/g, "")); // Menghapus non-angka
      },
    },
    formatTotalAmountPerPax: {
      get() {
        return this.totalAmountPax !== null
          ? new Intl.NumberFormat("id-ID").format(this.totalAmountPax) // Format ke Rupiah (tanpa simbol)
          : "";
      },
      set(value) {
        this.totalAmountPax = Number(value.replace(/\D/g, "")); // Menghapus non-angka
      },
    },
    formatPercentage: {
      get() {
        return this.totalAmount;
      },
      set(value) {
        // Hanya izinkan angka dan koma (",")
        let sanitizedValue = value.replace(/[^\d,]/g, "");

        // Pastikan hanya ada satu koma
        const parts = sanitizedValue.split(",");

        if (parts.length > 2) {
          sanitizedValue = parts[0] + "," + parts.slice(1).join(""); // Ambil koma pertama saja
        }

        // Jika ada desimal, batasi hanya 3 digit di belakang titik
        if (sanitizedValue.includes(",")) {
          const [integerPart, decimalPart] = sanitizedValue.split(",");
          sanitizedValue = integerPart + "," + decimalPart.slice(0, 3);
        }

        // Simpan nilai dalam format string agar tidak otomatis diformat ulang
        this.totalAmount = sanitizedValue;
      },
    },
    formatTotalAmount: {
      get() {
        return this.totalAmount !== null
          ? new Intl.NumberFormat("id-ID").format(this.totalAmount) // Format ke Rupiah (tanpa simbol)
          : "";
      },
      set(value) {
        this.totalAmount = Number(value.replace(/\D/g, "")); // Menghapus non-angka
      },
    },
    formatTotalAmountUSD: {
      get() {
        return this.totalAmount
          ? new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(this.totalAmount)
          : null;
      },
      set(value) {
        // Hapus semua karakter kecuali angka dan satu titik
        const cleanValue = value.replace(/[^0-9.]/g, "");

        // Hanya ambil angka dengan satu titik desimal
        const parts = cleanValue.split(".");
        const numericValue =
          parts.length > 2
            ? `${parts[0]}.${parts[1]}` // Ambil hanya satu titik
            : cleanValue;

        this.totalAmount = parseFloat(numericValue);
      },
    },
  },
  watch: {
    selectedCompany() {
      this.selectedCategory = null;
      this.content = "";
    },
    selectedCategory() {
      this.selectedAmountType = null;
      this.selectedCurrency = null;
      this.selectedSubCategory = null;
      this.selectedCriteriaMap = null;
      this.selectedCriteriaID = null;
      this.amountPerPax = null;
      this.quantity = null;
      this.totalAmountPax = null;
      this.totalAmount = null;
      this.content = "";
    },
    selectedSubCategory() {
      this.selectedCriteriaMap = null;
      this.selectedCriteriaID = null;
      this.amountPerPax = null;
      this.quantity = null;
      this.totalAmountPax = null;
      this.totalAmount = null;
    },
    selectedCriteriaMap(newValue) {
      this.amountPerPax = null;
      this.quantity = null;
      this.totalAmountPax = null;
      this.totalAmount = null;
      this.generate_approval_btn = false;
      if (this.selectedAmountType == 'hide' && newValue) {
        this.totalAmount = 0;
        this.generate_approval_btn = false;
      }
    },
    selectedEmployee() {
      this.selectedCategory = null;
      this.generate_approval_btn = false;
    },
    totalAmount() {
      this.generate_approval_btn = false;
    },
    amountPerPax() {
      this.calculateTotal();
    },
    quantity() {
      this.calculateTotal();
    },
    totalAmountPax() {
      this.generate_approval_btn = false;
    },
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

        this.selectedEmployee = this.user.id;
        this.forbidenIds = [this.user.id];
        this.handleCompanyName(this.user.company);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    handleCriteriaId(value) {
      this.selectedCriteriaID = value;
    },
    handleError(error) {
      this.errSelectApproval = error;
      this.generate_approval_btn = false;
      console.error("Error in SelectApproval:", error); // Tampilkan pesan error di console
    },
    handleMonitorList(value) {
      this.selectedMonitor = value;
    },
    validateNumber(event) {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault(); // Blokir karakter selain angka
      }
    },
    validateNumberUSD(event) {
      if (!/[0-9.]/.test(event.key)) {
        event.preventDefault(); // Blokir karakter selain angka
      }
    },
    validateFloatNumber(event) {
      const allowedKeys = [
        "Backspace",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
      ];
      const inputValue = event.target.value;

      // Izinkan angka, koma (,) hanya satu kali, dan tombol kontrol tertentu
      if (
        !/[0-9,]/.test(event.key) ||
        (event.key === "," && inputValue.includes(",")) ||
        allowedKeys.includes(event.key)
      ) {
        event.preventDefault();
      }
    },
    handleFilesUpdated(files) {
      this.selectedFiles = files;
    },
    handleCompanyName(valueData) {
      this.company_name = valueData;
    },
    handleTypeCategory(value) {
      this.category_type = value;
    },
    handleTypeAmount(value) {
      this.selectedAmountType = value;
    },
    handleCurrency(value) {
      this.selectedCurrency = value;
    },
    handleForm(value) {
      if (value) {
        this.content = value;
      } else {
        this.content = "";
      }
    },
    calculateTotal() {
      const amount = Number(this.amountPerPax) || null;
      const qty = Number(this.quantity) || null;
      this.totalAmountPax = amount * qty > 0 ? amount * qty : 0;
      if (this.totalAmountPax == 0) {
        this.totalAmount = 0;
      }
    },
    validateForm(draft_value) {
      // if (!this.selectedCategory || !this.selectedSubCategory || !this.selectedCriteriaMap) {
      //   setTimeout(() => {
      //     window.scrollTo({ top: 0, behavior: "smooth" });
      //   }, 0);
      //   this.snackbarMessage = "Please complete all required input";
      //   this.snackbar = true;
      //   return;
      // }
      if (!this.selectedApproval) {
        setTimeout(() => {
          window.scrollTo({ top: 200, behavior: "smooth" });
        }, 0);
        this.snackbarMessage =
          "Please complete all required input & Generate Approval List";
        this.snackbar = true;
        return;
      } else {
        this.err_target_date = [];
        this.selectedApproval.forEach((item, index) => {
          if (!item.target_date) {
            this.err_target_date[index] = "Target Date Required";
            setTimeout(() => {
              window.scrollTo({ top: 300, behavior: "smooth" });
            }, 0);
            this.snackbarMessage = "Please set the required Target Date";
            this.snackbar = true;
          }
        });
      }

      this.formData = {
        ctgr_id: this.selectedCategory,
        ctgr_type: this.category_type,
        // sub_ctgr_id: ["70", "71", "72", "73", "74", "75", "78"].includes(
        //   this.selectedSubCategory
        // )
        //   ? this.selectedSubCategory
        //   : null,
        sub_ctgr_id: this.selectedSubCategory,
        crtr_id:
          this.selectedCriteriaMap != 999 ? this.selectedCriteriaID : null,
        crtr_mppn_id: this.selectedCriteriaMap,
        amount:
          this.amountPerPax > 0
            ? this.amountPerPax
            : this.totalAmount
            ? parseFloat(this.totalAmount.toString().replace(/,/g, "."))
            : 0,
        qty: this.quantity > 0 ? this.quantity : 1,
        total_amount:
          this.amountPerPax > 0
            ? this.amountPerPax
            : this.totalAmount
            ? parseFloat(this.totalAmount.toString().replace(/,/g, "."))
            : 0,
        approvals: this.selectedApproval,
        subject: this.subject,
        content: this.content,
        creator_id: this.selectedEmployee,
      };

      const filteredMonitor = this.selectedMonitor.filter(
        (item) => item !== null
      );
      if (filteredMonitor.length > 0) {
        this.formData.monitor = filteredMonitor;
      }

      if (draft_value) {
        this.formData.status = "draft";
      }

      if (this.err_target_date.length === 0) {
        if (!this.subject) {
          setTimeout(() => {
            this.$refs.subjectInput.$el.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 0);
          this.err_subject = "Subject is required";
          this.snackbarMessage = "Please complete all required input";
          this.snackbar = true;
          return;
        } else {
          this.submitForm(draft_value);
        }
      }
    },
    async submitForm(draft_value) {
      try {
        const response = await axios.post("/memo/create", this.formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const myflowId = response.data.data.myflow_id;

        if (myflowId && this.selectedFiles) {
          const form_attachment = {
            media_ids: this.selectedFiles,
            myflow_id: myflowId,
          };

          try {
            const response_files = await axios.patch("/media", form_attachment);
          } catch (error) {
            console.error("Error submitting files:", error);
          }
        }
        if (myflowId) {
          try {
            const response_chat = await axios.patch(`/chat/notifications/${myflowId}`, {"status": "create"});
            if (draft_value) {
              this.$router.push(`/draft/${myflowId}`);
            } else {
              this.$router.push(`/details/${myflowId}`);
            }
          } catch (error) {
            console.error("Error Creating Chat Room:", error);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        this.snackbarMessage = error;
        this.snackbar = true;
      }
    },
  },
};
</script>
