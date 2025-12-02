<template>
  <p class="text-grey-darken-1 my-3">
    Max File Size 50MB (jpg, jpeg, png, webp, doc, docx, xls, xlsx, ppt, pptx, pdf & txt)
  </p>
  <div
    v-for="(file, index) in files"
    :key="index"
    class="mb-2 d-flex align-center"
  >
    <template v-if="attachments?.[index]">
      <v-text-field
        v-model="attachments[index].original_name"
        label="Uploaded File"
        bg-color="grey-lighten-4"
        variant="outlined"
        density="compact"
        readonly
      >
        <template v-slot:prepend>
          <v-icon>mdi-paperclip</v-icon>
        </template>
        <template v-slot:append>
          <v-btn
            v-if="files.length > 0"
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
      </v-text-field>
    </template>
    <template v-else>
      <v-file-input
        v-model="files[index]"
        label="Attachment File Input"
        variant="outlined"
        density="compact"
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
    </template>
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
import { ref, watch, onMounted } from "vue";
import axios from "@/axios";

export default {
  name: "SelectMultiFilesRevision",
  props: {
    attachments: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const files = ref([]);
    const files_id = ref([]);
    const showModal = ref(false);
    const max_file_size = ref(1048576 * 50); // 1MB
    const largeFiles = ref([]);

    if (props.attachments) {
      onMounted(() => {
        files_id.value = props.attachments.map((att) => att.id);
        files.value = props.attachments.map(() => null);
      });
    }

    const addFileInput = () => {
      files.value.push(null);
    };

    const removeFileInput = async (index) => {
      if (files.value.length > 0) {
        const mediaID = files_id.value[index];

        if (mediaID) {
          try {
            await axios.delete(`/media/${mediaID}`);

            files.value.splice(index, 1);
            files_id.value.splice(index, 1);
            props.attachments.splice(index, 1);
            emit("files-updated", files_id.value);

            if (files.value.length === 0) {
              props.attachments.length = 0;
              addFileInput();
            }
          } catch (error) {
            console.error("Failed to delete media:", error);
          }
        } else {
          files.value.splice(index, 1);
          files_id.value.splice(index, 1);
        }
      }
    };

    const clearFile = (index) => {
      files.value[index] = null;
      files_id.value[index] = null;
      emit("files-updated", files_id.value);
    };

    watch(
      [files_id, files],
      ([newFilesId, newFiles]) => {
        emit("files-updated", newFilesId);
        if (newFiles.length === 0) {
          addFileInput();
        }
      },
      { deep: true, immediate: true }
    );

    const handleFileUpload = async (index) => {
      largeFiles.value = files.value
        .map((file, idx) =>
          file && file.size >= max_file_size.value
            ? { index: idx, name: file.name, size: file.size }
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
          console.error("Upload error:", error);
        }
      }
    };

    const removeLargeFiles = () => {
      largeFiles.value.forEach((file) => {
        files.value[file.index] = null;
      });
      largeFiles.value = [];
      showModal.value = false;
    };

    const formatSize = (size) => {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    };

    return {
      files,
      addFileInput,
      removeFileInput,
      handleFileUpload,
      removeLargeFiles,
      showModal,
      largeFiles,
      formatSize,
      max_file_size,
      files_id,
      clearFile,
    };
  },
};
</script>
