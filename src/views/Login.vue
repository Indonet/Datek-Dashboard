<template>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",
  data() {
    return {
      errorMessage: ""
    };
  },

  mounted() {
    this.handleLogin();
  },

  methods: {
    async handleLogin() {
      const authStore = useAuthStore();
      const router = useRouter();
      
      try {
        await authStore.login();
        router.push("/dashboard");
      } catch (error) {
        this.errorMessage = "Login gagal. Periksa kembali kredensial Anda.";
      }
    }
  }
};
</script>