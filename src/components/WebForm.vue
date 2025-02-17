<template>
  <CRow>
    <CCol :md="12">
      <CRow class="bg">
        <CCol :sm="12">
          <form @submit.prevent="submitForm" class="competition-form">
            <CRow>
              <CCol md="3">
                <CFormLabel for="date">Market Visit Date:<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="date" class="form-control" v-model="formattedDate" @change="updateDate" required>
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="state">Select State:<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <select v-model="selectedState" class="form-select" @change="onStateChange">
                  <option disabled value="">State</option>
                  <option v-for="state in states" :key="state.State_ID" :value="state.State_ID">
                    {{ state.State_Name }}
                  </option>
                </select>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="district">Select District:<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <select class="form-select" v-model="selectedDistrict" @change="onDistrictChange">
                  <option disabled value="">District</option>
                  <option v-for="district in districts" :key="district.District_ID" :value="district.District_ID">
                    {{ district.District_Name }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="town">Select Town:<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <select v-model="selectedTown" class="form-select">
                  <option disabled value="">Town</option>
                  <option v-for="town in towns" :key="town.Town_ID" :value="town.Town_ID">
                    {{ town.Town_Name }}
                  </option>
                </select>
              </CCol>
            </CRow>
            <!-- 
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="brand-name"
                  >Brand Name:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol :xs="6">
                <select
                  v-model="selectedBrand"
                  @change="onBrandChange"
                  class="form-select"
                >
                  <option disabled value="">Brand</option>
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                  </option>
                </select>
              </CCol> -->
            <!-- <CCol :xs="3">
                    <button @click="addBrand" class="btn btn-success">
                      Add
                    </button>
                  </CCol> -->
            <!-- </CRow> -->

            <!-- <CRow class="mt-3">
              <CCol md="3">
                <CFormLabel for="sku"
                  >SKU:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <select
                  v-model="selectedSKU"
                  @change="onSKUChange"
                  class="form-select"
                >
                  <option disabled value="">SKU</option>
                  <option v-for="sku in skus" :key="sku" :value="sku">
                    {{ sku }}
                  </option>
                </select>
              </CCol>
            </CRow> -->
            <!-- <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight"
                  >Net. Wt. (g):<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="netWeight"
                  required
                  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                >
                </CFormInput>
              </CCol>
            </CRow> -->
            <CRow class="mt-2">
  <CCol md="3">
    <CFormLabel for="brand-name">Brand Name:<span style="color: red">*</span></CFormLabel>
  </CCol>
  <CCol :xs="9">
    <select v-model="selectedBrand" @change="onBrandChange" class="form-select" required>
      <option disabled value="">Select Brand</option>
      <option v-for="brand in brands"
                    :key="brand.id"
                    :value="brand.name">
					{{ brand.name }}
      </option>
      <!-- <option v-for="brand in brands" :key="brand" :value="brand">
        {{ brand }}
      </option>
      <option v-if="!brands.includes('Others')" :value="'Others'">Others</option> -->
    </select>
  </CCol>
</CRow>

<!-- Conditionally show 'Specify' and 'Net Weight' input fields if 'Others' is selected -->
<CRow v-if="selectedBrand === 'Others'" class="mt-2">
  <CCol md="3">
    <CFormLabel for="specify-brand">Specify Brand:</CFormLabel>
  </CCol>
  <CCol :xs="6">
    <CFormInput v-model="Brand_Name" placeholder="Specify Brand" type="text" class="form-control"></CFormInput>
  </CCol>
</CRow>

<CRow v-if="selectedBrand === 'Others'" class="mt-2">
  <CCol md="3">
    <CFormLabel for="net-weight">Net Weight (g):</CFormLabel>
  </CCol>
  <CCol :xs="6">
    <CFormInput v-model="customNetWeight" placeholder="Enter Net Weight" type="text" class="form-control"></CFormInput>
  </CCol>
</CRow>

<!-- Regular Net. Wt. dropdown (hidden when 'Others' is selected) -->
<CRow v-if="selectedBrand !== 'Others'" class="mt-2">
  <CCol md="3">
    <CFormLabel for="net-weight">Net. Wt. (g):<span style="color: red">*</span></CFormLabel>
  </CCol>
  <CCol md="9">
    <select v-model="selectedNetName" class="form-select" required>
      <option disabled value="">Select Net Weight</option>
      <option v-for="netName in netNames" :key="netName" :value="netName">
        {{ netName }}
      </option>
    </select>
  </CCol>
</CRow>






            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="mrp">MRP (₹):<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="mrp" required
                  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="pkd-date">PKD (DD/MM/YYYY):<span style="color: red">*</span></CFormLabel>
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
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="effective-consumer-price">Effective Consumer Price (₹):<span
                    style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="ecp" required
                  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="units-in-ic">Units in IC:<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="unitsIC" required
                  oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="ic-rlp">IC RLP (₹):<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="icRlp" required
                  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="retail-scheme">Retail Scheme:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="retailScheme"></CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="wholesale-scheme">Wholesale Scheme:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="wholesaleScheme"></CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="additionalInfo1">Additional info 1 (Market Observations and Feedback):
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormTextarea class="form-control" v-model="additionalInfo1"></CFormTextarea>
              </CCol>
            </CRow>
            <CRow class="mt-3">
              <CCol md="3">
                <CFormLabel for="additionalInfo2">Additional info 2:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="text" class="form-control" v-model="additionalInfo2"></CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="image">Add Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput type="file" @change="addImageField" class="form-control-file" multiple></CFormInput>
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
                <div v-for="(image, index) in selectedImages" :key="index" class="form-group">
                  <img :src="image.src" height="80" width="80" /><br />
                  <CButton @click="removeImageField(image.imageUrl)" class="btn btn-dark">Remove</CButton>
                </div>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3"></CCol>
              <CCol md="9">
                <CFormLabel for="geolocation">Capture Geotagged Location:</CFormLabel>
                <CFormCheck type="checkbox" v-model="enableGeolocation"></CFormCheck>
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
      uploading: false, // Track uploading status
      uploadSuccess: false, // Track successful upload
      uploadError: null, // Track upload error
      isFormValid: false, // for form validation
      formattedDate: "",
      enableGeolocation: false,
      //Brand_Name: "",
      selectedBrandId: "",
      username: "",
      email: "",
      password: "",
      date: "",
      brands: [], // To store brand names
      // netWeights: [], // To store NetName values for all brands
      netWeight: "",
      selectedBrand: "", // To store the selected brand
      netNames: [], // To store NetName values for the selected brand
      selectedNetName: "", // To store the selected NetName
      customNetWeight: "",
      brand_id: "",
      mrp: "",
      pkdDate: "",
      selectedDay: "",
      selectedMonth: "",
      selectedYear: "",
      months: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
      days: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ],
      years: [],
      ecp: "",
      unitsIC: "",
      icRlp: "",
      retailScheme: "",
      wholesaleScheme: "",
      additionalInfo1: "",
      additionalInfo2: "",
      selectedImages: [],
      // skus: [],
      // selectedSKU: "",
      states: [],
      districts: [],
      towns: [],
      selectedState: "",
      selectedDistrict: "",
      selectedTown: "",
      submissionTimestamp: null,
    };
  },
  mounted() {
    this.generateYearOptions();
    this.fetchStates();
    this.fetchBrandsAndWeights();
    // this.fetchBrands();
    // this.fetchSkus();
    this.username = localStorage.getItem("username");
    // Load last entry's data from LocalStorage
    const lastEntryData = localStorage.getItem("lastFormData");
    if (lastEntryData) {
      const parsedData = JSON.parse(lastEntryData);

      this.autofillFields(parsedData);
    }
  },
  computed: {
    // Computed property to calculate the PKD date
    combinedPKDDate() {
      if (this.selectedMonth && this.selectedYear && this.selectedDay) {
        // Combine selected month and year to form PKD date
        return `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`;
      }
      return null;
    },
    isCustomBrandSelected() {
    return this.selectedBrand === "Others"; // Check for "Others"
  }
  },

  methods: {
    validateCustomNetWeight() {
    const weight = parseFloat(this.customNetWeight);
    return !isNaN(weight) && weight > 0; // Ensures it's a positive number
  },
    validateForm() {
      this.isFormValid =
        this.date &&
        this.selectedState &&
        this.selectedDistrict &&
        this.selectedTown &&
        this.selectedBrand &&
        // this.netWeight &&
        // this.selectedSKU &&
        this.mrp &&
        this.selectedMonth &&
        this.selectedYear &&
        this.ecp &&
        this.unitsIC &&
        this.icRlp;
        if (this.selectedBrand === "Others") {
        this.isFormValid &&= this.validateCustomInputs(); // Ensure custom inputs are valid
    }
},
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
      // this.selectedSKU = data.sku;
      this.selectedDistrict = data.district;
      this.selectedTown = data.town;
      this.date = this.formattedDate;
      
      await this.fetchDistricts();
      await this.fetchTowns();

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
      this.onBrandChange()
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
      this.selectedDistrict = null; // Reset the selected district when the state changes
      this.selectedTown = null; // Reset the selected town when the state changes
      this.fetchDistricts();
    },
    onDistrictChange() {
      this.selectedTown = null; // Reset the selected town when the district changes
      this.fetchTowns();
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

	}
//     updateNetWeight() {
//     if (this.selectedBrand === "Others") {
//         // Set netWeight to custom input if valid
//         this.netWeight = this.validateCustomNetWeight() ? this.customNetWeight : ""; 
//     } else {
//         // Otherwise, use selected net name
//         this.netWeight = this.selectedNetName || (this.netNames[0] || ""); 
//     }
//     console.log("Net Weight set to:", this.netWeight);
// },




// async fetchBrandsAndWeights() {
//   try {
//     const [brandsResponse, weightsResponse] = await Promise.all([
//       axios.get(process.env.VUE_APP_ROOT_API + "/api/brandsname"),
//       axios.get(process.env.VUE_APP_ROOT_API + "/api/netweightmaster/all"),
//     ]);

//     // Clear existing data
//     this.brands = [];
//     this.netWeights = {};

//     // Create a map to store Brand_IDs using Brand_Names
//     this.brandIds = {};

//     // Store only Brand_Name and map it to Brand_ID
//     this.brands = brandsResponse.data.map((brand) => {
//       this.brandIds[brand.Brand_Name] = brand.Brand_ID; // Map Brand_Name to Brand_ID
//       return brand.Brand_Name; // Only store Brand_Name in this.brands
//     });

//     // Store all net weights, grouped by brand
//     this.netWeights = weightsResponse.data.reduce((acc, item) => {
//       if (!acc[item.Brand]) {
//         acc[item.Brand] = []; // Initialize an array for each brand
//       }
//       acc[item.Brand].push(item.NetName); // Add NetName to the brand's array
//       return acc;
//     }, {});
//   } catch (error) {
//     console.error("Error fetching brands or net weights:", error);
//     this.$toast.error("Failed to load brands and weights."); // Notify the user
//   }
// },


// async onBrandChange() {
//     this.selectedNetName = ""; // Clear previous NetName
//     this.customNetWeight = ""; // Clear custom weight
//     this.Brand_Name = ""; // Clear specified brand if switching brands

//     if (this.selectedBrand === "Others") {
//         this.netNames = []; // Clear net names for "Others"
//     } else {
//         // Load net names for the selected brand
//         this.netNames = this.netWeights[this.selectedBrand] || [];
//         this.selectedNetName = this.netNames.length > 0 ? this.netNames[0] : ""; 
//     }

//     // Log the selected Brand ID
//     this.brand_id = this.brandIds[this.selectedBrand]; // Set Brand_ID from the brandIds map
//     console.log("Selected Brand ID:", this.brand_id);

//     this.updateNetWeight(); // Update net weight based on selection
// },
,
    validateCustomInputs() {
		if (this.selectedBrand === "Others") {
			return this.Brand_Name.trim() !== "" && this.validateCustomNetWeight();
		}
		return true; // If not "Others", validation passes
	},


  

    async addImageField(event) {
      //reset
      this.uploading = true;
      this.uploadSuccess = false;
      this.uploadError = null;
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
          this.uploadSuccess = true; // Set upload success status
        } catch (error) {
          console.error("Error uploading image:", error);
          this.uploadError = "Error uploading image"; // Set upload error status
        }
      }

      this.uploading = false;
    },

    removeImageField(imageUrl) {
      //this.selectedImages.splice(index, 1);//TODO Remove
      this.selectedImages = this.selectedImages.filter(
        (item) => item.imageUrl !== imageUrl
      );
    },
    updateDate(event) {
      //console.log(event.target.value)
      //const selectedDate = new Date(event.target.value);
      //const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      //this.formattedDate = formattedDate;
      this.date = event.target.value;
      console.log(this.date);
    },

    async submitForm() {
      this.updateNetWeight();
      const now = new Date();
      const serverTimestamp = now.toISOString(); // Server timestamp
      const submissionTimestamp = new Date(serverTimestamp); // Create a new date object from the server timestamp
      submissionTimestamp.setHours(submissionTimestamp.getHours() + 5); // Add 5 hours
      submissionTimestamp.setMinutes(submissionTimestamp.getMinutes() + 30); // Add 30 minutes

      const formattedSubmissionTimestamp = submissionTimestamp
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      this.formattedSubmissionTimestamp = formattedSubmissionTimestamp;
      this.submissionTimestamp = formattedSubmissionTimestamp;

      // Check if PKD date is greater than current date
      const selectedPKDDate = new Date(this.combinedPKDDate);
      if (selectedPKDDate > now) {
        alert("PKD date cannot be greater than the current date.");
        return;
      }

      // Check if the Market visit  date is greater than current date
      const selectedGeneralDate = new Date(this.date);
      if (selectedGeneralDate > now) {
        alert("Market Visit date cannot be greater than the current date.");
        return;
      }
      this.validateForm(); // Run  form validation logic

    if (this.isFormValid) {
      try {

          const formData = {
            username: this.username,
            date: this.date,
            state: this.selectedState,
            district: this.selectedDistrict || "", // Set to empty string if undefined
            town: this.selectedTown || "", // Set to empty string if undefined
			brand_name:
              this.selectedBrand === "Others"
                ? this.specifiedBrand
                : this.selectedBrand,
            brand_id: this.selectedBrandId, 
            //brand_name: this.selectedBrand === "Others" ? this.Brand_Name : this.selectedBrand,
            net_weight:
              this.selectedBrand === "Others"
                ? this.customNetWeight
                : this.selectedNetName,
            //brand_id: this.selectedBrand === "Others" ? "99" : this.brandIds[this.selectedBrand], // Update Brand_ID accordingly
            // sku: this.selectedSKU,
            mrp: this.mrp,
            pkd_date: this.combinedPKDDate,
            pkd_month: this.selectedMonth,
            pkd_year: this.selectedYear,
            //pkd_day: this.selectedDay,
            consumer_price: this.ecp,
            units_in_ic: this.unitsIC,
            ic_rlp: this.icRlp,
            retail_scheme: this.retailScheme,
            wholesale_scheme: this.wholesaleScheme,
            additional_info_1: this.additionalInfo1,
            additional_info_2: this.additionalInfo2,
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
            type: "Retailer",
          };
          console.log("Form Data to be Submitted:", formData);
          // Capture geolocation if enabled
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
    },


    
    async saveForm(formData) {
      try {
        await axios.post(
          process.env.VUE_APP_ROOT_API + "/api/submit-form",
          formData
        );

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
