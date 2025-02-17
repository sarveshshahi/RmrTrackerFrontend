<template>
  <CRow>
    <CCol :md="12">
      <CRow class="bg">
        <CCol :sm="12">
          <form @submit.prevent="submitForm" class="competition-form">
            <CRow>
              <CCol md="3">
                <CFormLabel for="date"
                  >Market Visit Date:<span style="color: red"
                    >*</span
                  ></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="date"
                  class="form-control"
                  v-model="formattedDate"
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
                  v-model="selectedState"
                  class="form-select"
                  @change="onStateChange"
                  required
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
                  class="form-select"
                  v-model="selectedDistrict"
                  @change="onDistrictChange"
                  required
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
                <select
                  v-model="selectedTown"
                  class="form-select"
                  @change="onTownChange"
                  required
                >
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

            <!-- wholesaler outlet name -->

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="salesChannel">
                  Sales Channel Category:<span style="color: red">*</span>
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <select
                  v-model="selectedSalesChannel"
                  class="form-select"
                  @change="onSalesChannelChange"
                  required
                >
                  <option disabled value="">Select Sales Channel</option>
                  <option value="Distributor">Distributor</option>
                  <option value="IWS">IWS</option>
                  <option value="Wholeseller">Wholeseller</option>
                  <option value="Retailer">Retailer</option>
                </select>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="channel-partner-name">
                  Channel Partner Name:<span style="color: red">*</span>
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput
                  id="channel-partner-name"
                  v-model="channelPartnerName"
                  required
                />
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="brand-name"
                  >Brand Name:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol :xs="9">
                <select
                  v-model="selectedBrand"
                  @change="onBrandChange"
                  class="form-select"
                  required
                >
                  <option disabled value="">Select Brand</option>
                  <option
                    v-for="brand in brands"
                    :key="brand.id"
                    :value="brand.name"
                  >
                    {{ brand.name }}
                  </option>
                  <!-- <option value="Others">Others</option> -->
                </select>
              </CCol>
            </CRow>

            <!-- Conditionally show 'Specify' and 'Net Weight2' input fields if 'Others' is selected -->
            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="specify-brand">Specify Brand:</CFormLabel>
              </CCol>
              <CCol :xs="9">
                <CFormInput
                  v-model="specifiedBrand"
                  placeholder="Specify Brand"
                  type="text"
                  class="form-control"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight">Net Weight (g):</CFormLabel>
              </CCol>
              <CCol :xs="6">
                <CFormInput
                  v-model="customNetWeight"
                  placeholder="Enter Net Weight"
                  type="text"
                  class="form-control"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <!-- Regular Net. Wt. dropdown (hidden when 'Others' is selected) -->
            <CRow v-if="selectedBrand !== 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight"
                  >Net. Wt. (g):<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <select v-model="selectedNetName" class="form-select" required>
                  <option disabled value="">Select Net Weight</option>
                  <option
                    v-for="netName in netNames"
                    :key="netName"
                    :value="netName"
                  >
                    {{ netName }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="pkd-date"
                  >PKD (DD/MM/YYYY):<span style="color: red"
                    >*</span
                  ></CFormLabel
                >
              </CCol>
              <CCol :xs="4" md="3">
                <select v-model="selectedDay" class="form-select">
                  <option value="" disabled>Day</option>
                  <option v-for="day in days" :value="day" :key="day">
                    {{ day }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="4" md="3">
                <select v-model="selectedMonth" class="form-select">
                  <option value="" disabled>Month</option>
                  <option v-for="month in months" :value="month" :key="month">
                    {{ month }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="4" md="3">
                <select v-model="selectedYear" class="form-select">
                  <option value="" disabled>Year</option>
                  <option v-for="year in years" :value="year" :key="year">
                    {{ year }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <!-- IC WLP -->

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="additionalInfo1"
                  >Additional info 1 (Market Observations and Feedback):
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormTextarea
                  class="form-control"
                  v-model="additionalInfo1"
                ></CFormTextarea>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="image">Add Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <label class="form-control-file-label" for="imageInput">
                  {{ fileInputLabel }}
                </label>
                <CFormInput
                  type="file"
                  @change="addImageField"
                  class="form-control-file"
                  multiple required
                ></CFormInput>
                <!-- Show spinner during uploading -->
                <div v-if="uploading" class="mt-1">
                  <i class="fa fa-spinner fa-spin"></i> Uploading...
                </div>
                <!-- Show upload success message -->
                <p v-if="uploadSuccess" class="text-success mt-1">
                  Image uploaded successfully.
                </p>
                <!-- Show upload error message -->
                <p v-if="uploadError" class="text-danger mt-1">
                  {{ uploadError }}
                </p>
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
                  <img :src="image.src" height="80" width="80" /><br />
                  <CButton
                    @click="removeImageField(image.imageUrl)"
                    class="btn btn-dark"
                    >Remove</CButton
                  >
                </div>
              </CCol>
            </CRow>
            <CCol xs="12" class="mt-3" align="right">
              <CButton type="submit" class="btn btn-success">Submit</CButton>
            </CCol>
          </form>
        </CCol>
      </CRow>
    </CCol>
  </CRow>
  <div class="mt-5">&nbsp;</div>

  <FooterCom />
</template>

<script>
import { CFormTextarea } from "@coreui/vue";
import axios from "axios";

export default {
  data() {
    return {
      uploading: false,
      uploadSuccess: false,
      uploadError: null,
      isFormValid: false,
      formattedDate: "",
      enableGeolocation: false,
      username: "",
      email: "",
      password: "",
      date: "",
      selectedWholesaler: {},
      selectedWholesalerOutletName: "",
      beatIdofSelectedWholesaler: "",
      wholesalerId: "",
      ICPerMC: "",
      icWLP: "",
      netWeight: "",
      specifiedBrand: "",
      selectedBrandId: "",
      netNames: [],
      selectedNetName: "",
      customNetWeight: "",
      mrp: "",
      pkdDate: "",
      selectedDay: "",
      selectedMonth: "",
      selectedYear: "",
      months: [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
      ],
      days: [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
        "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24",
        "25", "26", "27", "28", "29", "30", "31",
      ],
      years: [],
      unitsIC: "",
      icRlp: "",
      retailScheme: "",
      wholesaleScheme: "",
      additionalInfo1: "",
      additionalInfo2: "",
      selectedImages: [],
      brands: [],
      skus: [],
      selectedBrand: "",
      selectedSKU: "",
      states: [],
      districts: [],
      towns: [],
      wholesalerOutlets: [],
      selectedState: "",
      selectedDistrict: "",
      selectedTown: "",
      submissionTimestamp: null,
      fileInputLabel: "Choose files",
    };
  },
  mounted() {
  this.generateYearOptions();
  this.fetchStates();
  this.fetchBrandsAndWeights();
  this.username = localStorage.getItem("username");

  const lastEntryData = localStorage.getItem("lastFormData");
  if (lastEntryData) {
    const parsedData = JSON.parse(lastEntryData);
    this.autofillFields(parsedData);
  }

  // Retrieve and set the selectedNetName from local storage
  const storedNetName = localStorage.getItem("selectedNetName");
  if (storedNetName) {
    this.selectedNetName = storedNetName;
  }
},

  computed: {
    combinedPKDDate() {
      if (this.selectedMonth && this.selectedYear && this.selectedDay) {
        return `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`;
      }
      return null;
    },
    isCustomBrandSelected() {
      return this.selectedBrand === "Others";
    },
  },
  methods: {
    validateCustomNetWeight() {
      const netWeightNumber = parseFloat(this.customNetWeight);
      return !isNaN(netWeightNumber) && netWeightNumber > 0;
    },
    validateForm() {
      this.isFormValid =
        this.date &&
        this.selectedState &&
        this.selectedDistrict &&
        this.selectedTown &&
        this.selectedBrand &&
        // this.selectedSKU &&
        // this.mrp &&
        this.selectedMonth &&
        this.selectedYear &&
        this.channelPartnerName &&
        this.selectedSalesChannel &&
        this.selectedImages.length > 0;
        // this.ecp &&
        // this.unitsIC &&
        // this.icRlp;
        if (this.selectedBrand === "Others") {
        this.isFormValid &&= this.validateCustomInputs(); // Ensure custom inputs are valid
    }
    if (this.selectedImages.length === 0) {
        alert("At least one image upload is mandatory.");
      }
    },
    // validateForm() {
    //   this.isFormValid = true;
    //   console.log("Is Form Valid:", this.isFormValid);
    // },
    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 2000; year--) {
        this.years.push(year);
      }
    },
    async autofillFields(data) {
      console.log("Autofill data:", data);
      console.log(" auto fill response date is ", data.date);

      this.formattedDate = data.date;
      this.selectedState = data.state;
      this.selectedBrand = data.brand_name;
      this.selectedBrandId = data.brand_id; // Assuming brand_id is part of the data

      // Set selectedBrand to "Others" if brand_id is 99
      if (this.selectedBrandId === 99) {
        this.selectedBrand = "Others";
      }

      this.selectedDistrict = data.district;
      this.selectedTown = data.town;
      this.date = this.formattedDate;

      await this.fetchDistricts();
      await this.fetchTowns();
      // this.onBrandChange();

      const selectedDistrict = this.districts.find(
        (district) => district.District_ID === data.district
      );
      const selectedTown = this.towns.find(
        (town) => town.Town_ID === data.town
      );
      if (selectedDistrict) {
        this.selectedDistrict = selectedDistrict.District_ID;
      }
      if (selectedTown) {
        this.selectedTown = selectedTown.Town_ID;
      }
      this.selectedNetName = data.net_weight;
      this.selectedBrandId = data.brand_id;
      this.onBrandChange()
      console.log("Selected brand:", this.selectedBrand);
      console.log("Selected id:", this.selectedBrandId);
      console.log("Selected netweight:", this.selectedNetName);
      console.log("Selected district:", this.selectedDistrict);
      console.log("Selected town:", this.selectedTown);
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
      console.log("Fetching districts with state:", this.selectedState);
      axios
        .get(
          process.env.VUE_APP_ROOT_API +
            `/api/districts?state=${this.selectedState}`
        )
        .then((response) => {
          console.log("Districts response:", response.data);
          this.districts = response.data;
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    },
    fetchTowns() {
      console.log("Fetching towns with district:", this.selectedDistrict);
      axios
        .get(
          process.env.VUE_APP_ROOT_API +
            `/api/towns?district=${this.selectedDistrict}`
        )
        .then((response) => {
          console.log("Towns response:", response.data);
          this.towns = response.data;
        })
        .catch((error) => {
          console.error("Error fetching towns:", error);
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
    onTownChange() {
      this.selectedWholesalerOutletName = null;
      this.fetchWholesalerData();
    },
    onSelectedWholesalerOutletName() {
      this.beatIdofSelectedWholesaler =
        this.selectedWholesalerOutletName.Beat_Id;
      this.wholesalerId = this.selectedWholesalerOutletName.Wholesaler_Id;
    },
    async fetchWholesalerData() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_ROOT_API +
            "/api/wholesaler-data/" +
            this.selectedTown.toString()
        );
        this.wholesalerOutlets = response.data;
        console.log(this.wholesalerOutlets);
      } catch (error) {
        console.error(error);
      }
    },
    updateNetWeight() {
      if (this.selectedBrand === "Others") {
        this.netWeight = this.customNetWeight;
        console.log("Custom Net Weight:", this.netWeight);
      } else {
        const selectedBrandData = this.brands.find(
          (brand) => brand.Brand_Name === this.selectedBrand
        );
        if (selectedBrandData) {
          this.netWeight = selectedBrandData.netWeight;
          console.log("Selected Brand Net Weight:", this.netWeight);
        } else {
          // this.netWeight = "";
          console.log("No Net Weight found for selected brand.");
        }
      }
    },
    fetchBrandsAndWeights() {
		axios.get(process.env.VUE_APP_ROOT_API + "/api/brandsname")
		.then((brandsResponse) => {
			console.log("Brands response:", brandsResponse.data);
			this.brands = brandsResponse.data.map((brand) => ({
			name: brand.Brand_Name,
			id: brand.Brand_ID,
			}));
		})
		.catch((error) => {
			console.error("Error fetching brands:", error);
		});
	},
	onBrandChange() {
		this.customNetWeight = "";
		this.updateNetWeight();
		const selectedBrandData = this.brands.find((brand) => brand.name === this.selectedBrand);
		if (selectedBrandData) {
			this.selectedBrandId = selectedBrandData.id;
		} else if (this.selectedBrandId) {
			console.warn("Using stored selectedBrandId:", this.selectedBrandId);
		} else {
			console.error("Selected brand data is undefined for brand:", this.selectedBrand);
			this.selectedBrandId = null;
		}
		if (this.selectedBrandId && this.selectedBrandId!==99) {
			axios
				.get(`${process.env.VUE_APP_ROOT_API}/api/netweightmaster/${this.selectedBrandId}`)
				.then((response) => {
				console.log("Response data:", response.data);
				this.netNames = response.data.map(item => item.NetName);
				console.log("Net Names:", this.netNames);

				if (this.netNames.includes(this.selectedNetName)) {
					console.log("Selected netweight:", this.selectedNetName);
				} else {
					this.selectedNetName = this.netNames[0] || "";
					console.log("Defaulting to first netweight:", this.selectedNetName);
				}
				})
				.catch((error) => {
				console.error("Error fetching net weights:", error);
				});
		} else {
			console.error("No valid selectedBrandId available.");
		}

	},


    addBrand() {
      const newBrand = prompt("Add Brand Name");
      if (newBrand && newBrand.trim() !== "") {
        const lowerCaseNewBrand = newBrand.toLowerCase();
        const brandExists = this.brands.some(
          (brand) => brand.toLowerCase() === lowerCaseNewBrand
        );

        if (!brandExists) {
          axios
            .post(process.env.VUE_APP_ROOT_API + "/api/add-brand", {
              brandName: newBrand,
              Created_By: localStorage.getItem("username"),
            })
            .then((response) => {
              if (response.data.success) {
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
      this.uploading = true;
      this.uploadSuccess = false;
      this.uploadError = null;
      const files = Array.from(event.target.files);
      const remainingImageSlots = 5 - this.selectedImages.length;

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
          this.uploadSuccess = true;
        } catch (error) {
          console.error("Error uploading image:", error);
          this.uploadError = "Error uploading image";
        }
      }

      this.uploading = false;
      this.updateFileInputLabel();
    },
    removeImageField(imageUrl) {
      this.selectedImages = this.selectedImages.filter(
        (item) => item.imageUrl !== imageUrl
      );
      this.updateFileInputLabel();
    },
    updateFileInputLabel() {
      if (this.selectedImages.length === 0) {
        this.fileInputLabel = "Choose files";
      } else {
        this.fileInputLabel = `${this.selectedImages.length} file(s) selected`;
      }
    },
    updateDate(event) {
      this.date = event.target.value;
      console.log(this.date);
    },
    async submitForm() {
      this.updateNetWeight();
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
      this.validateForm();

      if (this.isFormValid) {
        try {
          const formData = {
            username: this.username,
            date: this.date,
            state: this.selectedState,
            district: this.selectedDistrict,
            town: this.selectedTown,
            brand_name:
              this.selectedBrand === "Others"
                ? this.specifiedBrand
                : this.selectedBrand,
            brand_id: this.selectedBrandId,
            net_weight:
              this.selectedBrand === "Others"
                ? this.customNetWeight
                : this.selectedNetName,
            mrp: 0,
            pkd_date: this.combinedPKDDate,
            pkd_month: this.selectedMonth,
            pkd_year: this.selectedYear,
            consumer_price: 0,
            retail_scheme: "",
            wholesale_scheme: this.wholesaleScheme,
            additional_info_1: this.additionalInfo1,
            additional_info_2: "",
            image1_url: this.selectedImages[0]
              ? this.selectedImages[0].imageUrl
              : "",
            image2_url: this.selectedImages[1]
              ? this.selectedImages[1].imageUrl
              : "",
            image3_url: this.selectedImages[2]
              ? this.selectedImages[2].imageUrl
              : "",
            image4_url: this.selectedImages[3]
              ? this.selectedImages[3].imageUrl
              : "",
            image5_url: this.selectedImages[4]
              ? this.selectedImages[4].imageUrl
              : "",
            submission_timestamp: this.submissionTimestamp,
            sales_channel: this.selectedSalesChannel,
            channel_partner_name: this.channelPartnerName,
            type: "PKD",
          };
          localStorage.setItem("selectedNetName", this.selectedNetName);
          if (this.enableGeolocation) {
            if ("geolocation" in navigator) {
              const permission = await navigator.permissions.query({
                name: "geolocation",
              });
              if (
                permission.state === "granted" ||
                permission.state === "prompt"
              ) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    formData.latitude = position.coords.latitude;
                    formData.longitude = position.coords.longitude;
                    this.saveForm(formData);
                  },
                  (error) => {
                    console.error("Error getting geolocation:", error.message);
                    this.saveForm(formData);
                  }
                );
              } else {
                console.warn("Geolocation permission denied by the user.");
                this.saveForm(formData);
              }
            } else {
              console.warn("Geolocation is not supported in this browser.");
              this.saveForm(formData);
            }
          } else {
            this.saveForm(formData);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          this.$toast.error("An error occurred while submitting the form.");
        }
      } else {
        alert("Please fill in all mandatory (*) fields.");
      }
    //   this.selectedState = "";
    //   this.selectedDistrict = "";
    //   this.selectedTown = "";
    //   this.selectedWholesalerOutletName = "";
    //   this.beatIdofSelectedWholesaler = "";
    //   this.wholesalerId = "";
    //   this.selectedBrand = "";
    //   this.formattedDate = "";
    },
    async saveForm(formData) {
      try {
        await axios.post(
          process.env.VUE_APP_ROOT_API + "/api/submit-form",
          formData
        );
        this.netWeight = formData.net_weight;

        localStorage.setItem("lastFormData", JSON.stringify(formData));
        this.$toast.success("Form submitted successfully!");
        this.$router.push("/user/dashboard");
      } catch (error) {
        console.error("Error submitting form:", error);
        this.$toast.error("An error occurred while submitting the form.");
        this.$router.push("/user/dashboard");
      }
    },
  },
  components: {
    CFormTextarea,
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
</style>
