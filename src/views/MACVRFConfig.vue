<template>
  <!-- <v-card
    class="text-white bg-black rounded-lg py-4 mt-n1"
    :title="'Configuration Juniper EVPN VPWS'"
    variant="flat"
    image="../assets/bg-image-black.jpg"
  >
  </v-card> -->
  <v-card class="mt-n1 rounded-lg">
    <v-card-text class="mt-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete variant="outlined" density="compact">
            <template #label>
              <span> EVI ID <span class="text-error">*</span> </span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete variant="outlined" density="compact">
            <template #label>
              <span> Instances Name <span class="text-error">*</span> </span>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>Device Name<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>Interface Name<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>Interface Speed<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4" class="mt-n4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>RD IP<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4" class="mt-n4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>VLAN ID<span class="text-error">*</span> </span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="4" class="mt-n4">
          <v-text-field variant="outlined" density="compact">
            <template #label>
              <span>Description</span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row justify="center" align="center">
        <v-col cols="3"></v-col>
        <v-col cols="3" class="pt-8">
          <v-select
            density="compact"
            :items="['Access', 'Trunk']"
            variant="outlined"
            block
          >
            <template #label>
              <span>Mode Interface<span class="text-error">*</span></span>
            </template>
          </v-select>
        </v-col>
        <v-col cols="3">
          <v-btn
            class="mx-2"
            variant="flat"
            prepend-icon="mdi-wrench"
            color="primary"
            block
          >
            Generate Config
          </v-btn>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="mt-n4">
          <v-textarea variant="outlined" density="compact" auto-grow>
            <template #label>
              <span>Configuration Node 1</span>
            </template>
          </v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
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
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  watch: {},
};
</script>
