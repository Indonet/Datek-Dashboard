<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card :title="memo.code" class="text-white bg-animate" flat>
              <template v-slot:prepend>
                <div
                  class="bg-white mt-n4 ml-n1 rounded-b-lg mr-2"
                  style="height: 70px"
                >
                  <div
                    class="text-capitalize text-caption px-2 py-2 mt-8"
                    :class="`text-${$root.getStatusClass(memo.status)}`"
                  >
                    <b>{{ memo.status }}</b>
                  </div>
                </div>
              </template>
            </v-card>
          </v-col>
          <v-col cols="12">
            <template v-if="memo.process.length > 1">
              <strong class="text-deep-orange">
                Requested Revision Note from {{ sortedProcess[0].name }}:
              </strong>
              <div class="pa-4 bg-purple-lighten-5 mt-2 rounded">
                <div
                  v-html="sortedProcess[0].note"
                  class="revision_content_text"
                ></div>
              </div>
            </template>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-none">
            <SelectCategory
              v-model="memo.ctgr_name"
              :companyName="authStore.user.company"
            />
          </v-col>
          <v-col cols="12" class="d-none" v-if="category_type == 'fix'">
            <SelectSubCategory
              v-model="selectedSubCategory"
              :categoryId="selectedCategory"
              @amountType="handleTypeAmount"
              @currency="handleCurrency"
              @form="handleForm"
            />
          </v-col>
          <v-col cols="12" class="d-none" v-if="category_type == 'fix'">
            <SelectCriteria
              v-model="selectedCriteriaMap"
              :subCategoryId="selectedSubCategory"
              :categoryId="selectedCategory"
              @skipCriteria="selectedCriteriaMap = 999"
              @crtrId="handleCriteriaId"
            />
          </v-col>
          <v-col cols="6">
            <DetailRow :value="memo.ctgr_name || 'null'" :labels="'Category'">
            </DetailRow>
          </v-col>
          <v-col cols="6" v-if="category_type == 'fix'">
            <DetailRow :value="memo.sub_ctgr_name" :labels="'Sub Category'">
            </DetailRow>
          </v-col>
          <v-col cols="6" v-if="category_type == 'fix'">
            <DetailRow :value="memo.crtr_name || '-'" :labels="'Criteria'">
            </DetailRow>
          </v-col>
          <v-col cols="6"></v-col>
          <v-row v-if="selectedAmountType == 'perpax'" class="px-3 mt-4">
            <v-col cols="12" sm="5">
              <v-text-field
                :prefix="selectedCurrency"
                suffix="/pax"
                variant="outlined"
                density="compact"
                v-model="formatAmountPerPax"
                @keypress="validateNumber"
                @paste.prevent
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
          <v-col cols="12" v-if="selectedAmountType == 'percentage'">
            <v-text-field
              suffix="%"
              variant="outlined"
              density="compact"
              v-model="formatPercentage"
              @keypress="validateFloatNumber"
              @paste.prevent
            >
              <template #label>
                <span> Percentage <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>
          <v-col
            cols="12"
            v-if="selectedAmountType == 'amount' && selectedCurrency != 'USD'"
          >
            <v-text-field
              :prefix="selectedCurrency"
              variant="outlined"
              density="compact"
              v-model="formatTotalAmount"
              @keypress="validateNumber"
              @paste.prevent
              :disabled="selectedCriteriaMap == null"
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
            >
              <template #label>
                <span> Total Amount <span class="text-error">*</span> </span>
              </template>
            </v-text-field>
          </v-col>

          <!-- Generate Approval -->
          <v-col
            v-if="totalAmount != null || totalAmountPax > 0"
            cols="12"
            class="mt-n3 mb-3"
          >
            <v-btn
              v-if="
                category_type == 'fix' &&
                manual_approval_btn == false &&
                generate_approval_btn == false
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
                category_type == 'fix' &&
                manual_approval_btn == false &&
                generate_approval_btn == false &&
                (selectedCompany == 'Edge' || company_name == 'edge')
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
                (selectedCompany == 'Edge' || company_name == 'edge')
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
            {{ errSelectApproval }} <br />
          </v-col>
          <v-col
            cols="12"
            class="mt-n11"
            v-if="this.generate_approval_btn && category_type == 'fix'"
          >
            {{ errSelectApproval }} <br />
            <SelectApprovalRevision
              v-model="selectedApproval"
              :initialApprovals="memo.approval"
              :initialMonitor="memo.monitor"
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
            ></SelectApprovalRevision>
          </v-col>
          <!-- Generate Approval -->
          <v-col
            cols="12"
            class="mt-n3 py-0"
            v-if="
              (!(category_type == 'fix') || manual_approval_btn) &&
              !generate_approval_btn
            "
          >
            <SelectApprovalOpen
              v-model="selectedApproval"
              :forbidenIds="this.forbidenIds"
              :initialApprovals="memo.approval"
              :initialMonitor="memo.monitor"
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
          <!-- v-permission="'edit-user'" -->
          <v-col cols="12" class="mt-n5">
            <ExampleWangEditor
              v-if="was_rendered == true"
              v-model="content"
            ></ExampleWangEditor>
          </v-col>
          <v-col
            cols="12"
            class="mt-3"
            v-if="was_rendered && !memo.attachments"
          >
            <SelectMultiFiles
              :attachments="this.selectedAttachments"
              @files-updated="handleFilesUpdated"
            />
          </v-col>
          <v-col cols="12" class="mt-3" v-else-if="was_rendered">
            <SelectMultiFilesRevision
              :attachments="this.selectedAttachments"
              @files-updated="handleFilesUpdated"
            />
          </v-col>
        </v-row>
        <!-- <div>
          <p>Selected Employee: {{ selectedEmployee }}</p>
          <p>Company: {{ company_name }}</p>
          <p>Selected Category ID: {{ selectedCategory }}</p>
          <p>
            Selected Sub Category ID: {{ selectedSubCategory }} -
            {{
              ["70", "71", "72"].includes(selectedSubCategory)
                ? selectedSubCategory
                : null
            }}
          </p>
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="medium-emphasis" @click="this.$router.back()"
            >Cancel</v-btn
          >

          <v-btn color="orange-darken-4" variant="flat" @click="showModal = true"
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
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import SelectEmployees from "@/components/SelectEmployees";
import SelectCategory from "@/components/SelectCategory";
import SelectSubCategory from "@/components/SelectSubCategory";
import SelectCriteria from "@/components/SelectCriteria.vue";
import ExampleWangEditor from "@/components/ExampleWangEditor.vue";
import SelectMultiFilesRevision from "@/components/SelectMultiFilesRevision.vue";
import SelectApprovalRevision from "@/components/SelectApprovalRevision.vue";
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
    SelectMultiFilesRevision,
    SelectApprovalRevision,
    SelectApprovalOpen,
  },
  data() {
    return {
      authStore: useAuthStore(),
      forbidenIds: [useAuthStore().user.id],
      memo: {
        status: null,
        process: [
          { name: "", note: "" },
          { name: "", note: "" },
        ],
        attachments: [{ id: "" }],
      },
      was_rendered: false,
      ready_edit: 0,
      router: useRouter(),
      selectedEmployee: null,
      selectedCompany: null,
      company_name: null,
      category_type: "fix",
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
      selectedApproval: [],
      selectedMonitor: null,
      subject: null,
      content: "",
      selectedFiles: null,
      selectedAttachments: null,
      rawValue: null,
      errSelectApproval: null,
      err_target_date: [],
      err_subject: null,
      formData: {},
      showModal: false,
      snackbar: false,
      snackbarMessage: "",
      i: 1,
    };
  },
  mounted() {
    this.fetchMemoDetails();
  },
  computed: {
    sortedProcess() {
      return [...this.memo.process].sort(
        (a, b) => new Date(b.create_date) - new Date(a.create_date)
      );
    },
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
        // return this.totalAmount !== null ? parseFloat(this.totalAmount) || 0 : 0; //Edited -------------------------------------------------------------
        return this.totalAmount.toString().replace(".", ",");
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
        this.totalAmount = sanitizedValue; //Edited -------------------------------------------------------------
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
        return this.totalAmount !== null
          ? new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(this.totalAmount)
          : "";
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
    totalAmount(newValue) {
      if (this.was_rendered) {
        this.ready_edit++;
      }
      if (this.ready_edit > 1) {
        this.generate_approval_btn = false;
      }
      this.amountPerPax = newValue;
    },
    amountPerPax() {
      this.calculateTotal();
    },
    quantity() {
      this.calculateTotal();
    },
    totalAmountPax() {
      if (this.ready_edit > 1) {
        this.generate_approval_btn = false;
      }
    },
  },
  methods: {
    async fetchMemoDetails() {
      try {
        const id = this.$route.params.id;
        const response = await axios.get(`/memo/detail/${id}`);
        this.memo = response.data.data[0];

        if (this.memo.status != 'revision' || this.memo.creator_id != this.forbidenIds) {
          this.$router.push("/notfound");
        }

        this.selectedCategory = this.memo.ctgr_id;
        this.category_type = this.memo.ctgr_type;
        this.selectedSubCategory = this.memo.sub_ctgr_id;
        (this.selectedAmountType = this.memo.amount_type);
        (this.selectedCurrency = this.memo.currency);
        (this.selectedCriteriaMap = this.memo.crtr_mppn_id);
        (this.selectedCriteriaID = this.memo.crtr_id);
        (this.amountPerPax = this.memo.amount);
        this.quantity = this.memo.qty;
        this.totalAmount = this.memo.total_amount;
        this.selectedApproval = this.memo.approval.map((item) => ({
          id: item.employee_id,
          target_date: this.formatDate(item.target_date)
        }));
        this.selectedMonitor = this.memo.monitor
          ? this.memo.monitor.map((item) => item.employee_id)
          : [];
        this.selectedFiles = this.memo.attachments
          ? this.memo.attachments.map((item) => item.id)
          : [];
        this.selectedAttachments = this.memo.attachments || [];

        this.subject = this.memo.subject;
        this.content = this.memo.content;
        this.company_name = this.memo.cmpy_name;
        this.selectedCompany = this.authStore.user.company;
      } catch (error) {
        console.error("Error fetching memo details:", error);
        this.$router.push("/notfound");
      }
      this.selectedEmployee = this.authStore.user.id;
      // this.generate_approval_btn = true;
      this.was_rendered = true;
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
    // formatDate(inputDate, includeTime) {
    //   const parsedDate = new Date(inputDate);
    //   const day = parsedDate.getDate();
    //   const monthNames = [
    //     "Jan",
    //     "Feb",
    //     "Mar",
    //     "Apr",
    //     "May",
    //     "Jun",
    //     "Jul",
    //     "Aug",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Dec",
    //   ];
    //   const month = monthNames[parsedDate.getMonth()];
    //   const year = parsedDate.getFullYear();
    //   const hours = `0${parsedDate.getHours()}`.slice(-2);
    //   const minutes = `0${parsedDate.getMinutes()}`.slice(-2);

    //   let formattedDate = `${day} ${month} ${year}`;
    //   if (includeTime) {
    //     formattedDate += ` - ${hours}:${minutes}`;
    //   }
    //   return formattedDate;
    // },
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
        this.content = this.memo.content;
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
    validateForm() {
      // if (
      //   !this.selectedCategory ||
      //   !this.selectedSubCategory ||
      //   !this.selectedCriteriaMap
      // ) {
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
        myflow_id: this.memo.id,
        ctgr_id: this.selectedCategory,
        ctgr_type: this.category_type,
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
          this.submitForm();
        }
      }
    },
    async submitForm() {
      try {
        const response = await axios.post(
          "/memo/status/revision_process",
          this.formData
        );

        const myflowId = response.data.data.myflow_id;

        if (myflowId && this.selectedFiles) {
          const form_attachment = {
            media_ids: this.selectedFiles.map(Number), // Konversi langsung ke integer
            myflow_id: myflowId,
          };

          try {
            const response_files = await axios.patch("/media", form_attachment);
            // alert("Attachment berhasil dikirim!");

            this.$router.push(`/details/${myflowId}`);
          } catch (error) {
            console.error("Error submitting files:", error);
            // alert("Gagal mengirim file, coba lagi!");
          }
        }
        if (myflowId) {
          try {
            const response_chat = await axios.patch(`/chat/notifications/${myflowId}`, {"status": "update"});
            this.$router.push(`/details/${myflowId}`);
          } catch (error) {
            console.error("Error Creating Chat Room:", error);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // alert("Gagal mengirim data, coba lagi!");
      }
    },
  },
};
</script>
<style scoped>
/* Untuk menangani tabel di dalam v-html */
::v-deep(table) {
  width: 100%;
  border-collapse: collapse;
}

::v-deep(th),
::v-deep(td) {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

::v-deep(th) {
  background-color: #f2f2f2;
}

::v-deep(p) {
  margin-bottom: 15px;
}

::v-deep(ol),
::v-deep(ul) {
  margin-left: 15px;
}

.pulse-glow {
  animation: pulseGlow 2s infinite;
  border-radius: 50%;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0px #90ff90;
  }
  50% {
    box-shadow: 0 0 15px #66ff66;
  }
  100% {
    box-shadow: 0 0 0px #17ff17;
  }
}
</style>
