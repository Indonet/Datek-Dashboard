<template>
  <v-container fluid class="bg-brown-lighten-5">
    <div class="image_center">
      <v-img
        max-width="200"
        src="@/assets/indonet-logo-new.png"
        class="my-8"
      />
    </div>
    <v-empty-state
      headline="Whoops, Sorry...!"
      title="Page not found or forbidden"
      text="The page you are looking for was not found or cannot be accessed"
      action-text="Go to Dashboard"
      @click="$router.push(`/dashboard`)"
    />
  </v-container>
</template>


<script>
export default {
  name: "notfound",
  data() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style>
    .image_center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      max-width: 100%;
      height: auto;
    }
</style>
