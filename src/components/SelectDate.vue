<template v-if="formattedDate">
  <v-menu v-model="menu" :close-on-content-click="false" location="center">
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="formattedDate"
        density="compact"
        label="Target Date"
        variant="outlined"
        hide-details="auto"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="props"
        @click:clear="formattedDate = null"
      />
    </template>
    <div class="position-relative">
      <v-date-picker
        v-model="model"
        color="orange-darken-4"
        :width="xs ? width - 30 : 'auto'"
        elevation="24"
        hide-header="true"
        height="auto"
        show-adjacent-months
        title=""
        @update:modelValue="handleDateChange"
      />
      <v-btn
        class="position-absolute top-0 right-0"
        color="white"
        icon="mdi-close"
        size="small"
        variant="text"
        @click="menu = false"
      ></v-btn>
    </div>
  </v-menu>
</template>

<script setup>
  import { onMounted, ref, watch } from "vue";
  import { useDisplay } from "vuetify";

  const model = defineModel();
  const { width, xs } = useDisplay();
  const menu = ref(false);
  const formattedDate = ref(formatDate(model.value));

  const handleDateChange = (newDate) => {
    model.value = newDate;
  };
  watch(
    () => model.value,
    (newVal) => {
      formattedDate.value = formatDate(newVal);
      menu.value = false;
    },
  );
  onMounted(() => {
    model.value = model.value ? new Date(model.value) : null;
  });

  function formatDate(inputDate) {
    if (!inputDate) return "";
    const parsedDate = new Date(inputDate);
    if (!parsedDate.getTime()) return "";

    const day = `0${parsedDate.getDate()}`.slice(-2);
    const month = `0${parsedDate.getMonth() + 1}`.slice(-2);
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
</script>