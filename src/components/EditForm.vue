<template>
  <form @submit.prevent="saveEditedForm" class="competition-form">
    <CModal
      :visible="showEditModal"
      @close="showEditModal = false"
      class="edit-form-modal"
    >
      <CModalHeader>
        <CModalTitle>Edit Form</CModalTitle>
      </CModalHeader>

      <CModalBody class="bg">
        <CRow>
          <CCol md="3">
            <CFormLabel for="date"
              >Market Visit Date:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormInput
              type="date"
              class="form-control"
              v-model="editedForm.date"
              @change="updateDate"
              required
            >
            </CFormInput>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="state"
              >Select State:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <select
              v-model="editedForm.state"
              class="form-select"
              @change="onStateChange"
            >
              <option disabled value="">State</option>
              <option
                v-for="state in states"
                :key="state.State_ID"
                :value="state.State_ID"
              >
                {{ state.State_Name }}
              </option>
            </select>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="district"
              >Select District:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <select
              v-model="editedForm.district"
              class="form-select"
              @change="onDistrictChange"
            >
              <option disabled value="">District</option>
              <option
                v-for="district in districts"
                :key="district.District_ID"
                :value="district.District_ID"
              >
                {{ district.District_Name }}
              </option>
            </select>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="town"
              >Select Town:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <select v-model="editedForm.town" class="form-select">
              <option disabled value="">Town</option>
              <option
                v-for="town in towns"
                :key="town.Town_ID"
                :value="town.Town_ID"
              >
                {{ town.Town_Name }}
              </option>
            </select>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="brand-name"
              >Brand Name:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol :xs="6">
            <select
              v-model="editedForm.Brand_Name"
              @change="onBrandChange"
              class="form-select"
            >
              <option disabled value="">Brand</option>
              <option v-for="brand in brands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </CCol>
          <CCol :xs="3">
            <button @click="addBrand" class="btn btn-success">
              Add
            </button>
          </CCol>
        </CRow>

        <CRow class="mt-3">
          <CCol md="3">
            <CFormLabel for="sku"
              >SKU:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <select
              v-model="editedForm.sku"
              @change="onSKUChange"
              class="form-select"
            >
              <option disabled value="">SKU</option>
              <option v-for="sku in skus" :key="sku" :value="sku">
                {{ sku }}
              </option>
            </select>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="net-weight"
              >Net. Wt. (g):<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.net_weight"
              required
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
            >
            </CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="mrp"
              >MRP (₹):<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.mrp"
              required
              oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
            >
            </CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="pkd-date"
              >PKD (MM/yyyy):<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol :xs="6" md="4">
            <select v-model="editedForm.pkd_month" class="form-select">
              <option value="" disabled>Month</option>
              <option v-for="month in months" :value="month" :key="month">
                {{ month }}
              </option>
            </select>
          </CCol>
          <CCol :xs="6" md="5">
            <select v-model="editedForm.pkd_year" class="form-select">
              <option value="" disabled>Year</option>
              <option v-for="year in years" :value="year" :key="year">
                {{ year }}
              </option>
            </select>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="effective-consumer-price"
              >Effective Consumer Price (₹):<span style="color: red">*</span>
            </CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.consumer_price"
              required
              pattern="^-?\d+(\.\d*)?$"
              @input="handleNumericInput"
            ></CFormInput>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="units-in-ic"
              >Units in IC:<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.units_in_ic"
              required
              pattern="^-?\d+(\.\d{1,2})?$"
              @input="handleNumericInput"
            ></CFormInput>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="ic-rlp"
              >IC RLP (₹):<span style="color: red">*</span></CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.ic_rlp"
              required
              pattern="^-?\d+(\.\d{1,2})?$"
              @input="handleNumericInput"
            ></CFormInput>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="retail-scheme">Retail Scheme:</CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.retail_scheme"
            ></CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="wholesale-scheme">Wholesale Scheme:</CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.wholesale_scheme"
            ></CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="additionalInfo1"
              >Additional info 1 (Market Observations and Feedback):
            </CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormTextarea
              class="form-control"
              v-model="editedForm.additional_info_1"
            ></CFormTextarea>
          </CCol>
        </CRow>
        <CRow class="mt-3">
          <CCol md="3">
            <CFormLabel for="additionalInfo2">Additional info 2:</CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormInput
              type="text"
              class="form-control"
              v-model="editedForm.additional_info_2"
            ></CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="image">Add Images:</CFormLabel>
          </CCol>
          <CCol md="9">
            <CFormInput
              type="file"
              @change="addImageField"
              class="form-control-file"
              multiple
            ></CFormInput>
            <p class="text-muted mt-1">You can upload up to 5 images.</p>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="6"></CCol>
          <CCol md="6">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="form-group"
            >
              <img :src="image" height="80" width="80" /><br />
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </div>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol :xs="12" md="4" class="mt-2" v-if="editedForm.image1_url">
            <CCard>
              <CCardImage
                orientation="top"
                class="img"
                :src="getImageUrl(editedForm.image1_url)"
                alt="Image 1"
              />
              <CCardBody>
                <CCardTitle>Image 1 </CCardTitle>
              </CCardBody>
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </CCard>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="editedForm.image2_url">
            <CCard>
              <CCardImage
                orientation="top"
                class="img"
                :src="getImageUrl(editedForm.image2_url)"
                alt="Image 2"
              />
              <CCardBody>
                <CCardTitle>Image 2 </CCardTitle>
              </CCardBody>
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </CCard>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="editedForm.image3_url">
            <CCard>
              <CCardImage
                orientation="top"
                class="img"
                :src="getImageUrl(editedForm.image3_url)"
                alt="Image 3"
              />
              <CCardBody>
                <CCardTitle>Image 3 </CCardTitle>
              </CCardBody>
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol :xs="12" md="4" class="mt-2" v-if="editedForm.image4_url">
            <CCard>
              <CCardImage
                orientation="top"
                class="img"
                :src="getImageUrl(editedForm.image4_url)"
                alt="Image 4"
              />
              <CCardBody>
                <CCardTitle>Image 4 </CCardTitle>
              </CCardBody>
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </CCard>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="editedForm.image5_url">
            <CCard>
              <CCardImage
                orientation="top"
                class="img"
                :src="getImageUrl(editedForm.image5_url)"
                alt="Image 5"
              />
              <CCardBody>
                <CCardTitle>Image 5 </CCardTitle>
              </CCardBody>
              <CButton @click="removeImageField(index)" class="btn btn-dark"
                >Remove</CButton
              >
            </CCard>
          </CCol>
        </CRow>

        <CRow class="mt-2">
          <CCol md="3">
            <CFormLabel for="geolocation"
              >Capture Geotagged Location:</CFormLabel
            >
          </CCol>
          <CCol md="9">
            <CFormCheck
              type="checkbox"
              v-model="enableGeolocation"
            ></CFormCheck>
          </CCol>
        </CRow>

        <div v-if="enableGeolocation">
          <CRow class="mt-2">
            <CCol md="3">
              <CFormLabel>Latitude:</CFormLabel>
            </CCol>
            <CCol md="9">
              <CFormInput
                type="text"
                class="form-control"
                v-model="editedForm.latitude"
              ></CFormInput>
            </CCol>
          </CRow>
          <CRow class="mt-2">
            <CCol md="3">
              <CFormLabel>Longitude:</CFormLabel>
            </CCol>
            <CCol md="9">
              <CFormInput
                type="text"
                class="form-control"
                v-model="editedForm.longitude"
              ></CFormInput>
            </CCol>
          </CRow>
        </div>
      </CModalBody>
      <CModalFooter>
        <CCol xs="12" class="mt-3" align="center">
          <CButton type="submit" class="btn btn-success">Update</CButton>
        </CCol>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </CModalFooter>
    </CModal>
  </form>
</template>

<script>
import { CFormTextarea } from "@coreui/vue";
import axios from "axios";
import Datex from "../utils/common.js";
export default {
  components: {
    CFormTextarea,
  },
  props: ["formId"],
  data() {
    return {
      enableGeolocation: true,
      selectedState: "",
      selectedDistrict: "",
      selectedTown: "",
      successMessage: null,
      editedForm: {
        date: "",
        state: "",

        Brand_name: "",
        sku: "",
        net_weight: "",
        mrp: "",
        pkd_date: "",
        pkd_month: "",
        pkd_year: "",
        consumer_price: "",
        units_in_ic: "",
        ic_rlp: "",
        retail_scheme: "",
        wholesale_scheme: "",
        additional_info_1: "",
        additional_info_2: "",
        latitude: "",
        longitude: "",
        image1_url: "",
        image2_url: "",
        image3_url: "",
        image4_url: "",
        image5_url: "",
      },
      selectedImages: [],
      selectedYear: null,
      selectedMonth: null,

      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      years: [],
      brands: [],
      skus: [],
      selectedBrand: "",
      selectedSKU: "",
      states: [],
      districts: [],
      towns: [],

      submissionTimestamp: null,
    };
  },
  mounted() {
    this.generateYearOptions();
    this.fetchStates();
    this.fetchBrands();
    this.fetchSkus();
    this.username = localStorage.getItem("username");

    console.log("Mounted with formId:", this.formId);
    if (this.formId) {
      this.fetchFormData(this.formId);
    }

    if (this.editedForm.pkd_date) {
      const [year, month] = this.editedForm.pkd_date.split("-");
      console.log("Year:", year);
      console.log("Month:", month);
      this.selectedYear = parseInt(year);
      this.selectedMonth = parseInt(month);
    }
  },
  watch: {
    formId: {
      handler: function (newFormId) {
        console.log("formId changed:", newFormId);
        this.fetchFormData(newFormId);
      },
      deep: true,
      immediate: true,
    },
    successMessage: {
      handler(newMessage) {
        if (newMessage) {
          this.closeEditModal();
        }
      },
      immediate: true,
    },
  },
  computed: {
    combinedPKDDate() {
      if (this.selectedMonth && this.selectedYear) {
        return `${this.selectedYear}-${this.selectedMonth
          .toString()
          .padStart(2, "0")}-01`;
      }
      return null;
    },
  },
  methods: {
   
    getImageUrl(imageUrl) {
      return process.env.VUE_APP_ROOT_API + `${imageUrl}`;
    },

    async fetchFormData(formId) {
      if (formId) {
        try {
          const response = await axios.get(
            process.env.VUE_APP_ROOT_API + `/api/forms/${formId}`
          );
          console.log("API Response:", response.data);

          this.editedForm = response.data;
          var d = new Date(response.data.date)
          this.editedForm.date = Datex.formattedDate((new Date(d.getTime()+(-d.getTimezoneOffset())*60*1000)),"yyyy-MM-DD");
          console.log(this.editedForm.date);
          this.editedForm.latitude = response.data.latitude;
          this.editedForm.longitude = response.data.longitude;

          this.fetchDistricts();
          this.fetchTowns();

          console.log("Edited Form Data:", this.editedForm);
        } catch (error) {
          console.error("Error fetching form data:", error);
        }
      }
    },
    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 2000; year--) {
        this.years.push(year);
      }
    },
    fetchStates() {
      axios
        .get(process.env.VUE_APP_ROOT_API + "/api/states")
        .then((response) => {
          this.states = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchDistricts() {
      axios
        .get(
          process.env.VUE_APP_ROOT_API +
            `/api/districts?state=${this.editedForm.state}`
        )
        .then((response) => {
          this.districts = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchTowns() {
      axios
        .get(
          process.env.VUE_APP_ROOT_API +
            `/api/towns?district=${this.editedForm.district}`
        )
        .then((response) => {
          this.towns = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    onStateChange() {
      this.selectedDistrict = null;
      this.selectedTown = null;
      this.fetchDistricts();
    },

    onDistrictChange() {
      this.selectedTown = null;
      this.fetchTowns();
    },
    fetchBrands() {
      axios
        .get(process.env.VUE_APP_ROOT_API + "/api/brandsname")
        .then((response) => {
          this.brands = response.data.map((brand) => brand.Brand_Name);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },

    fetchSkus() {
      axios
        .get(process.env.VUE_APP_ROOT_API + "/api/skus")
        .then((response) => {
          this.skus = response.data.map((sku) => sku.SKU_Type_Name);
        })
        .catch((error) => {
          console.error("Error fetching SKUs:", error);
        });
    },
    addBrand() {
      const newBrand = prompt("Add Brand Name");
      if (newBrand && newBrand.trim() !== "") {
        if (!this.brands.includes(newBrand)) {
          // Make an API call to add the new brand to the database
          axios
            .post(process.env.VUE_APP_ROOT_API + "/api/add-brand", {
              brandName: newBrand,
            })
            .then((response) => {
              if (response.data.success) {
                // Update the frontend brands array and selectedBrand
                this.brands.push(newBrand);
                this.selectedBrand = newBrand;
                this.$toast.success("Brand added successfully!");
              } else {
                this.$toast.error("Failed to add brand. Please try again.");
              }
            })
            .catch((error) => {
              console.error("Error adding brand:", error);
              this.$toast.error("An error occurred while adding the brand.");
            });
        } else {
          this.$toast.error("Brand already exists.");
        }
      }
    },
   
    async addImageField(event) {
      const files = Array.from(event.target.files);
      const remainingImageSlots = 5 - this.selectedImages.length; // Calculate the number of available image slots

      for (let i = 0; i < Math.min(remainingImageSlots, files.length); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await axios.post(
            process.env.VUE_APP_ROOT_API + "/api/upload-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageUrl = {
            src: process.env.VUE_APP_ROOT_API + response.data.imageUrl,
            imageUrl: response.data.imageUrl,
          };
          this.selectedImages.push(imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    },

    updateDate(event) {
      this.date = event.target.value;
      console.log(this.date);
    },

    async saveEditedForm() {
      const now = new Date();
      const serverTimestamp = now.toISOString();
      const submissionTimestamp = new Date(serverTimestamp);
      submissionTimestamp.setHours(submissionTimestamp.getHours() + 5);
      submissionTimestamp.setMinutes(submissionTimestamp.getMinutes() + 30);

      const formattedSubmissionTimestamp = submissionTimestamp
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      this.formattedSubmissionTimestamp = formattedSubmissionTimestamp;
      this.submissionTimestamp = formattedSubmissionTimestamp;
      this.editedForm.submission_timestamp = this.submissionTimestamp;

      const selectedPKDDate = new Date(this.combinedPKDDate);
      if (selectedPKDDate > now) {
        alert("PKD date cannot be greater than the current date.");
        return;
      }

      const selectedGeneralDate = new Date(this.date);
      if (selectedGeneralDate > now) {
        alert("Market Visit date cannot be greater than the current date.");
        return;
      }

      try {
        await axios.put(
          process.env.VUE_APP_ROOT_API + `/api/forms/${this.editedForm.id}`,
          this.editedForm
        );

        const editedData = {
          date: this.editedForm.date,
          state: this.editedForm.state,
          submission_timestamp: this.editedForm.submission_timestamp,
          longitude: this.editedForm.longitude,
          image1_url: this.editedForm.image1_url,
          image2_url: this.editedForm.image2_url,
          image3_url: this.editedForm.image3_url,
          image4_url: this.editedForm.image4_url,
          image5_url: this.editedForm.image5_url,
        };

        console.log("Edited Data:", editedData);

        this.$toast.success("Form updated successfully!");

        this.closeEditModal();
        // Navigate to user dashboard
        this.$router.push("/user/dashboard");
      } catch (error) {
        console.error("Error saving edited form:", error);
      }
      if (this.enableGeolocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.editedForm.latitude = position.coords.latitude;
              this.editedForm.longitude = position.coords.longitude;
            },
            (error) => {
              console.error("Error getting geolocation:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
    },

    removeImageField(index) {
      this.selectedImages.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.datepicker-input {
  width: 50%;

  margin-right: 4%;
}

.date-picker {
  display: flex;
  align-items: center;
}

.bg {
  background-color: #f4fff2;
}

.logo-image {
  width: 300px;
  height: 80px;
  padding-top: 20px;
}

.form-check-input {
  border-color: #cfcfcf;
  margin-left: 6px;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #dff0d8;
  border: 1px solid #d0e9c6;
  border-radius: 4px;
  color: #3c763d;
}

.modal-content label {
  font-size: 0.9rem !important;
}

.card-title {
  font-size: 0.9rem;
}

.card-body {
  padding-bottom: 5px !important;
}
</style>
