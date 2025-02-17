<template>
 <div class="admin-panel-container">
   <div class="sidebar">
   <router-link to="/admin/user" class="sidebar-link">User Master</router-link>
      <router-link to="/admin/brand" class="sidebar-link">Brand Master</router-link>
      <router-link to="/admin/net" class="sidebar-link">Net Weight Master</router-link>
      <router-link to="/admin/role" class="sidebar-link">Role Master</router-link>
      <router-link to="/admin/sku" class="sidebar-link">SKU Type Master</router-link>
    </div>

    <!-- Content Area -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
 </template>

<style scoped>
.admin-panel-container {
  display: flex;
}

.sidebar {
  width: 220px;
  background-color: #283747;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}

.sidebar a {
  display: block;
  margin-bottom: 10px;
  color: #fff; 
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  background-color: #3498db; 
  transition: background-color 0.3s ease;
}

.sidebar a:hover {
  background-color: #2980b9; 
}

.content {
  margin-left: 240px;
  padding: 20px;
}
</style>
