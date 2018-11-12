import Vuex from "vuex";
import Cookie from "js-cookie";
import { resolve } from "path";

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      authMessage: null,
      userRoles: null
    },
    mutations: {
      setToken(state, token) { state.token = token },
      setUserRoles(state, roles) { state.userRoles = roles },
      clearUserRoles(state) { state.userRoles = null },
      clearToken(state) { state.token = null },
      setAuthMessage(state, message) { state.authMessage = message }
    },
    actions: {
      authenticateUser(vuexContext, authData) {
        let authUrl = "api/auth/login"
        if (!authData.isLogin) {
          authUrl = "api/auth/register"
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password
          })
          .then(result => {
            const userRoles = JSON.stringify(result.user.roles)
            vuexContext.commit("setUserRoles", result.user.roles)
            localStorage.setItem("userRoles", userRoles)
            Cookie.set("userRoles", userRoles)

            vuexContext.commit("setToken", result.idToken)
            localStorage.setItem("token", result.idToken)
            Cookie.set("jwt", result.idToken)

            localStorage.setItem("tokenExpiration", new Date().getTime() + Number.parseInt(result.expiresIn) * 1000)
            Cookie.set("expirationDate", new Date().getTime() + Number.parseInt(result.expiresIn) * 1000)

            return result
          })
          .catch(e => {
            localStorage.removeItem('token')
            vuexContext.commit("setAuthMessage", e.response.data.errorMessage)
            console.log('Error while logging', e.response.data)
          });

      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        let userRoles;
        if (req) {
          if (!req.headers.cookie) { return }
          const jwtCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith("jwt="))
          if (!jwtCookie) { return }
          token = jwtCookie.split("=")[1]
          expirationDate = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("expirationDate="))
            .split("=")[1];
          const userRolesString = req.headers.cookie.split(";").find(c => c.trim().startsWith("userRoles=")).split("=")[1].replace(/\%22/g, '"').replace(/\%2C/g, ',')
          userRoles = JSON.parse(userRolesString)
        } else {
          token = localStorage.getItem("token")
          expirationDate = localStorage.getItem("tokenExpiration")
          userRoles = JSON.parse(localStorage.getItem("userRoles"))
        }
        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No token or invalid token");
          vuexContext.dispatch("logout");
          return;
        }
        if (!vuexContext.getters.isAuthenticated) {
          vuexContext.commit("setUserRoles", userRoles)
          vuexContext.commit("setToken", token)
        }
      },
      logout(vuexContext) {
        vuexContext.commit("clearToken");
        vuexContext.commit("clearUserRoles");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        Cookie.remove("userRoles");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
          localStorage.removeItem("userRoles");
        }
      }
    },
    getters: {
      isAuthenticated(state) {
        return state.token != null;
      },
      userRoles(state) {
        return state.userRoles;
      }
    }
  });
};

export default createStore;
