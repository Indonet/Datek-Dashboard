<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
    <Editor :defaultConfig="editorConfig" :mode="mode" :modelValue="valueHtml" @update:modelValue="updateValue"
      :style="`height: ${compact ? '300px' : '700px'}; overflow-y: hidden`" @onCreated="handleCreated" />
  </div>

  <!-- <div style="margin-top: 10px">
    <textarea
      v-model="valueHtml"
      readonly
      style="width: 100%; height: 200px; outline: none"
    ></textarea>
  </div> -->
</template>

<style>
.w-e-full-screen-container {
  z-index: 999;
  bottom: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  height: 88% !important;
  left: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  position: fixed;
  right: 0 !important;
  top: 110px !important;
  width: 100% !important;
}
</style>

<script>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, defineProps, defineEmits, watch, computed } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { i18nChangeLanguage, i18nAddResources } from '@wangeditor/editor';

i18nChangeLanguage('en');

i18nAddResources('en', {
  fontFamily: {
    default: 'Arial',
    title: 'Font family',
  },
  fontSize: {
    default: '12px',
    title: 'Font size',
  },
});

export default {
  name: 'ExampleWangEditor',
  components: { Editor, Toolbar },
  props: {
    modelValue: String, // Pastikan props menerima modelValue dari parent
    compact: Boolean,
  },
  emits: ['update:modelValue'], // Emmit perubahan nilai
  setup(props, { emit }) {
    const editorRef = shallowRef(null);
    // const valueHtml = ref(props.modelValue || ''); // Gunakan nilai awal dari props
    const valueHtml = ref(props.modelValue || ``); // Gunakan nilai awal dari props

    const updateValue = (newValue) => {
      valueHtml.value = newValue;
      emit('update:modelValue', newValue); // Emit perubahan ke parent
    };
    
    watch(() => props.modelValue, (newVal) => {
      if (newVal !== valueHtml.value) {
        valueHtml.value = newVal;
      }
    });

    const editorStyle = computed(() => ({
      height: props.compact ? '300px' : '800px',
      overflowY: 'hidden',
    }));

    // Konfigurasi Toolbar
    const toolbarConfig = {
      excludeKeys: ['group-video'],
    };

    // Konfigurasi Editor dengan Upload Gambar
    const editorConfig = {
      placeholder: 'Type here...',
      MENU_CONF: {
        uploadImage: {
          server: `https://${import.meta.env.VITE_DOMAIN}/api/media/upload`,
          fieldName: 'media',
          maxFileSize: 10 * 1024 * 1024,
          maxNumberOfFiles: 1,
          allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
          meta: { type: 'editor' },
          onSuccess(file, res) {
            if (editorRef.value) {
              editorRef.value.insertImage(res.url);
            }
          },
          onFailed(file, res) {
            console.error('Upload gagal:', res);
          },
          onError(file, err) {
            console.error('Terjadi kesalahan:', err);
            alert('Upload gagal: ' + err);
          },
        },
        insertImage: {
          onInserted(url) {
          },
        },
      },
    };

    const handleCreated = (editor) => {
      editorRef.value = editor;
    };

    // onBeforeUnmount(() => {
    //   if (editorRef.value) {
    //     editorRef.value.destroy();
    //   }
    // });

    return {
      editorRef,
      valueHtml,
      updateValue,
      mode: 'default',
      toolbarConfig,
      editorConfig,
      handleCreated,
    };
  },
};
</script>