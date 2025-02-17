<script>
// import { CFormLabel } from "@coreui/vue";
import axios from "axios";

export default {
  data() {
    return {
      automailers: [],
      brands: [],
      selectedBrand: "",
      selectedFrequency: "",
      selectedDelivery: "",
      selectedTime: "",
      username: localStorage.getItem("username"),
      sendTo: "",
      cc: "",
      bcc: "",
      emailBody: "",
      selectedNextScheduledDate: "",
      newAutomailer: {},
      selectedAutomailer: {},

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
  computed: {},
  methods: {
    saveSelectedBrand(event) {
      console.log(event);
      // this.selectedBrand = event.target.value;
    },

    async fetchBrands() {
      try {
        var response = await axios.get(
          process.env.VUE_APP_ROOT_API + `/api/brandsname`
        );
        if (response.status == 200) {
          response = response.data;
          // console.log(response)
          response.forEach((element) => {
            this.brands.push(element.Brand_Name);
          });
        }
        // console.log(this.brands);
      } catch (error) {
        console.error(error);
      }
    },

    async fetchAutomailers() {
      this.automailers = [];
      try {
        var response = await axios.get(
          process.env.VUE_APP_ROOT_API + `/api/automailer`
        );
        if (response.status == 200) {
          this.automailers = response.data;
          // console.log(this.automailers);
        }
      } catch (error) {
        console.error(error);
      }
    },

    viewAutomailerDetails(automailer) {
      this.selectedAutomailer = { ...automailer };
      this.showViewModal = true;
    },

    editAutomailer(automailer) {
      this.selectedAutomailer = { ...automailer };
      this.showEditModal = true;
    },
    async saveEdit() {
      console.log(this.selectedAutomailer.MailTo);
      const id = this.selectedAutomailer.Id;
      try {
        this.newAutomailer = {
          brand:
            this.selectedBrand == ""
              ? this.selectedAutomailer.Brand
              : this.selectedBrand,
          frequency:
            this.selectedFrequency == ""
              ? this.selectedAutomailer.Frequency
              : this.selectedFrequency,
          delivery:
            this.selectedDelivery == ""
              ? this.selectedAutomailer.Delivery
              : this.selectedDelivery,
          deliveryTime:
            this.selectedTime == ""
              ? this.selectedAutomailer.DeliveryTime
              : this.selectedTime,
          nextScheduleDate:
            this.selectedNextScheduledDate == ""
              ? this.selectedAutomailer.NextScheduleDate
              : this.selectedNextScheduledDate.toString().split("T")[0],
          mailTo:
            this.sendTo == "" ? this.selectedAutomailer.MailTo : this.sendTo,
          cc: this.cc == "" ? this.selectedAutomailer.cc : this.cc,
          bcc: this.bcc == "" ? this.selectedAutomailer.bcc : this.bcc,
          body:
            this.emailBody == ""
              ? this.selectedAutomailer.body
              : this.emailBody,
          isActive: 1,
          moidifiedBy: this.username,
          modifiedDate: new Date().toISOString().slice(0, 19).split("T")[0],
        };
        console.log(this.newAutomailer);
        // Make sure selectedSKU.SKU_Type_ID is not null and has a valid value.
        if (this.newAutomailer != {}) {
          await axios.post(
            process.env.VUE_APP_ROOT_API + `/api/editautomailer/${id}`,
            this.newAutomailer
          );

          //console.log("Updated Automailers:", response.data);
          // Refresh the Automailers list after editing
          this.fetchAutomailers();

          // Close the edit modal
          this.showEditModal = false;
        }
      } catch (error) {
        console.error("Error updating Automailer:", error);
      }
    },
    async confirmDeleteSKUType(automailerId) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this Automailer?"
      );
      if (shouldDelete) {
        this.deleteAutomailer(automailerId);
      }
    },

    async deleteAutomailer(automailerId) {
      try {
        await axios.delete(
          process.env.VUE_APP_ROOT_API + `/api/automailer/${automailerId}`
        );
        this.fetchAutomailers(); // Refresh the Automailers list after deletion
      } catch (error) {
        console.error("Error deleting Automailers:", error);
      }
    },

    async saveAutomailer() {
      console.log(this.selectedTime);

      try {
        this.newAutomailer = {
          brand: this.selectedBrand,
          frequency: this.selectedFrequency,
          delivery: this.selectedDelivery,
          deliveryTime: this.selectedTime,
          nextScheduleDate: this.selectedNextScheduledDate
            .toString()
            .split("T")[0],
          mailTo: this.sendTo,
          cc: this.cc,
          bcc: this.bcc,
          body: this.emailBody,
          isActive: 1,
          createdBy: this.username,
          createdDate: new Date().toISOString().slice(0, 19).split("T")[0],
          moidifiedBy: this.username,
          modifiedDate: new Date().toISOString().slice(0, 19).split("T")[0],
        };

        console.log(this.newAutomailer);

        if (this.newAutomailer != {}) {
          await axios.post(
            process.env.VUE_APP_ROOT_API + `/api/automailer/`,
            this.newAutomailer
          );
        }
        this.fetchAutomailers(); // Refresh the SKU Type list after adding/editing
        this.showModal = false;
      } catch (error) {
        console.error("Error saving Automailer:", error);
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
    this.fetchBrands();
    this.fetchAutomailers();
  },
};
</script>

<template>
  <CRow>
    <CCol :sm="12">
      <CRow class="mb-4">
        <CCol :xs="6" class="">
          <div class="add-btn-right">
            <CButton
              color="btn btn-success primary"
              @click="
                () => {
                  showModal = true;
                }
              "
              >Add&nbsp;New&nbsp;Automailer&nbsp;</CButton
            >
          </div>
        </CCol>
      </CRow>
      <!-- Display list of Automailers -->

      <CTable bordered class="table table-striped">
        <CTableHead color="secondary">
          <CTableRow class="text-caption">
            <CTableHeaderCell class="col-1">S No.</CTableHeaderCell>
            <CTableHeaderCell class="col-2">Brand</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Frequency</CTableHeaderCell>
            <CTableHeaderCell class="col-3">To</CTableHeaderCell>
            <CTableHeaderCell class="col-3">CC</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Status</CTableHeaderCell>
            <CTableHeaderCell>Created By</CTableHeaderCell>
            <CTableHeaderCell>Created Date</CTableHeaderCell>
            <CTableHeaderCell>Edit</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody class="text-caption">
          <CTableRow
            v-for="(automailer, index) in automailers"
            :key="automailer.Id"
          >
            <CTableDataCell>{{ index + 1 }}</CTableDataCell>
            <CTableDataCell>{{ automailer.Brand }}</CTableDataCell>
            <CTableDataCell>{{ automailer.Frequency }}</CTableDataCell>
            <CTableDataCell>{{ automailer.MailTo }}</CTableDataCell>
            <CTableDataCell>{{ automailer.cc }}</CTableDataCell>
            <CTableDataCell>{{
              automailer.IsActive == 1 ? "Active" : "Inactive"
            }}</CTableDataCell>
            <CTableDataCell>{{ automailer.CreatedBy }}</CTableDataCell>
            <CTableDataCell>{{
              automailer.CreatedDate.toString().split("T")[0]
            }}</CTableDataCell>
            <!-- below is table editing cell -->
            <CTableDataCell>
              <span>
                <font-awesome-icon
                  icon="eye"
                  @click="viewAutomailerDetails(automailer)"
                  title="View"
                />
              </span>
              <span class="ms-2">
                <font-awesome-icon
                  icon="edit"
                  @click="editAutomailer(automailer)"
                  title="Edit"
                />
              </span>
              <span class="ms-2">
                <font-awesome-icon
                  icon="trash"
                  @click="confirmDeleteSKUType(automailer.Id)"
                  title="Delete"
                />
              </span>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      <!-- Add New Automailer -->

      <CModal
        :visible="showModal"
        @close="
          () => {
            showModal = false;
          }
        "
      >
        <CModalHeader>
          <CModalTitle> Add New Auto Mailer </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel class="">Brand</CFormLabel>
          <CFormSelect
            class="mb-2"
            size="md"
            :options="['select brand', ...brands]"
            @click="
              (event) => {
                this.selectedBrand = event.target.value;
                console.log(this.selectedBrand);
              }
            "
          >
          </CFormSelect>
          <CFormLabel class="mt-3">Delivery</CFormLabel>
          <CFormSelect
            class="mb-2"
            :options="[
              'select delivery',
              { label: 'same day', value: 'same day' },
              { label: 'next day', value: 'next day' },
            ]"
            @click="
              (event) => {
                this.selectedDelivery = event.target.value;
                console.log(this.selectedDelivery);
              }
            "
          >
          </CFormSelect>
          <CFormLabel class="mt-3">Frequency</CFormLabel>
          <CFormSelect
            class="mb-2"
            :options="['select frequency', { label: 'daily', value: 'Daily' }]"
            @click="
              (event) => {
                this.selectedFrequency = event.target.value;
                console.log(this.selectedFrequency);
              }
            "
          >
          </CFormSelect>

          <CInputGroup class="d-flex justify-content-between">
            <CFormLabel> Delivery Time </CFormLabel>
            <input
              class="time-border"
              v-model="selectedTime"
              type="time"
              @click="
                () => {
                  console.log(selectedTime);
                }
              "
            />
          </CInputGroup>
          <CInputGroup class="d-flex justify-content-between">
            <CFormLabel> Next Scheduled Delivery </CFormLabel>
            <input
              class="time-border"
              v-model="selectedNextScheduledDate"
              type="date"
              @click="
                () => {
                  console.log(selectedNextScheduledDate);
                }
              "
            />
          </CInputGroup>
          <CInputGroup>
            <CForm>
              <CFormInput
                class="mb-3"
                type="email"
                id="to"
                label="send to"
                placeholder="email address"
                v-model="sendTo"
              />
              <CFormInput
                class="mb-3"
                type="email"
                id="cc"
                label="CC"
                placeholder="email address"
                v-model="cc"
              />
              <CFormInput
                class="mb-3"
                type="email"
                id="bcc"
                label="BCC"
                placeholder="email address"
                v-model="bcc"
              />
              <CFormTextarea
                id="body"
                label="Body"
                v-model="emailBody"
              ></CFormTextarea>
            </CForm>
          </CInputGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="cancelSKUType"> Close </CButton>
          <CButton color="success" @click="saveAutomailer">Save</CButton>
        </CModalFooter>
      </CModal>

      <!-- View Automailer -->
      <CModal :visible="showViewModal" @close="showViewModal = false">
        <CModalHeader>
          <CModalTitle>View Automailer Details</CModalTitle>
        </CModalHeader>
        <CModalBody v-model="selectedAutomailer">
          <CTableRow> Brand: {{ selectedAutomailer.Brand }} </CTableRow>
          <CTableRow> Frequency: {{ selectedAutomailer.Frequency }} </CTableRow>
          <CTableRow> Delivery: {{ selectedAutomailer.Delivery }} </CTableRow>
          <CTableRow>
            Delivery Time: {{ selectedAutomailer.DeliveryTime }}
          </CTableRow>
          <CTableRow>
            Next Schedule Date:
            {{ selectedAutomailer.NextScheduleDate.toString().split("T")[0] }}
          </CTableRow>

          <CTableRow> To: {{ selectedAutomailer.MailTo }} </CTableRow>
          <CTableRow> CC: {{ selectedAutomailer.cc }} </CTableRow>
          <CTableRow> BCC: {{ selectedAutomailer.bcc }} </CTableRow>
          <CTableRow>
            Email Content:
            <p>{{ selectedAutomailer.body }}</p>
          </CTableRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="showViewModal = false"
            >Close</CButton
          >
        </CModalFooter>
      </CModal>

      <!-- Edit Automailer Modal -->
      <CModal :visible="showEditModal" @close="showEditModal = false">
        <CModalHeader>
          <CModalTitle>Edit Automailer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel class="">Brand</CFormLabel>
          <CFormSelect
            class="mb-2"
            size="md"
            :options="['select brand', ...brands]"
            @click="
              (event) => {
                this.selectedBrand = event.target.value;
                console.log(this.selectedBrand);
              }
            "
          >
          </CFormSelect>
          <CFormLabel class="mt-3">Delivery</CFormLabel>
          <CFormSelect
            class="mb-2"
            :options="[
              'select delivery',
              { label: 'same day', value: 'same day' },
              { label: 'next day', value: 'next day' },
            ]"
            @click="
              (event) => {
                this.selectedDelivery = event.target.value;
                console.log(this.selectedDelivery);
              }
            "
          >
          </CFormSelect>
          <CFormLabel class="mt-3">Frequency</CFormLabel>
          <CFormSelect
            class="mb-2"
            :options="['select frequency', { label: 'daily', value: 'Daily' }]"
            @click="
              (event) => {
                this.selectedFrequency = event.target.value;
                console.log(this.selectedFrequency);
              }
            "
          >
          </CFormSelect>
          <CInputGroup class="d-flex justify-content-between">
            <CFormLabel> Delivery Time </CFormLabel>
            <input
              class="time-border"
              v-model="selectedTime"
              type="time"
              @click="
                () => {
                  console.log(selectedTime);
                }
              "
            />
          </CInputGroup>
          <CInputGroup class="d-flex justify-content-between">
            <CFormLabel> Next Scheduled Delivery </CFormLabel>
            <input
              class="time-border"
              v-model="selectedNextScheduledDate"
              type="date"
              @click="
                () => {
                  console.log(selectedNextScheduledDate);
                }
              "
            />
          </CInputGroup>
          <CInputGroup>
            <CForm>
              <CFormInput
                class="mb-3"
                type="email"
                id="to"
                label="send to"
                placeholder="email address"
                v-model="sendTo"
              />
              <CFormInput
                class="mb-3"
                type="email"
                id="cc"
                label="CC"
                placeholder="email address"
                v-model="cc"
              />
              <CFormInput
                class="mb-3"
                type="email"
                id="bcc"
                label="BCC"
                placeholder="email address"
                v-model="bcc"
              />
              <CFormTextarea
                id="body"
                label="Body"
                v-model="emailBody"
              ></CFormTextarea>
            </CForm>
          </CInputGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="showEditModal = false"
            >Cancel</CButton
          >
          <CButton color="success" @click="saveEdit">Save Changes</CButton>
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

<style>
.time-border {
  /* background-color: red; */
  padding-left: 30%;
  border: 1px solid #88e763;
  border-radius: 7px;
}
</style>
