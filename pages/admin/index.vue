<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton style="margin-left: 10px" @click="onLogout">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Admin stuffs here</h1>
    </section>
  </div>
</template>

<script>
export default {
  layout: "admin",
  methods: {
    onLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/auth");
    }
  }
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>
