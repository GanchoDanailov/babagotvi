<template>
  <div class="admin-auth-page">
    <div class="auth-container">
      <form @submit.prevent="onSubmit">
        <AppControlInput type="email" v-model="email">E-Mail Address</AppControlInput>
        <AppControlInput type="password" v-model="password">Password</AppControlInput>
        <AppButton type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</AppButton>
        <AppButton
          type="button"
          btn-style="inverted"
          style="margin-left: 10px"
          @click="isLogin = !isLogin">Switch to {{ isLogin ? 'Signup' : 'Login' }}</AppButton>
      </form>
      <div v-show="this.isAuthMessage">{{this.isAuthMessage}}</div>

    </div>
  </div>
</template>

<script>
export default {
  name: "AdminAuthPage",
  data() {
    return {
      isLogin: true,
      email: "",
      password: ""
    };
  },
  methods: {
    onSubmit() {
      this.$store.dispatch("authenticateUser", {
        isLogin: this.isLogin,
        email: this.email,
        password: this.password
      })
      .then((result) => {
        // console.log('is user admin', result.user.roles.includes('Admin') )
        if(result.user.roles.includes('Admin')){
          this.$router.push('/admin')
        } else {
          this.$router.push('/dashboard')
        }
      });
    }
  },
  computed: {
    isAuthMessage () {
        setTimeout(() => {
          this.$store.state.authMessage = null
        }, 10000)
        return this.$store.state.authMessage
    },
  }
};
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>
