<template>
  <div>
    <h1>ADMIN</h1>
    <nuxt/>
  </div>
</template>
<script>
export default {
  middleware: ["check-auth", "auth", "is-in-admin-role"],
}
</script>


<style>
html {
  font-family: 'Open Sans', sans-serif;
}

body {
  margin: 0;
}
</style>
