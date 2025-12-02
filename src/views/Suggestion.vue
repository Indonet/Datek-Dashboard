<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card class="text-white bg-animate" flat>
              <v-card-title class="d-flex text-white align-center py-3">
                <h2 v-show="!$vuetify.display.mobile">Suggestion</h2>
                <h4 v-show="$vuetify.display.mobile">Suggestion</h4>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="content"
              variant="outlined"
              :rows="15"
            >
              <template #label>Note</template>
            </v-textarea>
          </v-col>
          <v-col cols="12" class="mt-n4">
            <SelectMultiFiles @files-updated="handleFilesUpdated" />
          </v-col>
        </v-row>
        <!-- <div>
          <p>{{ content }}</p>
          <p>Files Uploaded {{ selectedFiles }}</p>
        </div> -->
        <v-divider class="my-3"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="medium-emphasis" @click="this.$router.back()"
            >Cancel</v-btn
          >
          <v-btn
            prepend-icon="mdi-send"
            class="px-6"
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
      <v-card-text> Are you sure? </v-card-text>
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
import SelectMultiFiles from "@/components/SelectMultiFiles.vue";

export default {
  components: {
    useAuthStore,
    useRouter,
    SelectMultiFiles,
  },
  data() {
    return {
      router: useRouter(),
      content: "",
      selectedFiles: null,
      formData: {},
      user: {},
      showModal: false,
      snackbar: false,
      snackbarMessage: "",
    };
  },
  mounted() {
    useAuthStore().login();
    this.fetchUser();
  },
  computed: {},
  watch: {},
  methods: {
    async fetchUser() {
      try {
        // Ambil data profil karyawan
        const response = await axios.get("/employees/profile");
        this.user = response.data.employee;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    handleFilesUpdated(files) {
      this.selectedFiles = files;
    },
    validateForm(draft_value) {
      this.formData = {
        content: this.content,
      };
      this.submitForm();
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
        this.$router.push(`/draft/${myflowId}`);
      } catch (error) {
        console.error("Error submitting suggestion:", error);
        this.snackbarMessage = error;
        this.snackbar = true;
      }
    },
  },
};
</script>
