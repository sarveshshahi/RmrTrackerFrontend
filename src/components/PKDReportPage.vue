<template>
    <CRow class="mb-4">
      <CCol :md="12">
        <CRow class="align-items-start mb-3">
          <CCol :xs="7" :md="6" :lg="6" class="mb-2">
            <CButton
              color="success"
              @click="
                () => {
                  visibleLiveDemo = true;
                }
              "
              >Filters
              <font-awesome-icon icon="filter" />
            </CButton>
            <CButton @click="exportToExcel" class="btn btn-success ml-3"
              >Excel
              <font-awesome-icon  icon="download" />
            </CButton>
          </CCol>
          <CCol :xs="5" :md="6" :lg="6" class="mb-2 right">
            <CRow class="text-right">
              <CCol :xs="8" :md="10" :lg="10" class="p-right">
                <!-- Search input field -->
                <input
                  class="form-control"
                  type="text"
                  v-model="searchInput"
                  placeholder="Search By  UserName/State/District/Town/Sku/Brand/MRP/Net Weight/Retail Scheme/Wholesale Scheme"
                />
              </CCol>
              <CCol :xs="4" :md="2" :lg="2" class="p-0">
                <CButton color="btn btn-dark">
                  <font-awesome-icon icon="magnifying-glass" />
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
  
        <CRow>
          <CCol :md="12">
            <!-- Reports Filter -->
            <CModal
              :visible="visibleLiveDemo"
              @close="
                () => {
                  visibleLiveDemo = false;
                }
              "
            >
              <CModalHeader>
                <CModalTitle>Report Filters</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow class="mb-4">
                  <CCol :xs="6">
                    <CFormLabel>User Name</CFormLabel>
                    <select v-model="reportFilters.userName" class="form-select">
                      <option value="">Select a User</option>
                      <option v-for="name in userNames" :key="name">
                        {{ name }}
                      </option>
                    </select>
                  </CCol>
                  <CCol :xs="6">
                    <CFormLabel>State</CFormLabel>
                    <select
                      v-model="reportFilters.selectedStateId"
                      @change="onStateChange"
                      class="form-select"
                    >
                      <option value="">Select a State</option>
                      <option
                        v-for="state in states"
                        :key="state.State_ID"
                        :value="state.State_ID"
                      >
                        {{ state.State_Name }}
                      </option>
                    </select>
                  </CCol>
                  <CCol :xs="6">
                    <CFormLabel>District</CFormLabel>
                    <select
                      v-model="reportFilters.selectedDistrictId"
                      
                      class="form-select"
                    >
                      <option value="">Select a District</option>
                      <option
                        v-for="district in districts"
                        :key="district.District_ID"
                        :value="district.District_ID"
                      >
                        {{ district.District_Name }}
                      </option>
                    </select>
                  </CCol>
                  <CCol :xs="6">
                    <CFormLabel>Brand</CFormLabel>
                    <select
                      v-model="reportFilters.selectedBrand"
                      @change="onBrandChange"
                      class="form-select"
                    >
                      <option value="">Select a brand</option>
                      <option v-for="brand in brands" :key="brand.id" :value="brand.name">
                        {{ brand.name }}
                      </option>
                    </select>
                  </CCol>
                  <!-- </CRow>
                <CRow class="mb-4"> -->
                  <CCol :xs="6">
                    <CFormLabel>From</CFormLabel>
                    <CFormInput
                      type="date"
                      v-model="reportFilters.fromDate"
                      @change="setFromDate"
                      class="form-control"
                      required
                    >
                    </CFormInput>
                  </CCol>
                  <CCol :xs="6">
                    <CFormLabel>To</CFormLabel>
                    <CFormInput
                      type="date"
                      v-model="reportFilters.toDate"
                      @change="setToDate"
                      class="form-control"
                      required
                    >
                    </CFormInput>
                  </CCol>
                  <!-- </CRow>
                <CRow class="mb-4"> -->
                  
                  <!-- <CCol :xs="6">
                    <CFormLabel>SKU</CFormLabel>
                    <select
                      v-model="reportFilters.selectedSKU"
                      @change="onSKUChange"
                      class="form-select"
                    >
                      <option value="">Select an SKU</option>
                      <option v-for="sku in skus" :key="sku" :value="sku">
                        {{ sku }}
                      </option>
                    </select>
                  </CCol> -->
                  <!-- </CRow>
                <CRow class="mb-4"> -->
                  <!-- <CCol :xs="12" class="date-picker">
                    <CFormLabel>PKD</CFormLabel>
                    <CRow>
                      <CCol :xs="6">
                        <select
                          v-model="reportFilters.selectedMonth"
                          class="datepicker-input wide-dropdown form-select"
                        >
                          <option value="">Select Month</option>
                          <option
                            v-for="(month, index) in months"
                            :value="index + 1"
                            :key="index"
                          >
                            {{ month }}
                          </option>
                        </select>
                      </CCol>
                      <CCol :xs="6">
                        <select
                          v-model="reportFilters.selectedYear"
                          class="datepicker-input wide-dropdown form-select"
                        >
                          <option value="">Select Year</option>
                          <option v-for="year in years" :value="year" :key="year">
                            {{ year }}
                          </option>
                        </select>
                      </CCol>
                    </CRow>
                  </CCol> -->
                  <!-- <CRow class="mt-2">
                    <CCol :xs="12">
                      <CFormLabel>Net Weight</CFormLabel>
                    </CCol>
                    <CCol :xs="12">
                      <CFormInput
                        type="number"
                        v-model="reportFilters.enteredNetWeight"
                      />
                    </CCol>
                  </CRow> -->
                </CRow>
                <!-- <CRow class="mb-4">
                        <CCol :xs="12">
                          <CFormLabel>Report Columns</CFormLabel>
                          <Vue3MultiselectCheckboxed
                            :options="reportcolumns"
                            bindLabel="name"
                            bindValue="code"
                            :preSelected="result"
                            :hasSearch="true"
                            @onVSelect="setResult"
                            style="width: 100% !important"
                          />
                        </CCol>
                      </CRow> -->
              </CModalBody>
              <CModalFooter>
                <CButton
                  type="submit"
                  @click="resetFilters"
                  class="btn btn-primary"
                  >Reset</CButton
                >
                <CButton @click="applyFilters" class="btn btn-success"
                  >Apply Filters</CButton
                >
              </CModalFooter>
            </CModal>
          </CCol>
        </CRow>
  
        <!-- Table to show reports -->
        <div class="table-div">
          <CTable id="report-table" bordered class="table table-striped">
            <CTableHead color="secondary">
              <CTableRow
                class="text-caption"
                style="text-align: center; vertical-align: top"
              >
                <CTableHeaderCell color="secondary">Actions</CTableHeaderCell>
                <CTableHeaderCell color="secondary">User Name</CTableHeaderCell>
  
                <CTableHeaderCell color="secondary"
                  >Market Visit Date</CTableHeaderCell
                >
  
                <CTableHeaderCell color="secondary">State</CTableHeaderCell>
                <CTableHeaderCell color="secondary">District</CTableHeaderCell>
                <CTableHeaderCell color="secondary">Town</CTableHeaderCell>
  
                <!-- <CTableHeaderCell color="secondary">SKU</CTableHeaderCell> -->
                <!-- <CTableHeaderCell color="secondary"
                  >Wholesaler Outlet Name</CTableHeaderCell
                >
                <CTableHeaderCell color="secondary">Beat ID</CTableHeaderCell>
                <CTableHeaderCell color="secondary"
                  >Wholesaler Outlet ID</CTableHeaderCell
                > -->
                <CTableHeaderCell color="secondary">Sales Channel Category</CTableHeaderCell>
                <CTableHeaderCell color="secondary">Channel Partner Name</CTableHeaderCell>
  
                <CTableHeaderCell color="secondary">Brand Name</CTableHeaderCell>
                <!-- <CTableHeaderCell color="secondary">MRP</CTableHeaderCell> -->
                <CTableHeaderCell color="secondary">Net Weight</CTableHeaderCell>
                <CTableHeaderCell color="secondary"
                  >PKD (DD-MM-YYYY)</CTableHeaderCell
                >
  
                <!-- <CTableHeaderCell color="secondary"
                  >Effective Consumer Price</CTableHeaderCell
                > -->
                <!-- <CTableHeaderCell color="secondary">IC per MC</CTableHeaderCell>
                <CTableHeaderCell color="secondary">Units in IC</CTableHeaderCell>
                <CTableHeaderCell color="secondary">IC WLP</CTableHeaderCell>
                <CTableHeaderCell color="secondary">IC RLP</CTableHeaderCell> -->
                <!-- <CTableHeaderCell color="secondary"
                  >Retail Scheme</CTableHeaderCell
                > -->
                <!-- <CTableHeaderCell color="secondary"
                  >Wholesale Scheme</CTableHeaderCell
                > -->
                <CTableHeaderCell color="secondary"
                  >Form Submission Timestamp</CTableHeaderCell
                >
                <!-- <CTableHeaderCell color="secondary"
                        >Additional Info 1</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Additional Info 2</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Image 1 URL</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Image 2 URL</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Image 3 URL</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Image 4 URL</CTableHeaderCell
                      >
                      <CTableHeaderCell color="secondary"
                        >Image 5 URL</CTableHeaderCell
                      > -->
              </CTableRow>
            </CTableHead>
            <CTableBody class="text-caption">
              <CTableRow v-for="form in paginatedReports" :key="form.id">
                <CTableDataCell>
                  <span class="icon-group">
                    <font-awesome-icon
                    class="cursor-pointer"
                      icon="eye"
                      @click="showEntry(form)"
                      title="View"
                    />
  
                    <font-awesome-icon
                    class="cursor-pointer"
                      icon="trash"
                      @click="confirmDeleteEntry(form)"
                      title="Delete"
                    />
                    <font-awesome-icon
                    class="cursor-pointer"
                      icon="download"
                      @click="downloadImages(form)"
                      title="Download Images"
                    />
                  </span>
                </CTableDataCell>
  
                <CTableDataCell>{{ form.username }}</CTableDataCell>
                <CTableDataCell>{{
                  formattedDate(form.date, "DD-MMM-yyyy")
                }}</CTableDataCell>
  
                <CTableDataCell>{{ form.State_Name }}</CTableDataCell>
                <CTableDataCell>{{ form.District_Name }}</CTableDataCell>
                <CTableDataCell>{{ form.Town_Name }}</CTableDataCell>
                <!-- <CTableDataCell>{{ form.sku }}</CTableDataCell> -->
                <!-- <CTableDataCell>{{ form.wholesaler_outlet_name }}</CTableDataCell>
                <CTableDataCell>{{ form.beat_id }}</CTableDataCell>
                <CTableDataCell>{{ form.wholesaler_id }}</CTableDataCell> -->
                <CTableDataCell>{{ form.sales_channel}}</CTableDataCell>
                <CTableDataCell>{{ form.channel_partner_name }}</CTableDataCell>
                <CTableDataCell>{{ form.Brand_Name }}</CTableDataCell>
                <!-- <CTableDataCell>{{ form.mrp }}</CTableDataCell> -->
                <CTableDataCell>{{ form.net_weight }}</CTableDataCell>
                <CTableDataCell>{{
                  formattedDate(form.pkd_date, "DD-MMM-yyyy")
                }}</CTableDataCell>
  
                <!-- <CTableDataCell>{{ form.consumer_price }}</CTableDataCell> -->
                <!-- <CTableDataCell>{{ form.ic_per_mc }}</CTableDataCell>
                <CTableDataCell>{{ form.units_in_ic }}</CTableDataCell>
                <CTableDataCell>{{ form.ic_wlp }}</CTableDataCell>
                <CTableDataCell>{{ form.ic_rlp }}</CTableDataCell> -->
                <!-- <CTableDataCell>{{ form.retail_scheme }}</CTableDataCell> -->
                <!-- <CTableDataCell>{{ form.wholesale_scheme }}</CTableDataCell> -->
                <CTableDataCell>{{
                  formattedDate(form.submission_timestamp, "DD-MMM-yy hh:mm a")
                }}</CTableDataCell>
                <!-- <CTableDataCell>{{ form.additional_info_1 }}</CTableDataCell>
                      <CTableDataCell>{{ form.additional_info_2 }}</CTableDataCell>
                      <CTableDataCell>{{ form.image1_url }}</CTableDataCell>
                      <CTableDataCell>{{ form.image2_url }}</CTableDataCell>
                      <CTableDataCell>{{ form.image3_url }}</CTableDataCell>
                      <CTableDataCell>{{ form.image4_url }}</CTableDataCell>
                      <CTableDataCell>{{ form.image5_url }}</CTableDataCell> -->
              </CTableRow>
            </CTableBody>
          </CTable>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </CCol>
    </CRow>
  
    <!-- Pagination buttons -->
    <div class="pagination">
      <CCol :sm="6">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn m-2">
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
    <!-- View Form Modal -->
    <CModal
      :visible="showViewModal"
      @close="showViewModal = false"
      class="view-form-modal"
    >
      <CModalHeader>
        <h5>Data Form</h5>
      </CModalHeader>
      <CModalBody class="bg">
        <CRow>
          <CCol md="4">
            <CFormLabel>Submission Timestamp:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="
                formattedDate(
                  selectedForm.submission_timestamp,
                  'DD-MMM-yyyy hh:mm a'
                )
              "
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
        <!-- <CRow class="mt-2">
                                            <CCol md="4">
                                                <CFormLabel>ID:</CFormLabel>
                                            </CCol>
                                            <CCol md="8">
                                                <CFormInput class="form-control" :value="selectedForm.id" readonly="true"  > </CFormInput>
                                            </CCol>
                                        </CRow> -->
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel>Date:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="formattedDate(selectedForm.date, 'DD-MMM-yyyy')"
              readonly="true"
            >
            </CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel>State:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.State_Name"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="district">District:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.District_Name"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="town">Town:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.Town_Name"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <!-- <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="wholesaler_outlet_name"
              >Wholesale Outlet Name:</CFormLabel
            >
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.wholesaler_outlet_name"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="beat_id">Beat ID</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.beat_id"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="wholesaler_id">Wholesaler ID</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.wholesaler_id"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->

        <CRow class="mt-2">
            <CCol md="4">
              <CFormLabel for="wholesaler_outlet_name"
                >Sales Channel Category</CFormLabel
              >
            </CCol>
            <CCol md="8">
              <CFormInput
                class="form-control"
                :value="selectedForm.sales_channel"
                readonly="true"
              ></CFormInput>
            </CCol>
          </CRow>
          
          <CRow class="mt-2">
            <CCol md="4">
              <CFormLabel for="wholesaler_outlet_name"
                >Channel Partner Name</CFormLabel
              >
            </CCol>
            <CCol md="8">
              <CFormInput
                class="form-control"
                :value="selectedForm.channel_partner_name"
                readonly="true"
              ></CFormInput>
            </CCol>
          </CRow>
  
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="brand-name">Brand Name:</CFormLabel>
          </CCol>
          <CCol :xs="9" md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.Brand_Name"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <!-- <CRow class="mt-3">
          <CCol md="4">
            <CFormLabel for="sku">SKU:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              class="form-control"
              :value="selectedForm.sku"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="net-weight">Net. Wt. (g):</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.net_weight"
              readonly="true"
            >
            </CFormInput>
          </CCol>
        </CRow>
        <!-- <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="mrp">MRP (₹):</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.mrp"
              readonly="true"
            >
            </CFormInput>
          </CCol>
        </CRow> -->
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="pkd-date">PKD (MMM/yyyy):</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="formattedDate(selectedForm.pkd_date, 'MMM/yyyy')"
              readonly="true"
            >
            </CFormInput>
          </CCol>
        </CRow>
  
        <!-- <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="effective-consumer-price"
              >Effective Consumer Price (₹):</CFormLabel
            >
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.consumer_price"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->
  
        <!-- <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="units-in-ic">Units in IC:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.units_in_ic"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
  
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="ic-rlp">IC RLP (₹):</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.ic_rlp"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->
  
        <!-- <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="retail-scheme">Retail Scheme:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.retail_scheme"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="wholesale-scheme">Wholesale Scheme:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.wholesale_scheme"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow>
        <CRow class="mt-2">
          <CCol md="4">
            <CFormLabel for="additionalInfo1">Additional info 1 </CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormTextarea
              class="form-control"
              :value="selectedForm.additional_info_1"
              readonly="true"
            ></CFormTextarea>
          </CCol>
        </CRow>
        <!-- <CRow class="mt-3">
          <CCol md="4">
            <CFormLabel for="additionalInfo2">Additional info 2:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput
              type="text"
              class="form-control"
              :value="selectedForm.additional_info_2"
              readonly="true"
            ></CFormInput>
          </CCol>
        </CRow> -->
  
        <CRow class="mt-2">
          <CCol :xs="12" md="4" class="mt-2" v-if="selectedForm.image1_url">
            <ExpandableImage
              :src="getImageUrl(selectedForm.image1_url)"
              alt="Image 1"
            />
            <CCardBody>
              <CCardTitle>Image 1</CCardTitle>
            </CCardBody>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="selectedForm.image2_url">
            <ExpandableImage
              :src="getImageUrl(selectedForm.image2_url)"
              alt="Image 2"
            />
            <CCardBody>
              <CCardTitle>Image 2</CCardTitle>
            </CCardBody>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="selectedForm.image3_url">
            <ExpandableImage
              :src="getImageUrl(selectedForm.image3_url)"
              alt="Image 3"
            />
            <CCardBody>
              <CCardTitle>Image 3</CCardTitle>
            </CCardBody>
          </CCol>
        </CRow>
        <CRow>
          <CCol :xs="12" md="4" class="mt-2" v-if="selectedForm.image4_url">
            <ExpandableImage
              :src="getImageUrl(selectedForm.image4_url)"
              alt="Image 4"
            />
            <CCardBody>
              <CCardTitle>Image 4</CCardTitle>
            </CCardBody>
          </CCol>
          <CCol :xs="12" md="4" class="mt-2" v-if="selectedForm.image5_url">
            <ExpandableImage
              :src="getImageUrl(selectedForm.image5_url)"
              alt="Image 5"
            />
            <CCardBody>
              <CCardTitle>Image 5</CCardTitle>
            </CCardBody>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showViewModal = false">Close</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script>
  import { CFormLabel } from "@coreui/vue";
  //import { Vue3MultiselectCheckboxed } from "vue3-multiselect-checkboxed";
  import "vue3-multiselect-checkboxed/style.css";
  import axios from "axios";
  import ExcelJS from "exceljs";
  import jsPDF from "jspdf";
  import "jspdf-autotable";
  import Datex from "../utils/common.js";
  import ExpandableImage from "./ExpandableImage.vue";
  export default {
    components: {
      ExpandableImage,
      CFormLabel,
    },
  
    data() {
      return {
        forms: [],
        errorMessage: "",
        //selectedStateToFilter: "",
        //selectedDistrictToFilter: "",
        tempReports: [],
        showViewModal: false,
        selectedForm: {},
        ReportData: [],
        reportFilters: {
          userName: "",
          type:"PKD",
          selectedMonth: "",
          selectedYear: "",
          fromDate: "",
          toDate: "",
          selectedBrand: "",
          selectedBrandId: null,
          selectedSKU: "",
          selectedState: "",
          selectedStateId: "",
          selectedDistrictId: "",
          enteredNetWeight: "",
          channel_partner_name:"",
        },
        visibleLiveDemo: false,
        // Pagination properties
        reportsPerPage: 20, // Number of reports per page
        currentPage: 1, // Current page number
  
        userNames: [],
        searchInput: "",
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
        states: [],
        districts: [],
        brands: [],
        skus: []
      };
    },
  
    mounted() {
      this.generateYearOptions();
      this.fetchUserNames();
      this.fetchStates();
      this.fetchBrands();
      this.fetchSkus();
      this.fetchReportData();
    },
    computed: {
      // Computed property to calculate the PKD date
      combinedPKDDate() {
        if (this.reportFilters.selectedMonth && this.reportFilters.selectedYear) {
          // Combine selected month and year to form PKD date
          return `${
            this.reportFilters.selectedYear
          }-${this.reportFilters.selectedMonth.toString().padStart(2, "0")}-01`;
        }
        return null; // Return null if either month or year is not selected
      },
      // Calculate the total number of pages based on reports length and reports per page
      totalPages() {
        return Math.ceil(this.ReportData.length / this.reportsPerPage);
      },
  
      // Calculate the starting index of the reports for the current page
      startIndex() {
        return (this.currentPage - 1) * this.reportsPerPage;
      },
  
      // Calculate the ending index of the reports for the current page
      endIndex() {
        return this.startIndex + this.reportsPerPage;
      },
  
      paginatedReports() {
        const filteredData = this.ReportData.filter((row) => {
          const fieldsToSearch = [
            row.username,
            row.State_Name,
            row.District_Name,
            row.Town_Name,
            row.Brand_Name,
            row.sku,
            row.net_weight,
            row.mrp,
            row.retail_scheme,
            row.wholesale_scheme,
            row.type,
          ];
  
          const lowercaseSearchInput = this.searchInput.toLowerCase();
          if (!lowercaseSearchInput) return true;
          const matchFound = fieldsToSearch.some(
            (field) =>
              field == null ||
              field.toString().toLowerCase().includes(lowercaseSearchInput)
          );
  
          return matchFound;
        });
  
        const startIndex = (this.currentPage - 1) * this.reportsPerPage;
  
        return filteredData.slice(startIndex, startIndex + this.reportsPerPage);
      },
    },
  
    methods: {
      async downloadImages(form) {
        try {
          const response = await axios.get(
            `${process.env.VUE_APP_ROOT_API}/api/download/${form.id}`,
            {
              responseType: "blob",
            }
          );
  
          const zipBlob = response.data;
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(zipBlob);
          downloadLink.download = `${form.username}_${form.Brand_Name}_${form.sku}_${form.State_Name}_${form.District_Name}_${form.Town_Name}_images.zip`;
          downloadLink.click();
        } catch (error) {
          console.error("Error downloading images:", error);
        }
      },
  
      setFromDate(event) {
        const selectedDate = new Date(event.target.value);
        this.reportFilters.fromDate = `${selectedDate.getFullYear()}-${(
          selectedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${selectedDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
      },
      async confirmDeleteEntry(form) {
        const shouldDelete = confirm(
          "Are you sure you want to delete this entry?"
        );
        if (shouldDelete) {
          await this.deleteEntry(form);
        }
      },
      async deleteEntry(form) {
        try {
          const response = await axios.delete(
            process.env.VUE_APP_ROOT_API + `/api/delete-entry/${form.id}`
          );
  
          if (response && response.data && response.data.success) {
            this.$toast.success(`Successfully deleted entry with ID: ${form.id}`);
            this.fetchReportData();
          } else {
            this.$toast.error(`Error deleting entry with ID: ${form.id}`);
          }
        } catch (error) {
          console.error("Error deleting entry:", error);
          this.$toast.error("An error occurred. Please try again later.");
        }
      },
  
      setToDate(event) {
        const selectedDate = new Date(event.target.value);
        this.reportFilters.toDate = `${selectedDate.getFullYear()}-${(
          selectedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${selectedDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
      },
      formattedDate(val, format) {
        return Datex.formattedDate(val, format);
      },
      showEntry(form) {
        this.selectedForm = form;
        this.showViewModal = true;
      },
      getImageUrl(imageUrl) {
        return process.env.VUE_APP_ROOT_API + `${imageUrl}`;
      },
  
      closeViewModal() {
        this.selectedForm = {};
        this.showViewModal = false;
      },
      async resetFilters() {
        this.reportFilters = {
          userName: "",
          type:"Wholesaler",
          selectedMonth: "",
          selectedYear: "",
          selectedBrand: "",
          selectedSKU: "",
          selectedState: "",
          selectedStateId: "",
          selectedDistrictId: "",
        };
        this.selectedStateToFilter = "";
        //this.fetchReportData();
        this.applyFilters();
      },
      onBrandChange() {
      const selectedBrand = this.brands.find(
        (brand) => brand.name === this.reportFilters.selectedBrand
      );
      this.reportFilters.selectedBrandId = selectedBrand ? selectedBrand.id : null;
      this.applyFilters();
    },
      async applyFilters() {
          console.log(this.reportFilters);
          this.visibleLiveDemo = false;
          this.reportFilters.pkdDate = this.combinedPKDDate;
          this.reportFilters.fromDate = this.reportFilters.fromDate || "";
          this.reportFilters.toDate = this.reportFilters.toDate || "";
      //   console.log(this.ReportData);
      //   const newData = this.ReportData.filter((report) => {
      //     let reportDate = new Date(
      //       report.date.toString().split("T")[0]
      //     ).getTime();
      //     let fromDate = new Date(this.reportFilters.fromDate).getTime();
      //     let toDate = new Date(this.reportFilters.toDate).getTime();
      //     console.log(
      //       parseFloat(report.net_weight),
      //       parseFloat(this.reportFilters.enteredNetWeight)
      //     );
      //     let reportItemNetWeight = parseFloat(report.net_weight);
      //     return (
      //       (this.reportFilters.userName.toString() ==
      //         report.username.toString() ||
      //         this.reportFilters.userName.toString() == "") &&
      //       (this.selectedStateToFilter.toString() ==
      //         report.State_Name.toString() ||
      //         this.selectedStateToFilter.toString() == "") &&
      //       (this.selectedDistrictToFilter.toString() ==
      //         report.District_Name.toString() ||
      //         this.selectedDistrictToFilter.toString() == "") &&
      //       ((fromDate < reportDate && reportDate < toDate) ||
      //         this.reportFilters.fromDate.toString() == "" ||
      //         this.reportFilters.toDate.toString() == "") &&
      //       (report.Brand_Name == this.reportFilters.selectedBrand ||
      //         this.reportFilters.selectedBrand.toString() == "") &&
      //       (reportItemNetWeight >=
      //         parseFloat(this.reportFilters.enteredNetWeight) ||
      //         this.reportFilters.enteredNetWeight == "")
      //     );
      //   });
  
      //   console.log(newData);
      //   this.ReportData = newData;
        // const newData1 = this.ReportData.filter((report) => {
        //   if(this.reportFilters.userName == report.)
        // })
        try {
          console.log(this.reportFilters);
          const response = await axios.post(
            process.env.VUE_APP_ROOT_API + "/api/report-data-filter",
            this.reportFilters
          );
          console.log(response.data);
          this.ReportData = response.data;
        } catch (error) {
          console.error("Error fetching report data:", error);
        }
      },
      async fetchReportData() {
        try {
          this.applyFilters();
          // const response = await axios.post(
          //   process.env.VUE_APP_ROOT_API + "/api/report-data",
          //   {type:"Retailer"}
          // );
          // this.ReportData = response.data;
        } catch (error) {
          console.error("Error fetching report data:", error);
        }
      },
      
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      generateYearOptions() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 2000; year--) {
          this.years.push(year);
        }
      },
      fetchUserNames() {
        axios
          .get(process.env.VUE_APP_ROOT_API + "/api/usernames")
          .then((response) => {
            this.userNames = response.data;
          })
          .catch((error) => {
            console.error("Error fetching user names:", error);
          });
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
        console.log(
          "Fetching districts with state:",
          this.reportFilters.selectedStateId
        );
        axios
          .get(
            process.env.VUE_APP_ROOT_API +
              `/api/districts?state=${this.reportFilters.selectedStateId}`
          )
          .then((response) => {
            console.log("Districts response:", response.data);
            this.districts = response.data;
          })
          .catch((error) => {
            console.error("Error fetching districts:", error);
          });
      },
      fetchBrands() {
      axios
        .get(process.env.VUE_APP_ROOT_API + "/api/brandsname")
        .then((response) => {
          this.brands = response.data.map((brand) => ({
            name: brand.Brand_Name,
            id: brand.Brand_ID,
          }));
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
      async exportToExcel() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");
        //
        worksheet.columns = [
          {
            header: "Market Visit Date",
            key: "date",
            width: 20,
          },
          {
            header: "User Name",
            key: "username",
            width: 20,
          },
          {
            header: "State Name",
            key: "State_Name",
            width: 20,
          },
          {
            header: "District Name",
            key: "District_Name",
            width: 20,
          },
          {
            header: "Town Name",
            key: "Town_Name",
            width: 20,
          },
        //   {
        //     header: "Wholesaler Outlet Name",
        //     key: "Wholesaler_Outlet_Name",
        //     width: 20,
        //   },
        //   {
        //     header: "Beat ID",
        //     key: "beat_id",
        //     width: 20,
        //   },
        //   {
        //     header: "Wholesaler Outlet ID",
        //     key: "wholesaler_id",
        //     width: 20,
        //   },
        {
            header: "Sales Channel Category",
            key: "sales_channel",
            width: 20,
          },
          {
            header: "Channel Partner Name:",
            key: "channel_partner_name",
            width: 20,
          },
  
          {
            header: "Brand Name",
            key: "Brand_Name",
            width: 20,
          },
          // {
          //   header: "SKU",
          //   key: "sku",
          //   width: 20,
          // },
          {
            header: "Net Wt",
            key: "net_weight",
            width: 20,
          },
          // {
          //   header: "MRP",
          //   key: "mrp",
          //   width: 20,
          // },
          {
            header: "PKD Date",
            key: "pkd_date",
            width: 20,
          },
          // {
          //   header: "Consumer Price",
          //   key: "consumer_price",
          //   width: 20,
          // },
        //   {
        //     header: "IC per MC",
        //     key: "ic_per_mc",
        //     width: 20,
        //   },
        //   {
        //     header: "Unit In IC",
        //     key: "units_in_ic",
        //     width: 20,
        //   },
        //   {
        //     header: "IC WLP",
        //     key: "ic_wlp",
        //     width: 20,
        //   },
        //   {
        //     header: "IC RLP",
        //     key: "ic_rlp",
        //     width: 20,
        //   },
          // {
          //   header: "Retail Scheme",
          //   key: "retail_scheme",
          //   width: 20,
          // },
          //{
          //  header: "Wholesale Scheme",
          //  key: "wholesale_scheme",
          //  width: 20,
          //},
          {
            header: "Additional Info",
            key: "additional_info_1",
            width: 20,
          },
          // {
          //   header: "Additional Info2",
          //   key: "additional_info_2",
          //   width: 20,
          // },
          {
            header: "Latitude",
            key: "latitude",
            width: 20,
          },
          {
            header: "Longitude",
            key: "longitude",
            width: 20,
          },
          {
            header: "Image 1",
            key: "image1_url",
            width: 20,
          },
          {
            header: "Image 2",
            key: "image2_url",
            width: 20,
          },
          {
            header: "Image 3",
            key: "image3_url",
            width: 20,
          },
          {
            header: "Image 4",
            key: "image4_url",
            width: 20,
          },
          {
            header: "Image 5",
            key: "image5_url",
            width: 20,
          },
          {
            header: "Submission TimeStamp",
            key: "submission_timestamp",
            width: 20,
          },
        ];
  
        var rows = this.ReportData.map((row) => {
          return {
            date: this.formattedDate(row["date"], "DD-MMM-yyyy"),
            username: row["username"],
            State_Name: row["State_Name"],
            District_Name: row["District_Name"],
            Town_Name: row["Town_Name"],
            Brand_Name: row["Brand_Name"],
            Wholesaler_Outlet_Name: row["wholesaler_outlet_name"],
            beat_id: row["beat_id"],
            wholesaler_id: row["wholesaler_id"],
            sales_channel:row["sales_channel"],
            channel_partner_name:row["channel_partner_name"],

            // sku: row["sku"],
            net_weight: row["net_weight"],
            // mrp: row["mrp"],
            pkd_date: this.formattedDate(row["pkd_date"], "DD-MMM-yyyy"),
            // consumer_price: row["consumer_price"],
            ic_per_mc: row["ic_per_mc"],
            units_in_ic: row["units_in_ic"],
            ic_wlp: row["ic_wlp"],
            ic_rlp: row["ic_rlp"],
            retail_scheme: row["retail_scheme"],
            wholesale_scheme: row["wholesale_scheme"],
            additional_info_1: row["additional_info_1"],
            additional_info_2: row["additional_info_2"],
            latitude: row["latitude"],
            longitude: row["longitude"],
            image1_url: row["image1_url"]
              ? process.env.VUE_APP_ROOT_API + row["image1_url"]
              : "",
            image2_url: row["image2_url"]
              ? process.env.VUE_APP_ROOT_API + row["image2_url"]
              : "",
            image3_url: row["image3_url"]
              ? process.env.VUE_APP_ROOT_API + row["image3_url"]
              : "",
            image4_url: row["image4_url"]
              ? process.env.VUE_APP_ROOT_API + row["image4_url"]
              : "",
            image5_url: row["image5_url"]
              ? process.env.VUE_APP_ROOT_API + row["image5_url"]
              : "",
            submission_timestamp: this.formattedDate(
              row["submission_timestamp"],
              "DD-MMM-yyy hh:mm a"
            ),
          };
        });
        worksheet.addRows(rows);
        worksheet.eachRow(function (row, rownumber) {
          if (rownumber == 1) {
            row.eachCell(function (cell) {
              cell.border = {
                top: {
                  style: "thin",
                },
                left: {
                  style: "thin",
                },
                bottom: {
                  style: "thin",
                },
                right: {
                  style: "thin",
                },
              };
              cell.font = {
                bold: true,
              };
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: "F08080",
                },
              };
            });
          } else {
            row.eachCell(function (cell) {
              cell.border = {
                top: {
                  style: "thin",
                },
                left: {
                  style: "thin",
                },
                bottom: {
                  style: "thin",
                },
                right: {
                  style: "thin",
                },
              };
            });
          }
        });
        // Generate the Excel file
        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(new Blob([blob]));
  
        // Trigger file download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "report.xlsx";
        a.click();
  
        // Clean up
        URL.revokeObjectURL(blobUrl);
      },
      async exportToPDF() {
        const doc = new jsPDF();
  
        // Add headers to the PDF table
        const headers = Object.keys(this.ReportData[0]);
        const data = this.ReportData.map((row) => Object.values(row));
  
        doc.autoTable({
          head: [headers],
          body: data,
        });
  
        // Save the PDF file
        doc.save("report.pdf");
      },
      onStateChange() {
          console.log(this.reportFilters.selectedStateId)
        //console.log(this.states[5]["State_Name"]);
        //this.selectedStateToFilter =
        //  this.states[this.reportFilters.selectedState - 1]["State_Name"];
        this.selectedDistrict = null; // Reset the selected district when the state changes
        this.selectedTown = null; // Reset the selected town when the state changes
        this.fetchDistricts();
        //this.reportFilters.selectedState= this.reportFilters.selectedState.State_ID;
        //console.log(this.reportFilters);
      },
      onDistrictChange() {
        // console.log(this.reportFilters.selectedDistrict);
        // console.log(this.districts);
        this.selectedDistrictToFilter = this.reportFilters.selectedDistrict;
      },
    },
  };
  </script>
  
  <style>
  .error-message {
    color: red;
    margin-top: 10px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .text-caption {
    font-size: 0.8rem !important;
  }
  
  .table-div {
    overflow-x: auto;
    max-width: 100%;
  }
  
  .pagination button {
    font-size: 14px;
    padding: 6px 10px;
  }
  
  .bg {
    background-color: #f4fff2;
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
  
  .img {
    max-width: 100%;
    max-height: 100px;
    display: block;
    margin: auto;
  }
  
  .view-form-modal .modal-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .ml-3 {
    margin-left: 3px;
  }
  
  .icon-group {
    display: flex;
    gap: 10px;
  }
  .text-right {
    float: right;
  }
  </style>
  