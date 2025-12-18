<template>
  <v-card
    class="text-white bg-black rounded-lg py-4 mt-n1"
    :title="'Local Loop'"
    variant="flat"
    image="../assets/bg-image-black.jpg"
  >
  </v-card>
  <v-card class="mt-n1 rounded-lg">
    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-autocomplete variant="outlined" density="compact">
            <template #label>
              <span>
                Select Customer Name <span class="text-error">*</span>
              </span>
            </template>
          </v-autocomplete>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>SID<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>AX ID<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>Bandwidth (mbps)<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>VLAN ID<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea variant="outlined" density="compact">
            <template #label>
              <span>Service Description</span>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider class="my-2"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="px-6" @click="this.$router.back()">Cancel</v-btn>
      <v-btn
        prepend-icon="mdi-send"
        class="px-6"
        variant="flat"
        color="#FF7A00"
        @click="showModal = true"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>

  <v-overlay :model-value="loading" class="align-center justify-center">
    <v-progress-circular
      color="orange-darken-4"
      size="64"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import axios from "@/axios";

export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  watch: {},
};
</script>
