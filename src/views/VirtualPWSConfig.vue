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
        <v-col cols="12" md="5">
          <v-autocomplete variant="outlined" density="compact">
            <template #label>
              <span>
                EVI ID <span class="text-error">*</span>
              </span>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="5">
          <v-select
              density="compact"
              :items="['1G', '10G', '40G', '100G']"
              variant="outlined"
          >
            <template #label>
              <span>
                Interface Speed <span class="text-error">*</span>
              </span>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="2" class="pr-6 pl-0">
          <v-btn
            prepend-icon="mdi-magnify"
            variant="flat"
            class="mt-0 indonet-orange"
            block
            style="height: 40px"
            >Search</v-btn
          >
        </v-col>
        <v-divider class="mt-n3"></v-divider>
        <v-col cols="12" md="6" class="mt-n2">
          <h2>Side A-end</h2>
          <v-divider
            thickness="3"
            color="#FF7A00"
            class="mb-5"
            style="opacity: 1"
          />
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Device Name<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Interface Name<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>RD IP<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Local VPWS ID<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Description</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n4">
              <v-textarea variant="outlined" density="compact" auto-grow>
                <template #label>
                  <span>Configuration for side A</span>
                </template>
              </v-textarea>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" class="mt-n2">
          <h2>Side Z-end</h2>
          <v-divider
            thickness="3"
            color="#FF7A00"
            class="mb-5"
            style="opacity: 1"
          />
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Device Name<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Interface Name<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>RD IP<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Local VPWS ID<span class="text-error">*</span> </span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n4">
              <v-text-field variant="outlined" density="compact">
                <template #label>
                  <span>Description</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="mt-n4">
              <v-textarea variant="outlined" density="compact" auto-grow>
                <template #label>
                  <span>Configuration for side Z</span>
                </template>
              </v-textarea>
            </v-col>
          </v-row>
        </v-col>
        <v-divider class="mt-n1"></v-divider>
        <v-col cols="3"></v-col>
        <v-col cols="3">
          <v-btn
            class="mx-2"
            variant="flat"
            prepend-icon="mdi-trash-can-outline"
            color="error"
            block
          >
            Generate Delete Config
          </v-btn>
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