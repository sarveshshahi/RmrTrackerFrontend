<template>
    <!-- <CRow>
        <CCol :md="12">           
                    <CRow>
                        <CCol :sm="12">
                            <CRow class="mb-4">
                                <CCol :xs="6">
                                    Search input field
                                    <input v-model="searchTerm" class="form-control" type="text"
                                        placeholder="Search Brand" />
										<b>Total: {{ filteredBrands.length }}</b>
                                </CCol>
                                <CCol :xs="6">
                                    <div class="add-btn-right">
                                        <CButton color="btn btn-success primary" @click="openAddModal">Add&nbsp;Brand</CButton>
                                    </div>
                                </CCol>
                            </CRow> -->
                            <CRow>
        <CCol :md="12">           
                    <CRow>
                        <CCol :sm="12">
                            <CRow class="mb-4">
                                <CCol :xs="6">
                                    <CCol class="row">
                                    <CCol :xs="6">
                                     <!-- Search input field -->
                                    <input v-model="searchTerm" class="form-control" type="text"
                                        placeholder="Search Brand" />
                                    </CCol>
									<CCol :xs="6"><p>Total: {{ filteredBrands.length }}</p>
                                    </CCol>
                                    </CCol>   
                                </CCol>
                                <CCol :xs="6">
                                    <div class="add-btn-right">
                                        <CButton color="btn btn-success primary" @click="openAddModal">Add&nbsp;Brand</CButton>
                                    </div>
                                </CCol>
                            </CRow>
                            <!-- Display list of brands -->
                            <CRow>
                                <CCol :sm="12">
                                    <CTable bordered class="table table-striped">
                                        <CTableHead color="secondary">
                                            <CTableRow class="text-caption">
                                                
                                                <CTableHeaderCell>Brand Name</CTableHeaderCell>
                                                <!-- <CTableHeaderCell>Active</CTableHeaderCell> -->
                                                <CTableHeaderCell>Actions</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody class="text-caption">
                                            <CTableRow v-for="brand in filteredBrands" :key="brand.Brand_ID">
                                               
                                                <CTableDataCell>{{ brand.Brand_Name }}</CTableDataCell>
                                                <!-- <CTableDataCell>{{ brand.Is_Active }}</CTableDataCell> -->
                                                <CTableDataCell>
                                                    <span class="ms-2">
                                                        <font-awesome-icon icon="eye" @click="viewBrand(brand)"
                                                            title="View" />
                                                    </span>
                                                    <span class="ms-2">
                                                        <font-awesome-icon icon="edit" @click="editBrand(brand)"
                                                            title="Edit" />
                                                    </span>
                                                    <span v-if="brand.Is_Active === 1" class="ms-2">
          <font-awesome-icon icon="trash" @click="deleteBrand(brand.Brand_ID)" title="Delete" />
        </span>
        <span v-if="brand.Is_Active === 0" class="ms-2">
          <font-awesome-icon icon="refresh" @click="restoreBrand(brand.Brand_ID)" title="Restore" />
        </span>
                                                </CTableDataCell>
                                            </CTableRow>
                                        </CTableBody>
                                    </CTable>
                                </CCol>
                            </CRow>


                            <!-- Add  Brand Modal -->
                            <CModal :visible="showModal" @close="() => { showModal = false }">
                                <CModalHeader>
                                    <CModalTitle>
                                        <h5 v-if="newBrand.Brand_ID">Edit Brand</h5>
                                        <h5 v-else>Add Brand</h5>
                                    </CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <input v-model="newBrand.Brand_Name" type="text" class="form-control"
                                        placeholder="Brand Name" />
                                </CModalBody>
                                <CModalFooter>
                                    <CButton color="secondary" @click="cancelBrand">
                                        Cancel
                                    </CButton>
                                    <CButton color="success" @click="addBrand"> {{ newBrand.Brand_ID ? 'Save Changes' :
                                        'Add Brand' }}</CButton>
                                </CModalFooter>
                            </CModal>
                            <!-- View Brand Modal -->
                            <CModal :visible="showViewModal" @close="showViewModal = false">
                                <CModalHeader>
                                    <CModalTitle>View Brand</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <p>{{ selectedBrand.Brand_Name }}</p>
                                </CModalBody>
                                <CModalFooter>
                                    <CButton color="secondary" @click="showViewModal = false">Close</CButton>
                                </CModalFooter>
                            </CModal>

                            <!-- Edit Brand Modal -->
                            <CModal :visible="showEditModal" @close="showEditModal = false">
                                <CModalHeader>
                                    <CModalTitle>Edit Brand</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <input v-model="selectedBrand.Brand_Name" type="text" class="form-control"
                                        placeholder="Brand Name" />
                                </CModalBody>
                                <CModalFooter>
                                    <CButton color="secondary" @click="showEditModal = false">Cancel</CButton>
                                    <CButton color="success" @click="saveEdit">Save Changes</CButton>
                                </CModalFooter>
                            </CModal>



                            <!-- Pagination buttons 
                            <CRow>
                                <div class="pagination">
                                  <CCol :sm="6">
                                        <button @click="prevPage" :disabled="currentPage === 1" class="btn m-2">
                                            <i class="fas fa-chevron-left"></i> Previous
                                        </button>
                                        <button @click="nextPage" :disabled="currentPage === totalPages"
                                            class="btn btn-dark">
                                            Next <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </CCol>
                                  
                                </div>
            
                            </CRow>
                            -->
                        </CCol>
                    </CRow>                
        </CCol>
    </CRow>
</template>
    
<script>
import axios from 'axios';
export default {
    data() {
        return {
            brands: [], // Array to store brand data from the backend
            showModal: false,
            showViewModal: false,
            showEditModal: false,
            selectedBrand: {
                Brand_ID: null,
                Brand_Name: "",
            },
            newBrand: {
                Brand_ID: null,
                Brand_Name: "",
            },
           
            searchTerm: "",
            brandsPerPage: 20,
            currentPage: 1,
        };
    },
    computed: {
        filteredBrands() {
            if (!this.searchTerm) {
                return this.brands;
            }
            const searchTermLowerCase = this.searchTerm.toLowerCase();
            return this.brands.filter((brand) =>
                brand.Brand_Name.toLowerCase().includes(searchTermLowerCase)
            );
        }
    },
    methods: {
        async fetchBrands() {
    try {
        const response = await axios.post(process.env.VUE_APP_ROOT_API + "/api/brands/fetch");
        console.log("Fetched data from backend:", response.data);
        this.brands = response.data;//.sort((a, b) => b.Brand_ID - a.Brand_ID);
        console.log("Fetched data of brands:", this.brands);
        this.selectedBrand = {}; // Clear selectedBrand object
        this.showViewModal = false;
        this.showEditModal = false;
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
},
async addBrand() {
    try {
      // Check if the brand name already exists in the brands array
      const existingBrand = this.brands.find(
        brand => brand.Brand_Name.toLowerCase() === this.newBrand.Brand_Name.toLowerCase()
      );

      if (existingBrand) {
        this.$toast.warning('Brand already exists');
        this.showModal = false;
        return;
      }

      const response = await axios.post(process.env.VUE_APP_ROOT_API + '/api/brands', {
        Brand_Name: this.newBrand.Brand_Name
      });

      if (response.status === 201) {
        this.fetchBrands();
        this.$toast.success('Brand added successfully');
        this.showModal = false;
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      this.$toast.error('An error occurred while adding the brand');
    }
  },

        openAddModal() {
            this.showModal = true;
            this.newBrand = {
                Brand_ID: null,
                Brand_Name: "",
                Created_By: localStorage.getItem('username')
            };
        },
        

        viewBrand(brand) {
            this.selectedBrand = { ...brand };
            this.showViewModal = true;
        },

        editBrand(brand) {
            console.log("Editing Brand:", brand);
            this.selectedBrand = { ...brand};
            this.selectedBrand.Brand_ID = brand.Brand_ID; 

            // Store the original brand name in a separate property
    this.selectedBrand.originalBrandName = brand.Brand_Name;

            this.showEditModal = true;
        },
       // async deleteBrand(brandId) {
         //   try {
           //     await axios.delete(process.env.VUE_APP_ROOT_API+`/api/brands/${brandId}`);
          //      this.fetchBrands();
         //   } catch (error) {
        //        console.error("Error deleting brand:", error);
          //  }
     //   },
     async deleteBrand(brandId) {
      try {
        await axios.delete(process.env.VUE_APP_ROOT_API + `/api/brands/${brandId}`);
        this.fetchBrands(); // Refresh the list of brands after deletion
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    },
    async restoreBrand(brandId) {
      try {
        await axios.put(process.env.VUE_APP_ROOT_API + `/api/brands/restore/${brandId}`);
        this.fetchBrands(); // Refresh the list of brands after restoration
      } catch (error) {
        console.error('Error restoring brand:', error);
      }
    },
    // saving the edited brand 
    async saveEdit() {
    console.log("Selected Brand ID:", this.selectedBrand.Brand_ID);
    try {


        console.log("Save Edit Method Called");

        // Check if the brand name already exists in the brands array
        const existingBrand = this.brands.find(
            brand => brand.Brand_Name.toLowerCase() === this.selectedBrand.Brand_Name.toLowerCase()
        );

        if (existingBrand) {
            this.$toast.warning('Brand already exists');
            this.showEditModal = false;
            return;
        }

        await axios.put(
            process.env.VUE_APP_ROOT_API + `/api/brands/${this.selectedBrand.Brand_ID}`,
            {
                Brand_Name: this.selectedBrand.Brand_Name
            }
        );
        console.log("Updating brand name in brand_master table...");

// Additional API call to update brand name in competition_tracking table
console.log("Updating brand name in competition_tracking table...");
await axios.put(
    process.env.VUE_APP_ROOT_API + `/api/updateCompetitionTrackingBrands`,
    {
        oldBrandName: this.selectedBrand.originalBrandName, 
        newBrandName: this.selectedBrand.Brand_Name
    }
);

console.log("Both brand names updated successfully.");






        this.fetchBrands();
        this.showEditModal = false;
    } catch (error) {
        console.error("Error saving brand:", error);
    }finally {
        // Reset the selectedBrand object after changes are made
        this.selectedBrand = {};
    }
},


    

       
        
        cancelBrand() {
            this.showModal = false;
            this.newBrand = {
                Brand_ID: null,
                Brand_Name: ""
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
    },
    mounted() {
        this.fetchBrands();
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
    background-color: #ff9800;
    /* Orange color */
    color: #fff;
}

.delete-btn {
    background-color: #e57373;
    color: #fff;
}

.add-btn {
    background-color: #64b5f6;
    color: #fff;
}

.add-bottom-btn {
    margin-top: 10px;
}</style>
    