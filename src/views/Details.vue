<template>
  <v-container fluid class="bg-brown-lighten-5">
    <v-row>
      <v-col cols="12">
        <v-card
          class="text-white"
          :title="memo.subject"
          variant="flat"
          image="../assets/background.png"
        >
          <template v-slot:subtitle>
            <span class="text-body-1 font-weight-bold">
              {{ memo.code }}
            </span>
          </template>
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
          <template v-slot:append>
            <v-btn
              v-if="
                memo.approval.some(
                  (a) => a.status === 'process' && a.employee_id == this.user.id
                ) && !(memo.status == 'cancelled')
              "
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-check-circle-outline"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="(approvalDialog = true), (memo_note = '')"
            >
              <span>Approve</span>
            </v-btn>
            <v-btn
              v-if="
                memo.approval.some(
                  (a) => a.status === 'process' && a.employee_id == this.user.id
                ) && !(memo.status == 'cancelled')
              "
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-pencil-circle-outline"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="
                (revisionDialog = true), (memo_note = ''), (repeat_memo = true)
              "
            >
              <span>Revision</span>
            </v-btn>
            <v-btn
              v-if="
                memo.approval.some(
                  (a) => a.status === 'process' && a.employee_id == this.user.id
                ) && !(memo.status == 'cancelled')
              "
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-close-circle-outline"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="(rejectionDialog = true), (memo_note = '')"
            >
              <span>Reject</span>
            </v-btn>
            <v-btn
              v-if="
                memo.creator_id == this.user.id && memo.status == 'revision'
              "
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-pencil-circle-outline"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="$router.push(`/revision/${$route.params.id}`)"
            >
              <span>Revision</span>
            </v-btn>
            <v-btn
              v-if="
                !memo.approval?.some((a) => a.employee_id == this.user.id) &&
                (memo.status == 'process' || memo.status == 'revision') &&
                memo.creator_id == this.user.id
              "
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-cancel"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="(cancelMemoDialog = true), (memo_note = '')"
            >
              <span>Cancel</span>
            </v-btn>
            <v-btn
              v-if="memo.status == 'approved'"
              v-show="$vuetify.display.mdAndUp"
              variant="tonal"
              prepend-icon="mdi-download"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="downloadMemo(memo.id)"
            >
              <span>Download</span>
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1 justify-center px-2" v-show="$vuetify.display.smAndDown">
      <v-col
        v-if="
          memo.approval.some(
            (a) => a.status === 'process' && a.employee_id == this.user.id
          ) && memo.status !== 'cancelled'
        "
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-check-circle-outline"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="
            approvalDialog = true;
            memo_note = '';
          "
        >
          Approve
        </v-btn>
      </v-col>

      <v-col
        v-if="
          memo.approval.some(
            (a) => a.status === 'process' && a.employee_id == this.user.id
          ) && memo.status !== 'cancelled'
        "
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-pencil-circle-outline"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="
            revisionDialog = true;
            memo_note = '';
            repeat_memo = true;
          "
        >
          Revision
        </v-btn>
      </v-col>

      <v-col
        v-if="
          memo.approval.some(
            (a) => a.status === 'process' && a.employee_id == this.user.id
          ) && memo.status !== 'cancelled'
        "
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-close-circle-outline"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="
            rejectionDialog = true;
            memo_note = '';
          "
        >
          Reject
        </v-btn>
      </v-col>

      <v-col
        v-if="memo.creator_id == this.user.id && memo.status == 'revision'"
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-pencil-circle-outline"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="$router.push(`/revision/${$route.params.id}`)"
        >
          Revision
        </v-btn>
      </v-col>

      <v-col
        v-if="
          !memo.approval?.some((a) => a.employee_id == this.user.id) &&
          (memo.status == 'process' || memo.status == 'revision') &&
          memo.creator_id == this.user.id
        "
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-cancel"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="
            cancelMemoDialog = true;
            memo_note = '';
          "
        >
          Cancel
        </v-btn>
      </v-col>

      <v-col
        v-if="memo.status == 'approved'"
        cols="4"
        class="d-flex justify-center px-1 py-0"
      >
        <v-btn
          variant="tonal"
          prepend-icon="mdi-download"
          class="bg-orange-darken-4 w-100"
          style="border: 2px solid white"
          @click="downloadMemo(memo.id)"
        >
          Download
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" lg="9">
        <v-card variant="flat" class="d-flex flex-column" style="height: 72vh">
          <v-card-text class="flex-grow-1 overflow-y-auto overflow-x-hidden">
            <v-row class="mt-n6 mx-n7">
              <v-col>
                <v-card variant="flat">
                  <v-card-text>
                    <v-row v-if="memo">
                      <v-col cols="12" sm="6">
                        <DetailRow
                          :value="memo.ctgr_name || 'null'"
                          :labels="'Category'"
                        >
                        </DetailRow>
                      </v-col>
                      <v-col cols="12" sm="6" v-if="category_type == 'fix'">
                        <DetailRow
                          :value="memo.sub_ctgr_name"
                          :labels="'Sub Category'"
                        >
                        </DetailRow>
                      </v-col>
                      <v-col cols="12" sm="6" v-if="category_type == 'fix'">
                        <DetailRow
                          :value="memo.crtr_name || '-'"
                          :labels="'Criteria'"
                        >
                        </DetailRow>
                      </v-col>
                      <v-col
                        cols="12" sm="6"
                        v-if="
                          memo.amount_type === 'amount' &&
                          category_type == 'fix'
                        "
                      >
                        <DetailRow
                          v-if="memo.currency == 'USD'"
                          :value="
                            memo.currency +
                            ' ' +
                            new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(memo.amount)
                          "
                          :labels="'Amount'"
                        ></DetailRow>
                        <DetailRow
                          v-else
                          :value="
                            memo.currency +
                            ' ' +
                            new Intl.NumberFormat('id-ID', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(memo.amount)
                          "
                          :labels="'Amount'"
                        ></DetailRow>
                      </v-col>
                      <v-col
                        cols="12" sm="6"
                        v-if="
                          memo.amount_type === 'perpax' &&
                          category_type == 'fix'
                        "
                      >
                        <DetailRow
                          :value="
                            memo.currency +
                            ' ' +
                            new Intl.NumberFormat('id-ID', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(memo.amount) +
                            ' x ' +
                            memo.qty +
                            ' = ' +
                            memo.currency +
                            ' ' +
                            new Intl.NumberFormat('id-ID', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(memo.amount * memo.qty)
                          "
                          :labels="'Amount Perpax'"
                        ></DetailRow>
                      </v-col>
                      <v-col
                        cols="12" sm="6"
                        v-if="
                          memo.amount_type === 'percentage' &&
                          category_type == 'fix'
                        "
                      >
                        <DetailRow
                          :value="
                            new Intl.NumberFormat('id-ID', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(memo.amount) + ' % '
                          "
                          :labels="'Percentage'"
                        ></DetailRow>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-row class="align-center">
                          <v-col cols="auto">
                            <DetailRow
                              :value="memo.creator_name || '-'"
                              :labels="'Creator'"
                            />
                          </v-col>
                          <v-col cols="auto" class="pt-9">
                            <v-icon
                              v-if="memo.status == 'revision'"
                              color="#66ff66"
                              class="text-body-2 ml-n4 pulse-glow"
                            >
                              mdi-checkbox-blank-circle
                            </v-icon>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row>
                          <!--      Approval & Monitor      -->
                          <v-col cols="12" sm="6">
                            <h3 class="text-deep-orange">Approval:</h3>
                            <ol class="mx-5 mt-3 font-weight-bold">
                              <li
                                class="mb-3"
                                v-for="approval in memo.approval"
                                :key="approval.id"
                              >
                                <span class="mr-2">{{ approval.name }}</span>
                                <v-icon
                                  v-if="
                                    memo.status != 'cancelled' &&
                                    memo.status != 'revision' &&
                                    memo.status != 'draft' &&
                                    approval.status != 'approve' &&
                                    approval.status != 'waiting' &&
                                    approval.status != 'reject'
                                  "
                                  color="#66ff66"
                                  class="mt-n1 text-body-2 pulse-glow"
                                  >mdi-checkbox-blank-circle
                                </v-icon>
                                <br />
                                <span class="font-weight-regular"
                                  >Target:
                                  {{ formatDate(approval.target_date) }}</span
                                >
                              </li>
                            </ol>
                          </v-col>
                          <v-col cols="12" sm="6" v-if="memo.monitor">
                            <h3 class="text-deep-orange">Monitor:</h3>
                            <ol class="mx-5 mt-1 font-weight-bold">
                              <li
                                v-for="monitor in memo.monitor"
                                :key="monitor.id"
                              >
                                {{ monitor.name }}
                              </li>
                            </ol>
                          </v-col>
                          <!--      Approval & Monitor      -->
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                lg="4"
                class="mt-n8 mt-sm-0"
                v-if="memo.attachments && memo.attachments.length > 0"
              >
                <v-card
                  elevation="0"
                  style="height: 20vh"
                  class="overflow-y-auto rounded-bs-lg"
                >
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <div class="mx-1">
                          <h3 class="text-deep-orange">Attachment Files:</h3>
                          <ol class="mx-5 mt-1">
                            <li
                              v-for="attachment in memo.attachments"
                              :key="attachment.id"
                            >
                              <img
                                width="18"
                                class="mr-1 mb-n1 mt-1"
                                src="../assets/file_attach.png"
                              />
                              <a
                                class="text-grey-darken-1"
                                href="#"
                                @click.prevent="handleFileClick(attachment)"
                              >
                                {{
                                  attachment.original_name.length > 25
                                    ? attachment.original_name.slice(0, 25) +
                                      "..." +
                                      attachment.original_name.slice(
                                        attachment.original_name.lastIndexOf(
                                          "."
                                        )
                                      )
                                    : attachment.original_name
                                }}
                                - ({{
                                  (attachment.size_byte / 1048576).toFixed(2)
                                }}
                                MB)
                              </a>
                            </li>
                          </ol>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="memo.content != '<p><br></p>'">
              <v-col cols="12" class="mt-2 mt-sm-n6">
                <h3 class="text-deep-orange">Memo Content:</h3>
                <div class="mt-2" v-html="memo.content"></div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3">
        <v-card variant="flat" style="height: 72vh" class="overflow-y-auto">
          <v-card-text>
            <div v-if="memo" class="mx-1">
              <strong class="text-deep-orange">Time Line:</strong>
              <v-timeline side="end" class="ml-n8" truncate-line="end">
                <v-timeline-item
                  v-for="process in (memo.process ?? [])
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.create_date) - new Date(a.create_date)
                    )"
                  :dot-color="$root.getStatusClass(process.action)"
                  size="small"
                >
                  <v-alert
                    class="ml-n5 py-1"
                    :style="{
                      width: $vuetify.display.mobile ? '90vw' : '19vw',
                    }"
                    color="grey-lighten-5"
                    border="start"
                    :border-color="$root.getStatusClass(process.action)"
                    :value="true"
                  >
                    <b>{{
                      process.create_date
                        ? formatDate(process.create_date, true)
                        : "Not Set"
                    }}</b>
                    <v-chip
                      class="text-capitalize ml-2"
                      size="small"
                      :color="$root.getStatusClass(process.action)"
                      dark
                    >
                      <span v-if="process.action == 'revision'"
                        >{{ process.action }} Requested</span
                      >
                      <span v-else-if="process.action == 'update'"
                        >Updated</span
                      >
                      <span v-else-if="process.action == 'create'">New</span>
                      <span v-else>{{ process.action }}</span>
                    </v-chip>
                    <br />
                    by <b>{{ process.name }}</b
                    ><br />
                    <template v-if="process.note && process.note.length > 50">
                      <span
                        v-html="
                          'Note: ' +
                          maskContent(process.note).slice(0, 100) +
                          '... '
                        "
                      ></span>
                      <button
                        class="text-primary pa-0 ma-0"
                        @click="readMoreNote(process.note)"
                      >
                        <h5>Read More</h5>
                      </button>
                    </template>

                    <template v-else-if="process.note">
                      <span
                        v-html="'Note: ' + maskContent(process.note)"
                      ></span>
                    </template>
                  </v-alert>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div v-else>
              <p>Loading...</p>
            </div>
            <!-- <div v-for="i in 100" :key="i">&nbsp;</div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <DrawerChat
      v-if="memo.status != 'draft'"
      :myflow_id="memo.id"
      :user_id="this.user.id"
    />

    <!-- Show Image -->
    <v-dialog v-model="dialog" style="width: 100vw">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Preview Image
          <v-btn color="blue" text @click="downloadImage">Download</v-btn>
          <v-btn icon @click="dialog = false" density="compact">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <v-img
            :src="selectedImage"
            style="max-width: 100%; max-height: 80vh"
            contain
          ></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-4" text @click="dialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Read More -->
    <v-dialog v-model="readMoreDialog" style="width: 100vw">
      <v-card>
        <v-card-title class="d-flex justify-end">
          <v-btn
            icon
            @click="readMoreDialog = false"
            density="compact"
            class="mt-1"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <div v-html="read_more_note"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Approve -->
    <v-dialog v-model="approvalDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Confirm Approval
          <v-btn icon @click="approvalDialog = false" density="compact">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="memo_note" class="mt-4" variant="outlined">
            <template #label>Note (Optional)</template>
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-4" text @click="approvalDialog = false"
            >Close</v-btn
          >
          <v-btn
            variant="tonal"
            class="mr-2 bg-orange-darken-4 px-6"
            @click="approveSubmit()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Revision -->
    <v-dialog v-model="revisionDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Confirm Revision
          <v-btn icon @click="revisionDialog = false" density="compact">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <strong class="text-deep-orange"
            >Note (Required Min 10 Character)
            <span class="text-error">*</span></strong
          >
          <ExampleWangEditor
            v-model="memo_note"
            :compact="true"
          ></ExampleWangEditor>
          <v-switch
            v-model="repeat_memo"
            color="orange-darken-4"
            :label="`Reset Approval process from the first Approver`"
          ></v-switch>
        </v-card-text>
        <v-card-actions class="mt-n12">
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-4" text @click="revisionDialog = false"
            >Close</v-btn
          >
          <v-btn
            variant="tonal"
            class="mr-2 bg-orange-darken-4 px-6"
            @click="revisionSubmit()"
            :disabled="memo_note.trim().length < 17"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Reject -->
    <v-dialog v-model="rejectionDialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Confirm Rejection
          <v-btn
            icon
            @click="(rejectionDialog = false), (checkbox = false)"
            density="compact"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="memo_note" class="mt-4" variant="outlined">
            <template #label
              >Note (Min 10 Character)<span class="text-error">*</span>
            </template>
          </v-textarea>
          <v-checkbox v-model="checkbox" class="ml-n2" color="orange-darken-4">
            <template v-slot:label> Yes, I want to reject this memo. </template>
          </v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="orange-darken-4"
            text
            @click="(rejectionDialog = false), (checkbox = false)"
            >Close</v-btn
          >
          <v-btn
            variant="tonal"
            class="mr-2 bg-orange-darken-4 px-6"
            @click="rejectSubmit()"
            :disabled="memo_note.trim().length < 10 || !checkbox"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Cancel -->
    <v-dialog v-model="cancelMemoDialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Confirm Cancelation
          <v-btn
            icon
            @click="(cancelMemoDialog = false), (checkbox = false)"
            density="compact"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="memo_note" class="mt-4" variant="outlined">
            <template #label
              >Note (Min 10 Character)<span class="text-error">*</span>
            </template>
          </v-textarea>
          <v-checkbox v-model="checkbox" class="ml-n2" color="orange-darken-4">
            <template v-slot:label> Yes, I want to cancel this memo. </template>
          </v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="orange-darken-4"
            text
            @click="(cancelMemoDialog = false), (checkbox = false)"
            >Close</v-btn
          >
          <v-btn
            variant="tonal"
            class="mr-2 bg-orange-darken-4 px-6"
            @click="cancelMemoSubmit()"
            :disabled="memo_note.trim().length < 10 || !checkbox"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import DetailRow from "@/components/DetailRow.vue";
import DrawerChat from "@/components/DrawerChat.vue";
import ExampleWangEditor from "@/components/ExampleWangEditor.vue";

export default {
  name: "Details",
  components: {
    useAuthStore,
    DetailRow,
    ExampleWangEditor,
    DrawerChat,
  },
  data() {
    return {
      user: {},
      memo: {
        status: null,
        attachments: [],
        approval: [],
        process: [{ note: "" }],
      },
      category_type: "fix",
      memo_note: "",
      read_more_note: "",
      repeat_memo: true,
      dialog: false,
      approvalDialog: false,
      revisionDialog: false,
      rejectionDialog: false,
      cancelMemoDialog: false,
      readMoreDialog: false,
      selectedImage: null,
      checkbox: false,
    };
  },
  created() {
    this.fetchUser();
    useAuthStore().login();
    this.fetchMemoDetails();
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchMemoDetails() {
      try {
        const id = this.$route.params.id;
        const response = await axios.get(`/memo/detail/${id}`);
        this.memo = response.data.data[0];
        this.category_type = this.memo.ctgr_type;
      } catch (error) {
        this.$router.push("/notfound");
        console.error("Error fetching memo details:", error);
      }
    },
    async downloadMemo(val) {
      try {
        window.open(
          `/api/media/memo/${val}/download`,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
      }
    },
    async handleFileClick(attachment) {
      const fileExtension = attachment.original_name
        .split(".")
        .pop()
        .toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

      try {
        const id = attachment.id;
        const response = await axios.get(`/media/${id}`);

        if (imageExtensions.includes(fileExtension)) {
          this.selectedImage = response.data.data.path;
          this.dialog = true;
        } else {
          const link = document.createElement("a");
          link.href = response.data.data.path;
          link.target = "_blank";
          link.download = attachment.original_name;
          link.click();
        }
      } catch (error) {
        console.error("Error fetching attachment:", error);
      }
    },
    downloadImage() {
      if (this.selectedImage) {
        this.downloadImageDirectly(this.selectedImage);
      }
    },
    downloadImageDirectly(url, filename) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "downloaded_image";
      link.click();
    },
    formatDate(inputDate, includeTime) {
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
      const hours = `0${parsedDate.getHours()}`.slice(-2);
      const minutes = `0${parsedDate.getMinutes()}`.slice(-2);

      let formattedDate = `${day} ${month} ${year}`;
      if (includeTime) {
        formattedDate += ` - ${hours}:${minutes}`;
      }
      return formattedDate;
    },
    async approveSubmit() {
      try {
        const response_files = await axios.post("/memo/status/approve", {
          myflow_id: this.memo.id,
          note: this.memo_note,
        });
        const last_approver = this.memo.approval.length - 1;
        console.log(
          this.memo.approval[last_approver].employee_id,
          this.user.id
        );
        if (
          this.memo.approval[last_approver].employee_id &&
          this.memo.approval[last_approver].status == "process" &&
          this.user.id
        ) {
          this.chatNotification("done");
        }

        this.$router.go(0);
      } catch (error) {
        console.error("Error submitting memo:", error);
      }
    },
    async rejectSubmit() {
      try {
        const response_files = await axios.post("/memo/status/reject", {
          myflow_id: this.memo.id,
          note: this.memo_note,
        });
        this.chatNotification("reject");
        this.$router.go(0);
      } catch (error) {
        console.error("Error submitting memo:", error);
      }
    },
    async revisionSubmit() {
      try {
        const response_files = await axios.post("/memo/status/revision", {
          myflow_id: this.memo.id,
          repeat: this.repeat_memo ? 1 : 0,
          note: this.memo_note,
        });
        this.$router.go(0);
      } catch (error) {
        console.error("Error submitting memo:", error);
      }
    },
    async cancelMemoSubmit() {
      try {
        const response_files = await axios.post("/memo/status/cancel", {
          myflow_id: this.memo.id,
          note: this.memo_note,
        });
        this.chatNotification("cancel");
        this.$router.go(0);
      } catch (error) {
        console.error("Error submitting memo:", error);
      }
    },
    async chatNotification(action) {
      try {
        const response_chat = await axios.patch(
          `/chat/notifications/${this.memo.id}`,
          { status: `${action}` }
        );
        this.$router.go(0);
      } catch (error) {
        console.error("Error Update Chat Room:", error);
      }
    },
    readMoreNote(text_value) {
      this.read_more_note = "";
      this.read_more_note = text_value;
      this.readMoreDialog = true;
    },
    maskContent(note) {
      return note
        .replace(/<img[^>]*?>/gi, "<b>(contain image)</b>") // Masking <img>
        .replace(/<table[\s\S]*?<\/table>/gi, "<b>(contain table)</b>"); // Masking <table> beserta isinya
    },
  },
};
</script>
<style scoped>
/* Untuk menangani tabel di dalam v-html */
::v-deep(table) {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
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
  margin-bottom: 8px;
}

::v-deep(ol),
::v-deep(ul) {
  margin-left: 15px;
}

::v-deep(input[type="checkbox"]) {
  margin-right: 5px;
}

::v-deep(input[type="checkbox"][checked]) {
  filter: invert(60%) sepia(57%) saturate(749%) hue-rotate(182deg)
    brightness(99%) contrast(93%);
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
