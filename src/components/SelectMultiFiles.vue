<template>
  <p class="text-grey-darken-1 my-3">
    Max File Size 50MB (jpg, jpeg, png, webp, doc, docx, xls, xlsx, ppt, pptx, pdf & txt)
  </p>
  <div
    v-for="(file, index) in files"
    :key="index"
    class="mb-2 d-flex align-center"
  >
    <v-file-input
      v-model="files[index]"
      label="Attachment File Input"
      variant="outlined"
      density="compact"
      :rules="rules"
      :error="errorMessages[index]"
      :error-messages="errorMessages[index] ? [errorMessages[index]] : []"
      accept="`
        image/jpg, 
        image/jpeg, 
        image/png, 
        image/webp, 
        application/pdf,
        .doc,
        .docx,
        .xls,
        .xlsx,
        .ppt,
        .pptx,
        .txt,
        application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document
      `"
      @change="handleFileUpload(index)"
      @click:clear="clearFile(index)"
    >
      <template v-slot:append>
        <v-btn
          v-if="files.length > 1"
          @click="removeFileInput(index)"
          icon
          size="x-small"
          class="mr-2 my-0 text-h6"
          >-</v-btn
        >
        <v-btn
          v-if="index === files.length - 1"
          @click="addFileInput"
          icon
          size="x-small"
          color="orange-darken-4"
          class="ma-0 text-h6"
          >+</v-btn
        >
        <span v-else style="width: 32px; display: inline-block"></span>
      </template>
    </v-file-input>
  </div>

  <!-- MODAL -->
  <v-dialog v-model="showModal" max-width="400" persistent>
    <v-card class="text-center">
      <v-card-title class="headline">File Too Large</v-card-title>
      <v-card-text>
        <div v-for="(file, i) in largeFiles" :key="file.index">
          {{ file.name }} ({{ formatSize(file.size) }})
        </div>
        Max Size: {{ formatSize(max_file_size) }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="orange-darken-4" variant="flat" @click="removeLargeFiles"
          >Delete File</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from "vue";
import axios from "@/axios";

export default {
  name: "SelectMultiFiles",
  data: () => ({
    rules: [
      (files) =>
        !files ||
        !files.some((file) => file && file.size > this.max_file_size) ||
        "File size must be less than 50MB",
    ],
  }),
  setup(props, { emit }) {
    const files = ref([null]);
    const files_id = ref([null]);
    const errorMessages = ref([]);
    const showModal = ref(false);
    const max_file_size = ref([52428800]);
    const largeFiles = ref([]);

    const addFileInput = () => {
      files.value.push(null);
      files_id.value.push(null);
      errorMessages.value.push(null);
    };

    const removeFileInput = (index) => {
      if (files.value.length > 1) {
        files.value.splice(index, 1);
        files_id.value.splice(index, 1);
        errorMessages.value.splice(index, 1);
      }
    };

    const clearFile = (index) => {
      files.value[index] = null;
      files_id.value[index] = null;
      errorMessages.value[index] = null;
      emit("files-updated", files_id.value);
    };

    watch(
      files_id.value,
      (newFiles) => {
        emit("files-updated", newFiles);
      },
      { deep: true }
    );

    const handleFileUpload = async (index) => {
      errorMessages.value[index] = null;

      largeFiles.value = files.value
        .map((file, index) =>
          file && file.size >= max_file_size.value
            ? { index, name: file.name, size: file.size }
            : null
        )
        .filter((file) => file !== null);

      if (largeFiles.value.length > 0) {
        showModal.value = true;
      } else {
        const formData = new FormData();
        formData.append("media", files.value[index]);
        formData.append("type", "attachment");

        try {
          const response = await axios.post("/media/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          files_id.value[index] = response.data.data.mediaId;
        } catch (error) {
          errorMessages.value[index] = error.response.data.error;
          console.error("Upload error:", error);
        }
      }
    };

    const removeLargeFiles = () => {
      largeFiles.value.forEach((file) => {
        files.value[file.index] = null; // Hapus file dari array
        errorMessages.value[file.index] = null;
      });
      largeFiles.value = [];
      showModal.value = false;
    };

    const formatSize = (size) => {
      // return (size / 1024).toFixed(2) + " KB"; // Format ke KB
      return (size / (1024 * 1024)).toFixed(2) + " MB"; // Format ke MB
    };

    return {
      files,
      files_id,
      errorMessages,
      addFileInput,
      removeFileInput,
      handleFileUpload,
      removeLargeFiles,
      showModal,
      largeFiles,
      formatSize,
      max_file_size,
      clearFile,
    };
  },
};
</script>