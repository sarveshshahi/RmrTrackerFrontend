<template>
    <CSidebar
      position="fixed"
      :unfoldable="sidebarUnfoldable"
      :visible="sidebarVisible"
      @visible-change="
        (event) =>
          $store.commit({
            type: 'updateSidebarVisible',
            value: event,
          })
      "
    >
      <CSidebarBrand>
        <!-- <CIcon
          custom-class-name="sidebar-brand-full"
          :icon="logoNegative"
          :height="35"
        /> -->
        <img class="logo sidebar-brand-full" src="../../assets/ds_group.png" alt="DS GROUP Logo" />
        <!-- <CIcon
          custom-class-name="sidebar-brand-narrow"
          :icon="sygnet"
          :height="35"
        /> -->
        <img class="logo-s sidebar-brand-narrow" src="../../assets/images/DS-s.png" alt="DS GROUP Logo" />
      </CSidebarBrand>
      <AppSidebarNav />
      <CSidebarToggler
        class="d-none d-lg-flex"
        @click="$store.commit('toggleUnfoldable')"
      />
    </CSidebar>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { AppSidebarNav } from './AppSidebarNav'
  import { logoNegative } from '@/assets/brand/logo-negative'
  import { sygnet } from '@/assets/brand/sygnet'
  export default {
    name: 'AppSidebar',
    components: {
      AppSidebarNav,
    },
    setup() {
      const store = useStore()
      return {
        logoNegative,
        sygnet,
        sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
        sidebarVisible: computed(() => store.state.sidebarVisible),
      }
    },
  }
  </script>
  <style scoped>
  .logo{
    width: 70px;
    height: 70px;
    margin-bottom: 30px;
    margin-top: 20px;
  }
  .logo-s{
    width: 38px;
    height: 38px;
    margin-bottom: 30px;
    margin-top: 20px;
  }
</style>