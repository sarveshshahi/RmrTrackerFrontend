<template>
    <CRow>
        <CCol :md="12">
            <CRow>
                <CCol :sm="12">
                    <CRow class="mb-4">
                        <CCol :xs="6">
                            <CCol class="row">
                                <CCol :xs="6">
                                    <input v-model="searchTerm" class="form-control" type="text" placeholder="Search NetWeight" />
                                </CCol>
                                <CCol :xs="6">
                                    <p>Total: {{ filteredNetWts.length }}</p>
                                </CCol>
                            </CCol>
                        </CCol>
                        <CCol :xs="6">
                            <div class="add-btn-right">
                                <CButton color="btn btn-success primary" @click="openAddModal">Add New</CButton>
                            </div>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol :sm="12">
                            <CTable bordered class="table table-striped">
                                <CTableHead color="secondary">
                                    <CTableRow class="text-caption">
                                        <CTableHeaderCell>Brand</CTableHeaderCell>
                                        <CTableHeaderCell>Net Wt</CTableHeaderCell>
										<!-- <CTableHeaderCell>Active</CTableHeaderCell> -->
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody class="text-caption">
                                    <CTableRow v-for="item in filteredNetWts" :key="item.NetID">
                                        <CTableDataCell>{{ item.Brand }}</CTableDataCell>
										<CTableDataCell>{{ item.NetName }}</CTableDataCell>
                                        <!-- <CTableDataCell>{{ item.IsActive }}</CTableDataCell> -->
                                        <CTableDataCell>
                                            <span class="ms-2">
                                                <font-awesome-icon icon="eye" @click="viewNetWt(item)" title="View" />
                                            </span>
                                            <span class="ms-2">
                                                <font-awesome-icon icon="edit" @click="editNetWt(item)" title="Edit" />
                                            </span>
                                            <span v-if="item.IsActive" class="ms-2">
                                                <font-awesome-icon icon="trash" @click="deleteNetWt(item.NetID)" title="Delete" />
                                            </span>
                                            <span v-else class="ms-2">
                                                <font-awesome-icon icon="refresh" @click="restoreNetWt(item.NetID)" title="Restore" />
                                            </span>
                                        </CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </CCol>
                    </CRow>

                    <CModal :visible="showModal" @close="() => { showModal = false }">
                        <CModalHeader>
                            <CModalTitle>
                                <h5 v-if="newNetWtNetID">Edit Net Wt</h5>
                                <h5 v-else>Add Net Wt</h5>
                            </CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <!-- <label>Brand:</label> -->
                            <select v-model="selectedExistingBrand" class="form-control mb-4" @change="setSelectedBrand">
								<option disabled value="">Select Brand</option>
                                <option v-for="brand in existingBrands" :key="brand.Brand_ID" :value="brand.Brand_Name">
                                    {{ brand.Brand_Name }}
                                </option>
                            </select>
                            <input v-model="newNetWt.NetName" type="text" class="form-control mb-4" placeholder="Net Wt" />
							
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" @click="cancelNetWt">Cancel</CButton>
                            <CButton color="success" @click="addNetWt"> {{ newNetWt.NetID ? 'Save Changes' : 'Save' }}</CButton>
                        </CModalFooter>
                    </CModal>

                    <CModal :visible="showViewModal" @close="() => { showViewModal = false }">
                        <CModalHeader>
                            <CModalTitle>View Net Wt</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
							<div>
                                <label><strong>Brand:</strong></label>
                                <p>{{ selectedNetWt.Brand }}</p>
                            </div>
                            <div>
                                <label><strong>Net Wt:</strong></label>
                                <p>{{ selectedNetWt.NetName }}</p>
                            </div>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" @click="showViewModal = false">Close</CButton>
                        </CModalFooter>
                    </CModal>
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
            netWts: [],
            existingBrands: [],
            showModal: false,
            showViewModal: false,
            selectedNetWt: {
                NetID: null,
                NetName: "",
                Brand: "",
            },
            newNetWt: {
                NetID: null,
                NetName: "",
            },
            selectedExistingBrand: "",
            searchTerm: "",
        };
    },
    computed: {
        filteredNetWts() {
            if (!this.searchTerm) {
                return this.netWts;
            }
            const searchTermLowerCase = this.searchTerm.toLowerCase();
            return this.netWts.filter((item) =>
                item.NetName.toLowerCase().includes(searchTermLowerCase)
            );
        },
    },
    methods: {
        async fetchNetWts() {
            try {
                const response = await axios.get(process.env.VUE_APP_ROOT_API + "/api/netweightmaster/all");
                this.netWts = response.data;
            } catch (error) {
                console.error("Error fetching netWts:", error);
            }
        },
        async fetchBrands() {
            try {
                const response = await axios.post(process.env.VUE_APP_ROOT_API + "/api/brands/fetch");
                this.existingBrands = response.data.filter(x => x.Brand_ID != 99);
            } catch (error) {
                console.error("Error fetching existing brands:", error);
            }
        },
        async addNetWt() {
            try {
                const createdBy = "system";
                const modifiedBy = "system";

                // Find the BrandID based on the selected brand name
                const selectedBrand = this.existingBrands.find(brand => brand.Brand_Name === this.selectedExistingBrand);
                const brandID = selectedBrand ? selectedBrand.Brand_ID : null;

                let response;

                if (this.newNetWt.NetID) {
                    // Update brand
                    response = await axios.post(process.env.VUE_APP_ROOT_API + `/api/netweightmaster/${this.newNetWt.NetID}`, {
                        NetName: this.newNetWt.NetName,
                        Brand: this.selectedExistingBrand,
                        BrandID: brandID, // Include BrandID
                        ModifiedBy: modifiedBy,
                        IsActive: true,
                        IsClosed: false,
                        IsDeleted: false,
                    });
                    if (response.status === 200) {
                        this.$toast.success('Net Wt updated successfully');
                    }
                } else {
                    // Add new brand
                    response = await axios.post(process.env.VUE_APP_ROOT_API + '/api/netweightmaster', {
                        NetName: this.newNetWt.NetName,
                        Brand: this.selectedExistingBrand,
                        BrandID: brandID, // Include BrandID
                        CreatedBy: createdBy,
                        ModifiedBy: modifiedBy,
                        IsActive: true,
                        IsClosed: false,
                        IsDeleted: false,
                    });
                    if (response.status === 201) {
                        this.$toast.success('Net Wt added successfully');
                    }
                }

                this.fetchNetWts(); // Fetch updated netwt list
                this.showModal = false; // Close the modal
            } catch (error) {
                console.error('Error adding/updating netwt:', error);
                this.$toast.error('An error occurred while adding/updating the netwt: ' + (error.response?.data.message || error.message));
            }
        },
        openAddModal() {
            this.showModal = true;
            this.newNetWt = {
                NetID: null,
                NetName: "",
            };
            this.selectedExistingBrand = ""; // Reset selected existing brand
            this.fetchBrands();
        },
        setSelectedBrand() {
            if (!this.newNetWt.NetID) {
                const selectedBrand = this.existingBrands.find(brand => brand.Brand_Name === this.selectedExistingBrand);
                if (selectedBrand) {
                    this.newNetWt.NetName = ""; // Clear NetName when existing brand is selected only while adding a new brand
                }
            }
        },
        cancelNetWt() {
            this.showModal = false;
            this.newNetWt = {
                NetID: null,
                NetName: "",
            };
            this.selectedExistingBrand = ""; // Reset selected existing brand
        },
        viewNetWt(data) {
            this.selectedNetWt = { ...data };
            this.showViewModal = true;
        },
        async deleteNetWt(netID) {
            try {
                const response = await axios.delete(`${process.env.VUE_APP_ROOT_API}/api/netweightmaster/${netID}`);
                if (response.status === 200) {
                    this.$toast.success("Net Wt deleted successfully");
                    this.fetchNetWts(); // Refresh the brand list
                }
            } catch (error) {
                console.error("Error deleting Net Wt:", error);
            }
        },
        async restoreNetWt(netID) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/api/netweightmaster/restore/${netID}`);
                if (response.status === 200) {
                    this.$toast.success("Net Wt restored successfully");
                    this.fetchBrands(); // Refresh the brand list
                }
            } catch (error) {
                console.error("Error restoring Net Wt:", error);
            }
        },
        editNetWt(item) {
            console.log(item);
            this.newNetWt = { ...item };
            this.selectedExistingBrand = item.Brand;
            this.showModal = true;
            this.fetchBrands(); // Load existing brands
        },
    },
    mounted() {
        this.fetchNetWts();
    },
};
</script>


<style scoped>
.add-btn-right {
    display: flex;
    justify-content: flex-end;
}
</style>
