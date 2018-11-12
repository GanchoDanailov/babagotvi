<template>
  <div class="dashboard-page">
    <section class="new-post">
      <AppButton style="margin-left: 10px" @click="onLogout">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>User dashboard here</h1>
    </section>
  </div>
</template>

<script>
export default {
  layout: "dashboard",
  methods: {
    onLogout() {
      this.$store.dispatch("logout")
      this.$router.push("/auth")
    }
  }
};
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}
</style>
