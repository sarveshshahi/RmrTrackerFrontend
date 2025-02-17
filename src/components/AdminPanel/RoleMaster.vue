<template>
     
          <!-- <CRow>
            <CCol :sm="12">
              <CRow class="mb-4">
                <CCol :xs="6">
                  Search input field
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Search Role"
                  />
				<b>Total: {{ filteredRoles.length }}</b>
                </CCol>
                <CCol :xs="6">
                  <div class="add-btn-right">
                    <CButton
                      color="btn btn-success primary"
                      @click="openAddModal"
                    >
                      Add&nbsp;New&nbsp;Role
                    </CButton>
                  </div>
                </CCol>
              </CRow> -->

            
    
        <CRow>
          <CCol :sm="12">
            <CRow class="mb-4">
            <CCol :xs="6">
             
                <CCol class="row">
                  <CCol :xs="6">
                        <!-- Search input field -->
                        <input v-model="searchTerm" type="text" class="form-control" placeholder="Search Role">
                  </CCol>
                    <CCol :xs="6"><p>Total: {{ filteredRoles.length }}</p>
                    </CCol>
                  </CCol>
            </CCol>
            <CCol :xs="6">
                <div class="add-btn-right">
                    <CButton color="btn btn-success primary" @click="openAddModal">Add&nbsp;New&nbsp;Role</CButton>
                </div>
            </CCol>
        </CRow>
    

              <!-- Display list of roles -->
              <CTable bordered class="table table-striped">
                <CTableHead color="secondary">
                  <CTableRow class="text-caption">
                    <CTableHeaderCell>Role Name</CTableHeaderCell>
                    <CTableHeaderCell>Parent Role ID</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody class="text-caption">
                  <CTableRow v-for="role in filteredRoles" :key="role.Role_ID">
                    <CTableDataCell>{{ role.Role_Name }}</CTableDataCell>
                    <CTableDataCell>{{ role.Parent_Role_ID }}</CTableDataCell>
                    <CTableDataCell>
                      <span>
                        <font-awesome-icon
                          icon="eye"
                          @click="viewRole(role)"
                          title="View"
                        />
                      </span>
                      <span class="ms-2">
                        <font-awesome-icon
                          icon="edit"
                          @click="editRole(role)"
                          title="Edit"
                        />
                      </span>
                      <span class="ms-2">
                        <font-awesome-icon
                          icon="trash"
                          @click="confirmDeleteRole(role.Role_ID)"
                          title="Delete"
                        />
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <!-- Add  Role Modal -->
              <CModal
                :visible="showModal"
                @close="
                  () => {
                    showModal = false;
                  }
                "
              >
                <CModalHeader>
                  <CModalTitle>Add New Role</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <input
                    v-model="newRole.Role_Name"
                    type="text"
                    class="form-control mb-4"
                    placeholder="Role Name"
                  />
                  <input
                    v-model="newRole.Parent_Role_ID"
                    type="text"
                    class="form-control"
                    placeholder="Parent Role ID"
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" @click="cancelRole">
                    Cancel
                  </CButton>
                  <CButton color="success" @click="saveRole">Save</CButton>
                </CModalFooter>
              </CModal>
              <!-- View Role Modal -->
              <CModal :visible="showViewModal" @close="showViewModal = false">
                <CModalHeader>
                  <CModalTitle>View Role</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p>{{ selectedRole.Role_Name }}</p>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" @click="showViewModal = false"
                    >Close</CButton
                  >
                </CModalFooter>
              </CModal>

              <!-- Edit Role Modal -->
              <CModal :visible="showEditModal" @close="showEditModal = false">
                <CModalHeader>
                  <CModalTitle>Edit Role</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <input
                    v-model="selectedRole.Role_Name"
                    type="text"
                    class="form-control"
                    placeholder="Role Name"
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" @click="showEditModal = false"
                    >Cancel</CButton
                  >
                  <CButton color="success" @click="saveEdit"
                    >Save Changes</CButton
                  >
                </CModalFooter>
              </CModal>
              <!-- Pagination buttons 
              <div class="pagination">
                <CCol :sm="6">
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="btn m-2"
                  >
                    <i class="fas fa-chevron-left"></i> Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="btn btn-dark"
                  >
                    Next <i class="fas fa-chevron-right"></i>
                  </button>
                </CCol>
              </div>
              -->
            </CCol>
          </CRow>       
   
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      roles: [], // Array to store role data from the backend
      showModal: false,
      newRole: {
        Role_Name: "",
        Parent_Role_ID: null,
      },
      showViewModal: false,
      showEditModal: false,
      selectedRole: {
        Role_ID: null,
        Role_Name: "",
      },
      searchTerm: "",
      rolesPerPage: 20,
      currentPage: 1,
    };
  },
  computed: {
    filteredRoles() {
      if (!this.searchTerm) {
        return this.roles;
      }
      const searchTermLowerCase = this.searchTerm.toLowerCase();
      return this.roles.filter(
        (role) =>
          role.Role_Name.toLowerCase().includes(searchTermLowerCase) ||
          (role.Parent_Role_ID &&
            role.Parent_Role_ID.toString().includes(searchTermLowerCase))
      );
    },
    // totalPages() {
    //   return Math.ceil(this.filteredRoles.length / this.rolesPerPage);
    // },
    // startIndex() {
    //   return (this.currentPage - 1) * this.rolesPerPage;
    // },
    // endIndex() {
    //   return this.startIndex + this.rolesPerPage;
    // },
    // paginatedRoles() {
    //   return this.filteredRoles.slice(this.startIndex, this.endIndex);
    // },
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await axios.post(
          process.env.VUE_APP_ROOT_API + "/api/roles/fetch"
        );
        this.roles = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    viewRole(role) {
      this.selectedRole = { ...role };
      this.showViewModal = true;
    },

    editRole(role) {
      this.selectedRole = { ...role };
      this.showEditModal = true;
    },

    async confirmDeleteRole(roleId) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this role?"
      );
      if (shouldDelete) {
        this.deleteRole(roleId);
      }
    },

    async deleteRole(roleId) {
      try {
        await axios.delete(
          process.env.VUE_APP_ROOT_API + `/api/roles/${roleId}`
        );
        this.fetchRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    },
    async saveRole() {
      try {
        if (this.newRole.Role_ID) {
          await axios.put(
            process.env.VUE_APP_ROOT_API + `/api/roles/${this.newRole.Role_ID}`,
            this.newRole
          );
        } else {
          await axios.post(
            process.env.VUE_APP_ROOT_API + "/api/roles",
            this.newRole
          );
        }
        this.fetchRoles();
        this.showModal = false;
      } catch (error) {
        console.error("Error saving role:", error);
      }
    },
    async saveEdit() {
      try {
        await axios.put(
          process.env.VUE_APP_ROOT_API +
            `/api/roles/${this.selectedRole.Role_ID}`,
          {
            ...this.selectedRole,
            oldRoleName: this.selectedRole.Role_Name, // Store the old role name
          }
        );
        this.fetchRoles();
        this.showEditModal = false;
      } catch (error) {
        console.error("Error saving edited role:", error);
      }
    },

    cancelRole() {
      this.showModal = false;
      this.newRole = {
        Role_Name: "",
        Parent_Role_ID: null,
      };
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    openAddModal() {
      this.showModal = true;
      this.newRole = {
        Role_Name: "",
        Parent_Role_ID: null,
      };
    },
  },
  mounted() {
    this.fetchRoles();
  },
};
</script>

<style>
.add-btn-right {
  float: right;
}

.text-caption {
  font-size: 0.8rem !important;
}

.role-container {
  margin: 20px;
}

.role-table {
  width: 100%;
  border-collapse: collapse;
}

.role-table th,
.role-table td {
  padding: 8px;
  border: 1px solid #ccc;
}

.role-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.view-btn {
  background-color: #81c784;
  color: #fff;
}

.edit-btn {
  background-color: #64b5f6;
  color: #fff;
}

.delete-btn {
  background-color: #e57373;
  color: #fff;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.prev-btn,
.next-btn {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
}

.prev-btn {
  background-color: #e91e63;
  /* Pink color */
}

.next-btn {
  background-color: #2196f3;
  /* Blue color */
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-btn {
  background-color: #64b5f6;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
