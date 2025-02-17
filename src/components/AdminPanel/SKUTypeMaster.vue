<template> 
          <!-- <CRow>
            <CCol :sm="12">
              <CRow class="mb-4">
                <CCol :xs="5">
                  Search input field
                  <input
                    v-model="searchTerm"
                    class="form-control"
                    type="text"
                    placeholder="Search SKU Type"
                  /><b>Total: {{filteredSKUTypes.length}}</b>
                </CCol> -->
                <CRow>
          <CCol :sm="12">
            <CRow class="mb-4">
            <CCol :xs="6">
             
                <CCol class="row">
                  <CCol :xs="6">
                        <!-- Search input field -->
                        <input v-model="searchTerm" type="text" class="form-control" placeholder="Search Role">
                  </CCol>
                    <CCol :xs="6"><p>Total: {{ filteredSKUTypes.length }}</p>
                    </CCol>
                  </CCol>
            </CCol>
                <CCol :xs="6">
                  <div class="add-btn-right">
                    <CButton
                      color="btn btn-success primary"
                      @click="
                        () => {
                          showModal = true;
                        }
                      "
                      >Add&nbsp;New&nbsp;SKU&nbsp;Type</CButton
                    >
                  </div>
                </CCol>
              </CRow>
              <!-- Display list of SKU Types -->
              <CTable bordered class="table table-striped">
                <CTableHead color="secondary">
                  <CTableRow class="text-caption">
                    <CTableHeaderCell>SKU Type Name</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody class="text-caption">
                  <CTableRow
                    v-for="skuType in filteredSKUTypes"
                    :key="skuType.SKU_Type_ID"
                  >
                    <CTableDataCell>{{ skuType.SKU_Type_Name }}</CTableDataCell>
                    <CTableDataCell>
                      <span>
                        <font-awesome-icon
                          icon="eye"
                          @click="viewSKUType(skuType)"
                          title="View"
                        />
                      </span>
                      <span class="ms-2">
                        <font-awesome-icon
                          icon="edit"
                          @click="editSKUType(skuType)"
                          title="Edit"
                        />
                      </span>
                      <span class="ms-2">
                        <font-awesome-icon
                          icon="trash"
                          @click="confirmDeleteSKUType(skuType.SKU_Type_ID)"
                          title="Delete"
                        />
                      </span>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <!-- Add New SKU Type Button (moved to the bottom) -->

              <CModal
                :visible="showModal"
                @close="
                  () => {
                    showModal = false;
                  }
                "
              >
                <CModalHeader>
                  <CModalTitle> Add New SKU Type </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <input
                    v-model="newSKUType.SKU_Type_Name"
                    type="text"
                    class="form-control"
                    placeholder="SKU Type Name"
                  />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" @click="cancelSKUType">
                    Close
                  </CButton>
                  <CButton color="success" @click="saveSKUType">Save</CButton>
                </CModalFooter>
              </CModal>
              <!-- View SKU Modal -->
              <CModal :visible="showViewModal" @close="showViewModal = false">
                <CModalHeader>
                  <CModalTitle>View SKU Type</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <p>{{ selectedSKU.SKU_Type_Name }}</p>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" @click="showViewModal = false"
                    >Close</CButton
                  >
                </CModalFooter>
              </CModal>

              <!-- Edit SKU Modal -->
              <CModal :visible="showEditModal" @close="showEditModal = false">
                <CModalHeader>
                  <CModalTitle>Edit SKU</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <input
                    v-model="selectedSKU.SKU_Type_Name"
                    type="text"
                    class="form-control"
                    placeholder="Brand Name"
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
                    class="btn btn-success"
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
      skuTypes: [],
      showModal: false,
      showViewModal: false,
      showEditModal: false,
      selectedSKU: {
        SKU_Type_ID: null,
        SKU_Type_Name: "",
      },

      newSKUType: {
        SKU_Type_Name: "",
      },
      searchTerm: "",
      skuTypesPerPage: 20,
      currentPage: 1,
    };
  },
  computed: {
    filteredSKUTypes() {
      if (!this.searchTerm) {
        return this.skuTypes;
      }
      const searchTermLowerCase = this.searchTerm.toLowerCase();
      return this.skuTypes.filter((skuType) =>
        skuType.SKU_Type_Name.toLowerCase().includes(searchTermLowerCase)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredSKUTypes.length / this.skuTypesPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.skuTypesPerPage;
    },
    endIndex() {
      return this.startIndex + this.skuTypesPerPage;
    },
    paginatedSKUTypes() {
      return this.filteredSKUTypes.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    async fetchSKUTypes() {
      try {
        const response = await axios.post(
          process.env.VUE_APP_ROOT_API + "/api/sku-types/fetch"
        );

        // Sort the brands by ID in descending order
        this.skuTypes = response.data;
		// .sort(
        //   (a, b) => b.SKU_Type_ID - a.SKU_Type_ID
        // );
      } catch (error) {
        console.error("Error fetching SKU Types:", error);
      }
    },
    viewSKUType(skuType) {
      this.selectedSKU = { ...skuType };
      this.showViewModal = true;
    },

    editSKUType(skuType) {
      this.selectedSKU = { ...skuType };
      this.showEditModal = true;
    },
    async saveEdit() {
      try {
        // Make sure selectedSKU.SKU_Type_ID is not null and has a valid value.
        if (this.selectedSKU.SKU_Type_ID !== null) {
          await axios.put(
            process.env.VUE_APP_ROOT_API +
              `/api/sku-types/${this.selectedSKU.SKU_Type_ID}`,
            {
              SKU_Type_Name: this.selectedSKU.SKU_Type_Name,
            }
          );

          //console.log("Updated SKU Type:", response.data);
          // Refresh the SKU Type list after editing
          this.fetchSKUTypes();

          // Close the edit modal
          this.showEditModal = false;
        } else {
          console.error("Selected SKU Type ID is missing or invalid.");
        }
      } catch (error) {
        console.error("Error updating SKU Type:", error);
      }
    },
    async confirmDeleteSKUType(skuTypeId) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this SKU Type?"
      );
      if (shouldDelete) {
        this.deleteSKUType(skuTypeId);
      }
    },

    async deleteSKUType(skuTypeId) {
      try {
        await axios.delete(
          process.env.VUE_APP_ROOT_API + `/api/sku-types/${skuTypeId}`
        );
        this.fetchSKUTypes(); // Refresh the SKU Type list after deletion
      } catch (error) {
        console.error("Error deleting SKU Type:", error);
      }
    },

    async saveSKUType() {
      try {
        if (this.newSKUType.SKU_Type_ID) {
          await axios.put(
            process.env.VUE_APP_ROOT_API +
              `/api/sku-types/${this.newSKUType.SKU_Type_ID}`,
            this.newSKUType
          );
        } else {
          await axios.post(
            process.env.VUE_APP_ROOT_API + "/api/sku-types",
            this.newSKUType
          );
        }
        this.fetchSKUTypes(); // Refresh the SKU Type list after adding/editing
        this.showModal = false;
      } catch (error) {
        console.error("Error saving SKU Type:", error);
      }
    },
    cancelSKUType() {
      this.showModal = false;
      this.newSKUType = {
        SKU_Type_Name: "",
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
      this.newSKUType = {
        SKU_Type_Name: "",
      };
    },
  },
  mounted() {
    this.fetchSKUTypes();
  },
};
</script>

<style>
.text-caption {
  font-size: 0.8rem !important;
}

.sku-types-container {
  margin: 20px;
}

.sku-types-table {
  width: 100%;
  border-collapse: collapse;
}

.sku-types-table th,
.sku-types-table td {
  padding: 8px;
  border: 1px solid #ccc;
}

.sku-types-table th {
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

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container input {
  padding: 8px;
  margin-bottom: 10px;
  width: 300px;
}

.modal-btn-group {
  display: flex;
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.save-btn {
  background-color: #64b5f6;
  color: #fff;
}

.cancel-btn {
  background-color: #e57373;
  color: #fff;
}
.add-btn-right {
  float: right;
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
