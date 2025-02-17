<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex me-auto"> </CHeaderNav>
      <CHeaderNav>
        <AppHeaderDropdownAccnt :username="username" @logout="handleLogout" />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from "./AppBreadcrumb";
import AppHeaderDropdownAccnt from "./AppHeaderDropdownAccnt";
import { logo } from "@/assets/brand/logo";
export default {
  name: "AppHeader",
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  data() {
    return {
      username: localStorage.getItem("username") , 
    };
  },

  methods: {
    handleLogout() {
      // Clear the username from local storage
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      // Navigate to the login page
      this.$router.push("/"); 
    },
  },

  setup() {
   
    return {
      logo,
    };
  },
};
</script>