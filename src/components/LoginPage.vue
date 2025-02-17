<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <form @submit.prevent="login">
                  <div class="text-center">
                    <img
                      class="header__logo"
                      src="@/assets/ds_group.png"
                      alt="DS GROUP Logo"
                    />
                  </div>
                  <CInputGroup class="mb-3 mt-3">
                    <i class="fas fa-envelope icon"></i>
                    <input
                      type="email"
                      v-model="email"
                      class="form-control"
                      placeholder="Enter your username"
                      required
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <i class="fas fa-lock icon"></i>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Enter your password"
                      v-model="password"
                      required
                    />
                  </CInputGroup>
                  <!-- Google reCAPTCHA -->
                  <div class="g-recaptcha" data-sitekey="6Ld-o7EqAAAAAHzrCpbSzWwBYRoNoQFX4d8g2tLf"></div>
                  <CRow>
                    <div class="form-check d-flex justify-content-start mb-0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="form1Example3"
                      />
                      <label class="form-check-label" for="form1Example3">
                        Remember password
                      </label>
                    </div>
                    <div
                      v-if="loginMessage"
                      class="alert alert-success"
                      role="alert"
                    >
                      Login successful!
                    </div>
                    <hr class="my-4" />
                  </CRow>
                  <CRow>
                    <CCol :xs="12" class="text-center">
                      <input
                        type="submit"
                        class="btn btn-dark btn-lg btn-block"
                        value="Login"
                        :disabled="loading"
                      />
                      <div v-if="loading" class="spinner-border text-primary mt-3" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </CCol>
                  </CRow>
                </form>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  <FooterCom />
</template>

<script>
import FooterCom from "@/components/common/FooterCom.vue";
import axios from "axios";
import { logout } from "@/utils/authUtils";

export default {
  components: {
    FooterCom,
  },
  data() {
    return {
      email: "",
      password: "",
      loginMessage: false,
      loginMessageTimeout: null,
      username: "",
      loading: false,
    };
  },
  methods: {
    login() {
  this.loading = true;

  if (!window.grecaptcha) {
    console.error("reCAPTCHA not loaded");
    alert("reCAPTCHA is not ready. Please try again later.");
    this.loading = false;
    return;
  }

  const recaptchaResponse = window.grecaptcha.getResponse();

  if (!recaptchaResponse) {
    alert("Please complete the reCAPTCHA");
    this.loading = false;
    return;
  }

      axios
        .post(process.env.VUE_APP_ROOT_API + "/login", {
          email: this.email,
          password: this.password,
          recaptcha: recaptchaResponse,
        })
        .then((response) => {
          if (response.data.success) {
            this.loginMessage = true;
            this.username = response.data.username;
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            if (response.data.role === "Admin") {
              this.$router.push("/admin/user");
            } else if (response.data.role === "Regularuser") {
              this.$router.push("/user/dashboard");
            }
            if (this.loginMessageTimeout) {
              clearTimeout(this.loginMessageTimeout);
            }
            this.loginMessageTimeout = setTimeout(() => {
              this.loginMessage = false;
            }, 3000);
          } else {
            alert("Login failed. Please check your credentials.");
          }
        })
        .catch((error) => {
          console.error("Error while logging in:", error);
          alert("Error while logging in. Please try again later.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    logout() {
      logout();
      this.$router.push("/login");
    },
  },
  mounted() {
  const recaptchaScriptId = 'recaptcha-script';
  if (!document.getElementById(recaptchaScriptId)) {
    const script = document.createElement("script");
    script.id = recaptchaScriptId;
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    console.log("reCAPTCHA script added");
  } else {
    console.log("reCAPTCHA script already exists");
  }
},

};
</script>



<style scoped>
h2 {
  font-size: 2rem !important;
}
.icon:not(.icon-c-s):not(.icon-custom-size) {
  width: 1rem;
  height: auto !important;
  font-size: 1rem;
}
.icon {
  padding: 10px;
  background: #009746;
  color: white;
  min-width: 50px;
  text-align: center;
}
.btn-dark {
  background-color: #009746;
  border: 1px solid #009746;
}
.form-check-label {
  font-size: 0.9rem;
  color: #6e6e6e;
  margin-left: 10px;
}
.header__logo {
  width: 80px;
  margin-right: 0px;
}
.ds-title {
  font-size: 40px;
  font-weight: bold;
}
</style>
