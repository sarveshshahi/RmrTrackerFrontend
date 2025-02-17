<template>
  <CRow>
    <CCol :sm="12">
      <CRow class="mb-4">
        <CCol :xs="6">
          <CCol class="row">
            <CCol :xs="6">
              <!-- Search input field -->
              <input v-model="searchTerm" type="text" class="form-control" placeholder="Search" />
            </CCol>
            <CCol :xs="6">
              <p>Total: {{ filteredAutomailer.length }}</p>
            </CCol>
          </CCol>
        </CCol>
        <CCol :xs="6" class="">
          <div class="add-btn-right">
            <CButton color="btn btn-success primary" @click="() => {
                showModal = true;
                isEditing = false;
              }
              ">Add&nbsp;New&nbsp;Automailer&nbsp;</CButton>
          </div>
        </CCol>
      </CRow>
      <!-- Display list of Automailers -->

      <CTable bordered class="table table-responsive">
        <CTableHead color="secondary">
          <CTableRow class="text-caption">
            <CTableHeaderCell class="col-1">S No.</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Action</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Type</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Subject</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Frequency</CTableHeaderCell>
            <CTableHeaderCell class="col-1">Delivery</CTableHeaderCell>
            <CTableHeaderCell class="col-2">To</CTableHeaderCell>
            <CTableHeaderCell class="col-2">CC</CTableHeaderCell>
            
            <CTableHeaderCell class="col-2">Last edited</CTableHeaderCell>
            <CTableHeaderCell class="col-2">Brand</CTableHeaderCell>



            <!-- <CTableHeaderCell class="col-1">Delivery</CTableHeaderCell> -->

            <CTableHeaderCell class="col-1">Created Date</CTableHeaderCell>

          </CTableRow>
        </CTableHead>
        <CTableBody class="text-caption">
          <CTableRow v-for="(automailer, index) in filteredAutomailer" :key="automailer.Id">
            <CTableDataCell class="col-1">{{ index + 1 }}</CTableDataCell>
            <CTableDataCell class="col-1">
              <span class="ms-2">
                <font-awesome-icon icon="edit" @click="() => {
                    isEditing = true;
                    editAutomailer(automailer);
                  }
                  " title="Edit" />
              </span>
              <span class="ms-2">
                <font-awesome-icon icon="trash" @click="confirmDeleteSKUType(automailer.Id)" title="Delete" />
              </span>
            </CTableDataCell>
            <CTableDataCell class="col-1">{{ automailer.Type }}</CTableDataCell>
            <CTableDataCell class="col-1">{{ automailer.Subject }}</CTableDataCell>
            <CTableDataCell class="col-1">{{ automailer.Frequency }}</CTableDataCell>
            <CTableDataCell class="col-1">{{ automailer.Delivery }}</CTableDataCell>
            <CTableDataCell class="col-2 long-text-wrap">{{ automailer.MailTo }}</CTableDataCell>
            <CTableDataCell class="col-2 long-text-wrap">{{ automailer.cc }}</CTableDataCell>
            <CTableDataCell class="col-1">{{ automailer.ModifiedDate.toString().split("T")[0]}}</CTableDataCell>
            
            

            <CTableDataCell class="col-2">{{
              JSON.parse(automailer.Brand).join(",")
            }}</CTableDataCell>

            
            
            <CTableDataCell class="col-1">{{
              automailer.CreatedDate.toString().split("T")[0]
            }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>

      <!-- Add New Automailer -->

      <CModal backdrop="static" :visible="showModal" @close="
        this.modalTitle = 'Add a New Automailer';
      clearNewAutomailer();
      showModal = false;
      ">
        <CModalHeader>
          <CModalTitle> {{ this.modalTitle }} </CModalTitle>
        </CModalHeader>
        <form @submit.prevent="saveAutomailer" class="competition-form">
          <CModalBody>
            <CFormLabel class="">Brands<span style="color: red">*</span></CFormLabel>
            <!-- v-model="multiSelectBrands" -->
            <VueMultiselect v-model="newAutomailer.Brand" :options="brands" :multiple="true" :hide-selected="true"
              required placeholder="Select Brands" :taggable="false" @tag="addTag">
            </VueMultiselect>
            <CFormLabel class="mt-3">Type<span style="color: red">*</span></CFormLabel>
            <CFormSelect v-model="newAutomailer.Type" class="mb-2" :options="['Select Type',
              { label: 'Retailer', value: 'Retailer' },
              { label: 'Wholesaler', value: 'Wholesaler' },
              { label: 'PKD', value: 'PKD' }
            ]" @click="(event) => {
          newAutomailer.Type = event.target.value;
          console.log(newAutomailer.Type);
        }
        ">

            </CFormSelect>

                        <!-- Conditionally render the checkbox -->
			<CFormCheck
              v-if="isInlineApplicable"
              class="mt-3"
              id="flexCheckDefault"
              label="Report Inline"
              v-model="newAutomailer.Report_Inline"
            />
            <!-- console.log(newAutomailer.Report_Inline);
              {{ newAutomailer.Report_Inline }} -->
<CFormLabel class="mt-3">Subject<span style="color: red">*</span></CFormLabel>
            <CFormInput type="text" class="mb-3" v-model="newAutomailer.Subject" placeholder="Enter Subject Name"
              required />

            <CFormLabel class="mt-3">Frequency<span style="color: red">*</span></CFormLabel>
            <CFormSelect v-model="newAutomailer.Frequency" class="mb-2" :options="['Select Frequency',
              { label: 'Daily', value: 'Daily' },
              { label: 'Weekly', value: 'Weekly' },
              { label: 'Monthly', value: 'Monthly' }
            ]" @click="(event) => {
          newAutomailer.Frequency = event.target.value;
          console.log(newAutomailer.Frequency);
        }
        ">
            </CFormSelect>


            <CFormLabel class="mt-3">Delivery<span style="color: red">*</span></CFormLabel>
            <CFormSelect v-model="newAutomailer.Delivery" class="mb-2 readonly" :options="[
              'Select Delivery',
              { label: 'Same Day', value: 'Same Day' },
              { label: 'Next Day', value: 'Next Day' },
            ]" @click="(event) => {
                newAutomailer.Delivery = event.target.value;
                console.log(newAutomailer.Delivery);
              }
              ">
            </CFormSelect>
            <CFormLabel class="mt-3">Start Date<span style="color: red"></span></CFormLabel>
            <CFormInput type="date" class="mb-3" v-model="newAutomailer.StartDate" @click="() => {
                console.log(newAutomailer.StartDate);
              }
              " />
            <CFormLabel class="mt-3">End Date<span style="color: red"></span></CFormLabel>
            <CFormInput type="date" class="mb-3" v-model="newAutomailer.EndDate" @click="() => {
                console.log(newAutomailer.EndDate);
              }
              " />
            <CFormLabel class="mt-3">Delivery Time<span style="color: red">*</span></CFormLabel>
            <CFormInput type="time" class="mb-3" required placeholder="HH:mm:ss" v-model="newAutomailer.DeliveryTime"
              @click="() => {
                  console.log(newAutomailer);
                }
                " />
            <CFormLabel class="mt-3">Next Delivery Date<span style="color: red">*</span></CFormLabel>
            <CFormInput type="date" class="mb-3" required v-model="newAutomailer.NextScheduleDate" @click="() => {
                console.log(newAutomailer.NextScheduleDate);
              }
              " />
            <CFormLabel class="mt-3">Send To<span style="color: red">*</span></CFormLabel>
            <CFormInput maxlength="2000" class="mb-3" type="email" multiple id="to" required placeholder="Email address"
              v-model="newAutomailer.MailTo" />
            <CFormInput maxlength="1000" class="mb-3" type="email" id="cc" label="CC" placeholder="Email address"
              v-model="newAutomailer.cc" multiple />
            <CFormInput maxlength="1000" class="mb-3" type="email" id="bcc" label="BCC" placeholder="Email address"
              v-model="newAutomailer.bcc" multiple />
            <CFormTextarea maxlength="2000" id="body" label="Body" rows="6" v-model="newAutomailer.body"></CFormTextarea>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" @click="cancelMe"> Close </CButton>
            <CButton type="submit" color="success">Save</CButton>
          </CModalFooter>
        </form>
      </CModal>
    </CCol>
  </CRow>
</template>
<script>
// import { CFormLabel } from "@coreui/vue";
import axios from "axios";
import VueMultiselect from "vue-multiselect";

export default {
  components: {
    VueMultiselect,
  },
  data() {
    return {
      automailers: [],
      brands: [],
      multiSelectBrands: [],
      selectedBrand: "",
      selectedFrequency: "",
      selectedDelivery: "",
      selectedTime: "",
      mailTo: "",
      cc: "",
      bcc: "",
      emailBody: "",
      selectedNextScheduledDate: "",
      username: localStorage.getItem("username"),
      newAutomailer: {
        Brand: [],
        Type: "Retailer",
        Frequency: "Daily",
        Delivery: "Next Day",
        DeliveryTime: "",
        NextScheduleDate: "",
        Subject: "",
        //StartDate:"",
        //EndDate:"",
        MailTo: "",
        cc: "",
        bcc: "",
        body: "",
		Report_Inline: 0,
      },
      selectedAutomailer: {},
      showModal: false,
      showViewModal: false,
      searchTerm: "",
      modalTitle: "Add a New Automailer",
      isEditing: true,
    };
  },
  computed: {
    filteredAutomailer() {
      if (!this.searchTerm) {
        return this.automailers;
      }
      const searchTermL = this.searchTerm.toLowerCase();
      return this.automailers.filter(
        (e) =>
          e.Brand.toLowerCase().includes(searchTermL) ||
          e.MailTo.toLowerCase().includes(searchTermL)
      );
    },
    isInlineApplicable() {
      return this.newAutomailer.Type != "PKD";
    },
  },

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
        var response = await axios.post(
          process.env.VUE_APP_ROOT_API + `/api/automailer/fetch`
        );
        if (response.status == 200) {
          this.automailers = response.data;
          console.log(response.data)

        }
      } catch (error) {
        console.error(error);
      }
    },

    viewAutomailerDetails(automailer) {
      this.selectedAutomailer = { ...automailer };
      this.showViewModal = true;
    },

    getformattedDate(date) {
      var formattedDate = undefined;
      if (date) {
        try {
          formattedDate = new Date(date);
          formattedDate.setDate(formattedDate.getDate() + 1);
          formattedDate = formattedDate.toISOString().split("T")[0];
        } catch (e) {
          //text
        }
      }
      return formattedDate;
    },
    editAutomailer(automailer) {
      console.log(automailer);
      this.newAutomailer = {
        ...automailer,
        NextScheduleDate: this.getformattedDate(automailer.NextScheduleDate),
        Brand: [...JSON.parse(automailer.Brand)],
        Report_Inline: Number(automailer.Report_Inline) === 1,
      };
      console.log("Report_Inline:", this.newAutomailer.Report_Inline);
      var strStartDate = this.getformattedDate(automailer.StartDate);
      if (strStartDate) {
        this.newAutomailer.StartDate = strStartDate;
      } else {
        delete this.newAutomailer.StartDate;
      }
      var strEndDate = this.getformattedDate(automailer.EndDate);
      if (strEndDate) {
        this.newAutomailer.EndDate = strEndDate;
      } else {
        delete this.newAutomailer.EndDate;
      }
      console.log(automailer);
      this.modalTitle = "Edit Automailer";
      this.showModal = true;
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

    clearNewAutomailer() {
      console.log("inside clearNewAutomailer");
      // this.newAutomailer = {};
      this.newAutomailer = {
        Brand: [],
        Type: "Retailer",
        Frequency: "Daily",
        Delivery: "Next Day",
        DeliveryTime: "",
        NextScheduleDate: "",
        //StartDate:"",
        //EndDate:"",
        MailTo: "",
        cc: "",
        bcc: "",
        body: "",
      };
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.brands.push(tag);
      this.newAutomailer.Brand.push(tag);
    },
    // filterBrands(brands) {},
    async saveAutomailer() {
      if (this.newAutomailer.Brand.length == 0) {
        alert("Brand is mandatory to select");
        return;
      }
      console.log(this.selectedTime);
      //debugger;	
      // if in editing mode it will update the automailer
      if (this.isEditing) {
        console.log("in editing mode");
        try {
          this.newAutomailer = {
            ...this.newAutomailer,
            Brand: JSON.stringify(this.newAutomailer.Brand),
            Report_Inline: this.newAutomailer.Report_Inline ? 1 : 0, // Convert boolean to integer
            isActive: 1,
            moidifiedBy: this.username,
            modifiedDate: new Date().toISOString().slice(0, 19).split("T")[0],
          };

          const id = this.newAutomailer.Id;

          if (this.newAutomailer != {}) {
            await axios.post(
              process.env.VUE_APP_ROOT_API + `/api/editautomailer/${id}`,
              this.newAutomailer
            );
            this.clearNewAutomailer();
          }
          this.fetchAutomailers(); // Refresh the Automailer Type list after adding/editing
          this.showModal = false;
          this.modalTitle = "Add a New Automailer";
        } catch (error) {
          console.error("Error saving Automailer:", error);
          this.modalTitle = "Add a New Automailer";
        }
        this.clearNewAutomailer();
      }
      // if not in editing mode it will add a new automailer
      else {
        console.log(`In creation Mode: ${this.newAutomailer.toString()}`);
        try {
          this.newAutomailer = {
            ...this.newAutomailer,
            Brand: JSON.stringify(this.newAutomailer.Brand),
            Report_Inline: this.newAutomailer.Report_Inline ? 1 : 0, // Convert boolean to integer
            nextScheduleDate: this.newAutomailer.nextScheduleDate,
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
            this.clearNewAutomailer();
          }
          this.fetchAutomailers(); // Refresh the SKU Type list after adding/editing
          this.showModal = false;
          this.modalTitle = "Add a New Automailer";
          this.clearNewAutomailer();
        } catch (error) {
          console.error("Error saving Automailer:", error);
          this.modalTitle = "Add a New Automailer";
        }
      }

      this.modalTitle = "Add a New Automailer";
      this.clearNewAutomailer();
    },
    cancelMe() {
      this.showModal = false;
      this.modalTitle = "Add a New Automailer";
      this.clearNewAutomailer();
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.time-border {
  /* background-color: red; */
  padding-left: 30%;
  border: 1px solid #88e763;
  border-radius: 7px;
}

.long-text-wrap {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
