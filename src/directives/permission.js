import { useAuthStore } from "@/stores/authStore";

export default {
  mounted(el, binding) {
    const authStore = useAuthStore();
    const { value: permission } = binding;

    if (!authStore.hasPermission(permission)) {
      el.style.display = "none"; // Sembunyikan elemen jika tidak punya izin
    }
  }
};
