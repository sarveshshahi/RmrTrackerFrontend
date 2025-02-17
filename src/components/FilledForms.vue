<template>
  <div class="user-container">
    <!-- Display list of users -->
    <CRow>
      <CCol :sm="12">
        <CRow class="mb-4">
          <CCol :xs="12" :md="7">
            <!-- <CButtonGroup class="mb-3"> -->
            <CButton class="btn btn-success" @click="navigateToAddForm"
              >Add Retailer Data</CButton
            >

            <CButton
              class="btn btn-success ms-2"
              @click="navigateToAddWholesalerForm"
              >Add Wholesaler Data
            </CButton>
            <CButton @click="navigateToAddPKDForm" class="btn btn-success ms-2"
              >Add PKD Data</CButton
            >
            <!-- </CButtonGroup> -->
          </CCol>
          <!-- <CCol :xs="12" :md="5">
            <CRow>
              <CCol :xs="9" class="px-0">
                <input
                  class="form-control"
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search By State/District/Town/Brand/SKU/MRP"
                />
              </CCol>
              <CCol :xs="3">
                <CButton color="btn btn-dark">
                  <font-awesome-icon icon="magnifying-glass" />
                </CButton>
              </CCol>
            </CRow>
          </CCol> -->
        </CRow>

        <div class="table-div">
          <CTable bordered class="table table-striped">
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

                <CTableHeaderCell color="secondary"
                  >Brand Name</CTableHeaderCell
                >
                <CTableHeaderCell color="secondary">Net Wt</CTableHeaderCell>
                <CTableHeaderCell color="secondary">MRP</CTableHeaderCell>
                <CTableHeaderCell color="secondary"
                  >Submission Timestamp</CTableHeaderCell
                >
                <CTableHeaderCell color="secondary"
                  >Sales Channel Category</CTableHeaderCell
                >
                <CTableHeaderCell color="secondary">
                  Channel Partner Name</CTableHeaderCell
                >
                <CTableHeaderCell color="secondary">Type</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody class="text-caption">
              <CTableRow v-for="form in filteredForms" :key="form.id">
                <CTableDataCell>
                  <span class="icon-container">
                    <font-awesome-icon
                      class="cursor-pointer"
                      icon="eye"
                      @click="openViewModal(form)"
                      title="View"
                    />

                    <font-awesome-icon
                      class="cursor-pointer"
                      icon="edit"
                      @click="openEditModal(form.id)"
                      title="Edit"
                      :class="{ disabled: !canEdit }"
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
                <CTableDataCell>{{ form.Brand_Name }}</CTableDataCell>
                <CTableDataCell>{{ form.net_weight }}</CTableDataCell>
                <CTableDataCell>{{ form.mrp }}</CTableDataCell>

                <CTableDataCell>
                  {{
                    form.submission_timestamp
                      ? convertToISTTimestamp(form.submission_timestamp)
                      : "No Submission Timestamp"
                  }}
                </CTableDataCell>
                <CTableDataCell>{{ form.sales_channel }}</CTableDataCell>
                <CTableDataCell>{{ form.channel_partner_name }}</CTableDataCell>
                <CTableDataCell>{{ form.type }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>

        <!-- Retailer Edit Form Modal -->
        <CModal
          :visible="showEditModal"
          @close="showEditModal = false"
          class="edit-form-modal"
        >
          <CModalHeader>
            <CModalTitle>Retailer Edit Form</CModalTitle>
          </CModalHeader>

          <CModalBody class="bg">
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
                  <option disabled value="">Select a State</option>
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
                  <option disabled value="">Select a District</option>
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
                  <option disabled value="">Select a Town</option>
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

            <!-- <CRow class="mt-2">
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
                  <option disabled value="">Select a brand</option>
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3">
                <button @click="addBrand" class="btn btn-success">
                  Add&nbsp;Brand
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
                  <option disabled value="">Select an SKU</option>
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
            </CRow> -->

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
                  <!-- <option value="Other">Others</option> -->
                </select>
              </CCol>
            </CRow>

            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="specify-brand">Specify Brand:</CFormLabel>
              </CCol>
              <CCol :xs="6">
                <CFormInput
                  v-model="specifiedBrand"
                  placeholder="Specify Brand"
                  type="text"
                  class="form-control"
                  @input="updateBrandName"
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
                  v-model="editedForm.net_weight"
                  placeholder="Enter Net Weight"
                  type="text"
                  class="form-control"
                  @input="updateNetWeight"
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
                <select
                  v-model="editedForm.net_weight"
                  class="form-select"
                  required
                >
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
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_day" class="form-select">
                  <option value="" disabled>Select a Day</option>
                  <option v-for="day in days" :value="day" :key="day">
                    {{ day }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_month" class="form-select">
                  <option value="" disabled>Select a Month</option>
                  <option v-for="month in months" :value="month" :key="month">
                    {{ month }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="6" md="3">
                <select v-model="editedForm.pkd_year" class="form-select">
                  <option value="" disabled>Select a Year</option>
                  <option v-for="year in years" :value="year" :key="year">
                    {{ year }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="effective-consumer-price"
                  >Effective Consumer Price (₹):<span style="color: red"
                    >*</span
                  >
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
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="wholesale-scheme"
                  >Wholesale Scheme:</CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.wholesale_scheme"
                >
                </CFormInput>
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
                <CFormLabel for="additionalInfo2"
                  >Additional info 2:</CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.additional_info_2"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel>Edit Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="file"
                  @change="editImageField($event, selectedImages.length)"
                  class="form-control-file"
                ></CFormInput>
                <p class="text-muted mt-1">You can upload up to 5 images.</p>
                <p v-if="selectedImages.length >= 5" class="text-danger">
                  Only five images are allowed. If you wish to upload any other
                  new image then remove an existing image to upload a new one.
                </p>
                <div>
                  <h6>Uploaded Images</h6>

                  <div
                    class="form-group"
                    v-for="(imageElement, index) in imageElements"
                    :key="imageElement.key"
                  >
                    <!-- Use the index variable -->
                    <p>Image {{ index + 1 }}</p>
                    <img :src="imageElement.src" height="80" width="80" /><br />
                    <CButton
                      @click="removeImageField(index)"
                      class="btn btn-danger mt-1"
                    >
                      Remove
                    </CButton>
                  </div>
                </div>
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
                  >
                  </CFormInput>
                </CCol>
              </CRow>
            </div>
          </CModalBody>
          <CModalFooter>
            <CCol xs="12" class="mt-3" align="center">
              <CButton @click="saveEditedForm" class="btn btn-success"
                >Update</CButton
              >
            </CCol>
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </CModalFooter>
        </CModal>

        <!-- Wholesaler Edit Form Modal -->
        <CModal
          :visible="showWholesalerEditModal"
          @close="showWholesalerEditModal = false"
          class="edit-form-modal"
        >
          <CModalHeader>
            <CModalTitle>Wholesaler Edit Form</CModalTitle>
          </CModalHeader>

          <CModalBody class="bg">
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
                  <option disabled value="">Select a State</option>
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
                  <option disabled value="">Select a District</option>
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
                  v-model="editedForm.town"
                  class="form-select"
                  @change="onTownChange"
                >
                  <option disabled value="">Select a Town</option>
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

            <!-- TODO  -->
            <!-- make it showing wholesaler outlet options -->
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="outlet_name"
                  >Wholesaler Outlet Name:<span style="color: red"
                    >*</span
                  ></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <select
                  v-model="editedForm.wholesaler_outlet_name"
                  class="form-select"
                >
                  <option disabled value="">Select a Wholesaler</option>
                  <option
                    v-for="wholesaler in wholesalerOutlets"
                    :key="wholesaler.Wholesaler_Id"
                    :value="wholesaler.Wholesaler_Outlet_Name"
                  >
                    {{ wholesaler.Wholesaler_Outlet_Name }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="beat_id"
                  >Beat ID:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.beat_id"
                  @change="updateBeatId"
                  required
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="beat_id"
                  >Wholesaler ID:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.wholesaler_id"
                  @change="updateBeatId"
                  required
                >
                </CFormInput>
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
                  <!-- <option value="Other">Others</option> -->
                </select>
              </CCol>
            </CRow>

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
                  @input="updateBrandName"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight">Net Weight2 (g):</CFormLabel>
              </CCol>
              <CCol :xs="9">
                <CFormInput
                  v-model="editedForm.net_weight"
                  placeholder="Enter Net Weight"
                  type="text"
                  class="form-control"
                  @input="updateNetWeight"
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
                <select
                  v-model="editedForm.net_weight"
                  class="form-select"
                  required
                >
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
                  >PKD (MM/yyyy):<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_day" class="form-select">
                  <option value="" disabled>Select a Day</option>
                  <option v-for="day in days" :value="day" :key="day">
                    {{ day }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_month" class="form-select">
                  <option value="" disabled>Select a Month</option>
                  <option v-for="month in months" :value="month" :key="month">
                    {{ month }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="6" md="3">
                <select v-model="editedForm.pkd_year" class="form-select">
                  <option value="" disabled>Select a Year</option>
                  <option v-for="year in years" :value="year" :key="year">
                    {{ year }}
                  </option>
                </select>
              </CCol>
            </CRow>

            <!-- <CRow class="mt-2">
                <CCol md="3">
                  <CFormLabel for="effective-consumer-price"
                    >Effective Consumer Price (₹):<span style="color: red"
                      >*</span
                    >
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
              </CRow> -->

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="ic_per_mc"
                  >IC per MC:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.ic_per_mc"
                  required
                  pattern="^-?\d+(\.\d{1,2})?$"
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
                <CFormLabel for="units-in-ic"
                  >IC WLP:<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.ic_wlp"
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

            <!-- <CRow class="mt-2">
                <CCol md="3">
                  <CFormLabel for="retail-scheme">Retail Scheme:</CFormLabel>
                </CCol>
                <CCol md="9">
                  <CFormInput
                    type="text"
                    class="form-control"
                    v-model="editedForm.retail_scheme"
                  >
                  </CFormInput>
                </CCol>
              </CRow> -->
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="wholesale-scheme"
                  >Wholesale Scheme:</CFormLabel
                >
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="text"
                  class="form-control"
                  v-model="editedForm.wholesale_scheme"
                >
                </CFormInput>
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
            <!-- <CRow class="mt-3">
                <CCol md="3">
                  <CFormLabel for="additionalInfo2"
                    >Additional info 2:</CFormLabel
                  >
                </CCol>
                <CCol md="9">
                  <CFormInput
                    type="text"
                    class="form-control"
                    v-model="editedForm.additional_info_2"
                  >
                  </CFormInput>
                </CCol>
              </CRow> -->
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel>Edit Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="file"
                  @change="editImageField($event, selectedImages.length)"
                  class="form-control-file"
                ></CFormInput>
                <p class="text-muted mt-1">You can upload up to 5 images.</p>
                <p v-if="selectedImages.length >= 5" class="text-danger">
                  Only five images are allowed. If you wish to upload any other
                  new image then remove an existing image to upload a new one.
                </p>
                <div>
                  <h6>Uploaded Images</h6>

                  <div
                    class="form-group"
                    v-for="(imageElement, index) in imageElements"
                    :key="imageElement.key"
                  >
                    <!-- Use the index variable -->
                    <p>Image {{ index + 1 }}</p>
                    <img :src="imageElement.src" height="80" width="80" /><br />
                    <CButton
                      @click="removeImageField(index)"
                      class="btn btn-danger mt-1"
                    >
                      Remove
                    </CButton>
                  </div>
                </div>
              </CCol>
            </CRow>

            <!-- <CRow class="mt-2">
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
                    >
                    </CFormInput>
                  </CCol>
                </CRow>
              </div> -->
          </CModalBody>
          <CModalFooter>
            <CCol xs="12" class="mt-3" align="center">
              <CButton @click="saveEditedForm" class="btn btn-success"
                >Update</CButton
              >
            </CCol>
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </CModalFooter>
        </CModal>
        <!-- Retailer View Form Modal -->
        <CModal
          :visible="showViewModal"
          @close="showViewModal = false"
          class="view-form-modal"
        >
          <CModalHeader>
            <h5>Retailer View Form</h5>
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
                <CFormLabel>Select State:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.State_Name"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="district">Select District:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.District_Name"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="town">Select Town:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.Town_Name"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
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
            <CRow class="mt-2">
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
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="pkd-date">PKD (DD-MMM-yyyy):</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="formattedDate(selectedForm.pkd_date, 'DD-MMM-yyyy')"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
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
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="units-in-ic">Units in IC:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.units_in_ic"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="retail-scheme">Retail Scheme:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.retail_scheme"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="wholesale-scheme"
                  >Wholesale Scheme:</CFormLabel
                >
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.wholesale_scheme"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="additionalInfo1"
                  >Additional info 1
                </CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormTextarea
                  class="form-control"
                  :value="selectedForm.additional_info_1"
                  readonly="true"
                >
                </CFormTextarea>
              </CCol>
            </CRow>
            <CRow class="mt-3">
              <CCol md="4">
                <CFormLabel for="additionalInfo2"
                  >Additional info 2:</CFormLabel
                >
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.additional_info_2"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Latitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.latitude"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Longitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.longitude"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
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
            <CButton color="secondary" @click="showViewModal = false"
              >Close</CButton
            >
          </CModalFooter>
        </CModal>

        <!-- Wholesaler View Form Modal -->
        <CModal
          :visible="showWholesalerViewModal"
          @close="showWholesalerViewModal = false"
          class="view-form-modal"
        >
          <CModalHeader>
            <h5>Wholesaler View Form</h5>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="wholesaler-outlet-name"
                  >Wholesaler Outlet Name:</CFormLabel
                >
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.wholesaler_outlet_name"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="beat-id">Beat ID:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.beat_id"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="wholesaler-id">Wholesaler ID:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.wholesaler_id"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                <CFormLabel for="pkd-date">PKD (DD-MMM-yyyy):</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="formattedDate(selectedForm.pkd_date, 'DD-MMM-yyyy')"
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

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="ic-per-mc">IC per MC:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.ic_per_mc"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="units-in-ic">Units in IC:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.units_in_ic"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="ic-wlp">IC WLP:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.ic_wlp"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
              </CCol>
            </CRow>

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
                <CFormLabel for="wholesale-scheme"
                  >Wholesale Scheme:</CFormLabel
                >
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.wholesale_scheme"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="additionalInfo1"
                  >Additional info 1
                </CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormTextarea
                  class="form-control"
                  :value="selectedForm.additional_info_1"
                  readonly="true"
                >
                </CFormTextarea>
              </CCol>
            </CRow>
            <!-- <CRow class="mt-3">
              <CCol md="4">
                <CFormLabel for="additionalInfo2"
                  >Additional info 2:</CFormLabel
                >
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
            <!-- <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Latitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.latitude"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Longitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.longitude"
                  readonly="true"
                >
                </CFormInput>
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
            <CButton color="secondary" @click="showWholesalerViewModal = false"
              >Close</CButton
            >
          </CModalFooter>
        </CModal>

        <!--PKD Edit Form Modal-->
        <CModal
          :visible="showPKDEditModal"
          @close="showPKDEditModal = false"
          class="edit-form-modal"
        >
          <CModalHeader>
            <CModalTitle>PKD Edit Form</CModalTitle>
          </CModalHeader>

          <CModalBody class="bg">
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
                  <option disabled value="">Select a State</option>
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
                  <option disabled value="">Select a District</option>
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
                  v-model="editedForm.town"
                  class="form-select"
                  @change="onTownChange"
                >
                  <option disabled value="">Select a Town</option>
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
                <CFormLabel for="salesChannel">
                  Sales Channel Category:<span style="color: red">*</span>
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <select
                  v-model="editedForm.sales_channel"
                  class="form-select"
                  @change="onSalesChannelChange"
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
                  v-model="editedForm.channel_partner_name"
                />
              </CCol>
            </CRow>

            <!-- TODO  -->
            <!-- make it showing wholesaler outlet options -->

            <!-- <CRow class="mt-2">
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
                  <option disabled value="">Select a brand</option>
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3">
                <button @click="addBrand" class="btn btn-success">
                  Add&nbsp;Brand
                </button>
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
            </CRow> -->

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
                  <!-- <option value="Other">Others</option> -->
                </select>
              </CCol>
            </CRow>

            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="specify-brand">Specify Brand:</CFormLabel>
              </CCol>
              <CCol :xs="6">
                <CFormInput
                  v-model="specifiedBrand"
                  placeholder="Specify Brand"
                  type="text"
                  class="form-control"
                  @input="updateBrandName"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight">Net Weight2 (g):</CFormLabel>
              </CCol>
              <CCol :xs="6">
                <CFormInput
                  v-model="editedForm.net_weight"
                  placeholder="Enter Net Weight"
                  type="text"
                  class="form-control"
                  @input="updateNetWeight"
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
                <select
                  v-model="editedForm.net_weight"
                  class="form-select"
                  required
                >
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
                  >PKD (MM/yyyy):<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_day" class="form-select">
                  <option value="" disabled>Select a Day</option>
                  <option v-for="day in days" :value="day" :key="day">
                    {{ day }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_month" class="form-select">
                  <option value="" disabled>Select a Month</option>
                  <option v-for="month in months" :value="month" :key="month">
                    {{ month }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="6" md="3">
                <select v-model="editedForm.pkd_year" class="form-select">
                  <option value="" disabled>Select a Year</option>
                  <option v-for="year in years" :value="year" :key="year">
                    {{ year }}
                  </option>
                </select>
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

            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel>Edit Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="file"
                  @change="editImageField($event, selectedImages.length)"
                  class="form-control-file"
                ></CFormInput>
                <p class="text-muted mt-1">You can upload up to 5 images.</p>
                <p v-if="selectedImages.length >= 5" class="text-danger">
                  Only five images are allowed. If you wish to upload any other
                  new image then remove an existing image to upload a new one.
                </p>
                <div>
                  <h6>Uploaded Images</h6>

                  <div
                    class="form-group"
                    v-for="(imageElement, index) in imageElements"
                    :key="imageElement.key"
                  >
                    <!-- Use the index variable -->
                    <p>Image {{ index + 1 }}</p>
                    <img :src="imageElement.src" height="80" width="80" /><br />
                    <CButton
                      @click="removeImageField(index)"
                      class="btn btn-danger mt-1"
                    >
                      Remove
                    </CButton>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CCol xs="12" class="mt-3" align="center">
              <CButton @click="saveEditedForm" class="btn btn-success"
                >Update</CButton
              >
            </CCol>
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </CModalFooter>
        </CModal>

        <!-- PKD View Form Modal -->
        <CModal
          :visible="showPKDViewModal"
          @close="showPKDViewModal = false"
          class="view-form-modal"
        >
          <CModalHeader>
            <h5>PKD View Form</h5>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="brand-name"
                  >Sales Channel Category:</CFormLabel
                >
              </CCol>
              <CCol :xs="9" md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.sales_channel"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>

            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="brand-name">Channel Partner Name:</CFormLabel>
              </CCol>
              <CCol :xs="9" md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.channel_partner_name"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                <CFormLabel for="pkd-date">PKD (DD-MMM-yyyy):</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="formattedDate(selectedForm.pkd_date, 'DD-MMM-yyyy')"
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
                <CFormLabel for="ic-per-mc">IC per MC:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.ic_per_mc"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
 
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="units-in-ic">Units in IC:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.units_in_ic"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
 
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="ic-wlp">IC WLP:</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.ic_wlp"
                  readonly="true"
                >
                </CFormInput>
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
                >
                </CFormInput>
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
            <!-- <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="wholesale-scheme"
                  >Wholesale Scheme:</CFormLabel
                >
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="selectedForm.wholesale_scheme"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow> -->
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="additionalInfo1"
                  >Additional info 1
                </CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormTextarea
                  class="form-control"
                  :value="selectedForm.additional_info_1"
                  readonly="true"
                >
                </CFormTextarea>
              </CCol>
            </CRow>
            <!-- <CRow class="mt-3">
              <CCol md="4">
                <CFormLabel for="additionalInfo2"
                  >Additional info 2:</CFormLabel
                >
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
            <!-- <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Latitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.latitude"
                  readonly="true"
                >
                </CFormInput>
              </CCol>
            </CRow>
            <CRow class="mt-2">
              <CCol md="4">
                <CFormLabel for="image">Longitude</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  class="form-control"
                  :value="selectedForm.longitude"
                  readonly="true"
                >
                </CFormInput>
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
            <CButton color="secondary" @click="showWholesalerViewModal = false"
              >Close</CButton
            >
          </CModalFooter>
        </CModal>

        <!--PKD View Form Modal-->
        <!-- <CModal
          :visible="showPKDEditModal"
          @close="showPKDEditModal = false"
          class="edit-form-modal"
        >
          <CModalHeader>
            <CModalTitle>PKD Edit Form</CModalTitle>
          </CModalHeader>
 
          <CModalBody class="bg">
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
                  <option disabled value="">Select a State</option>
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
                  <option disabled value="">Select a District</option>
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
                  v-model="editedForm.town"
                  class="form-select"
                  @change="onTownChange"
                >
                  <option disabled value="">Select a Town</option>
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
                <CFormLabel for="salesChannel">
                  Sales Channel Category:<span style="color: red">*</span>
                </CFormLabel>
              </CCol>
              <CCol md="9">
                <select
                  v-model="editedForm.sales_channel"
                  class="form-select"
                  @change="onSalesChannelChange"
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
                  v-model="editedForm.channel_partner_name"
                />
              </CCol>
            </CRow>
 
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="brand-name">Brand Name:<span style="color: red">*</span></CFormLabel>
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
                </select>
              </CCol>
            </CRow>
            
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
                  @input="updateBrandName"
                >
                </CFormInput>
              </CCol>
            </CRow>
            
            <CRow v-if="selectedBrand === 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight">Net Weight (g):</CFormLabel>
              </CCol>
              <CCol :xs="9">
                <CFormInput
                  v-model="editedForm.net_weight"
                  placeholder="Enter Net Weight"
                  type="text"
                  class="form-control"
                  @input="updateNetWeight"
                >
                </CFormInput>
              </CCol>
            </CRow>
            
 
            <CRow v-if="selectedBrand !== 'Others'" class="mt-2">
              <CCol md="3">
                <CFormLabel for="net-weight">Net. Wt. (g):<span style="color: red">*</span></CFormLabel>
              </CCol>
              <CCol md="9">
                <select v-model="editedForm.net_weight" class="form-select" required>
                  <option disabled value="">Select Net Weight</option>
                  <option v-for="netName in netNames" :key="netName" :value="netName">
                    {{ netName }}
                  </option>
                </select>
              </CCol>
            </CRow>
 
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel for="pkd-date"
                  >PKD (MM/yyyy):<span style="color: red">*</span></CFormLabel
                >
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_day" class="form-select">
                  <option value="" disabled>Select a Day</option>
                  <option v-for="day in days" :value="day" :key="day">
                    {{ day }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="3" md="3">
                <select v-model="editedForm.pkd_month" class="form-select">
                  <option value="" disabled>Select a Month</option>
                  <option v-for="month in months" :value="month" :key="month">
                    {{ month }}
                  </option>
                </select>
              </CCol>
              <CCol :xs="6" md="3">
                <select v-model="editedForm.pkd_year" class="form-select">
                  <option value="" disabled>Select a Year</option>
                  <option v-for="year in years" :value="year" :key="year">
                    {{ year }}
                  </option>
                </select>
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
 
            <CRow class="mt-2">
              <CCol md="3">
                <CFormLabel>Edit Images:</CFormLabel>
              </CCol>
              <CCol md="9">
                <CFormInput
                  type="file"
                  @change="editImageField($event, selectedImages.length)"
                  class="form-control-file"
                ></CFormInput>
                <p class="text-muted mt-1">You can upload up to 5 images.</p>
                <p v-if="selectedImages.length >= 5" class="text-danger">
                  Only five images are allowed. If you wish to upload any other
                  new image then remove an existing image to upload a new one.
                </p>
                <div>
                  <h6>Uploaded Images</h6>
 
                  <div
                    class="form-group"
                    v-for="(imageElement, index) in imageElements"
                    :key="imageElement.key"
                  >
                    <p>Image {{ index + 1 }}</p>
                    <img :src="imageElement.src" height="80" width="80" /><br />
                    <CButton
                      @click="removeImageField(index)"
                      class="btn btn-danger mt-1"
                    >
                      Remove
                    </CButton>
                  </div>
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CCol xs="12" class="mt-3" align="center">
              <CButton @click="saveEditedForm" class="btn btn-success"
                >Update</CButton
              >
            </CCol>
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </CModalFooter>
        </CModal> -->

        <!-- <CModal
          :visible="showPKDViewModal"
          @close="showPKDViewModal = false"
          class="view-form-modal"
        >
          <CModalHeader>
            <CModalTitle>PKD View Form</CModalTitle>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                >
                </CFormInput>
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
                  <option disabled value="">Select a brand</option>
                  <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
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
              <CCol md="4">
                <CFormLabel for="pkd-date">PKD (DD-MMM-yyyy):</CFormLabel>
              </CCol>
              <CCol md="8">
                <CFormInput
                  type="text"
                  class="form-control"
                  :value="formattedDate(selectedForm.pkd_date, 'DD-MMM-yyyy')"
                  readonly="true"
                >
                </CFormInput>
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
            <CButton color="secondary" @click="showPKDViewModal = false"
              >Close</CButton
            >
          </CModalFooter>
        </CModal> -->

        <!-- Pagination buttons -->
        <!-- <div class="pagination">
          <CCol :sm="6">
            <button
              @click="prevPage"
              class="btn m-2"
            >
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            <button
              @click="nextPage"
              class="btn btn-dark"
            >
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </CCol>
        </div> -->
      </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from "axios";
import ExpandableImage from "./ExpandableImage.vue";
import Datex from "../utils/common.js";

export default {
  components: {
    ExpandableImage,
  },
  data() {
	//console.log('test');
    return {
      netNames: [],
      selectedNetName: "",
      showViewModal: false,
      showWholesalerViewModal: false,
      showPKDViewModal: false,
      selectedBrand: "",
      specifiedBrand: "",
      customNetWeight: "",
      showWholesalerEditModal: false,
      showPKDEditModal: false,
      filledForms: [],
      enableGeolocation: true,
      selectedState: "",
      selectedDistrict: "",
      selectedTown: "",
      successMessage: null,
      searchQuery: "",
      showEditModal: false,
      formId: null,
      selectedForm: {
        id: "",
        date: "",
        state: "",
        district: "",
        town: "",
        Brand_Name: "",
        wholesaler_outlet_name: "",
        beat_id: "",
        wholesaler_id: "",
        // sku: "",
        net_weight: "",
        mrp: "",
        pkd_date: "",
        pkd_month: "",
        pkd_year: "",
        pkd_day: "",
        consumer_price: "",
        ic_per_mc: "",
        units_in_ic: "",
        ic_wlp: "",
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
        type: "",
        sales_channel: "",
        channel_partner_name: "",
      },
      editedForm: {
        Brand_Name: "",
        Brand_ID: "",
        date: "",
        state: "",
        district: "",
        wholesaler_outlet_name:
          "something which should be selected from dropdown list",
        beat_id: "",
        wholesaler_id: "",
        Brand_name: "",
        // sku: "",
        net_weight: "",
        mrp: "",
        pkd_date: "",
        pkd_month: "",
        pkd_year: "",
        pkd_day: "",
        consumer_price: "",
        ic_per_mc: "",
        units_in_ic: "",
        ic_wlp: "",
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
        sales_channel: "",
        channel_partner_name: "",
      },
      selectedImages: [],
      selectedYear: null,
      selectedMonth: null,
      selectedDay: null,
      isFormValid: false, // for form validation
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
      brands: [],
      // skus: [],
      // selectedBrand: "",
      // selectedSKU: "",
      states: [],
      districts: [],
      towns: [],
      wholesalerOutlets: [],
      submissionTimestamp: null,
    };
  },
  mounted() {
    this.fetchFilledForms();
    this.generateYearOptions();
    this.fetchStates();
    this.fetchBrandsAndWeights();
    // this.fetchSkus();
    //this.fetchTowns();
    this.fetchWholesalerData();
    this.fetchPKDData();
    this.username = localStorage.getItem("username");
    const formId = this.$route.params.formId; // Assuming formId is passed as a route parameter
    this.fetchFormData(formId);

    if (this.formId) {
      this.fetchFormData(this.formId);
    }

    if (this.editedForm.pkd_date) {
      const [year, month, day] = this.editedForm.pkd_date.split("-");
      this.selectedYear = parseInt(year);
      this.selectedMonth = parseInt(month);
      this.selectedDay = parseInt(day);
    }
  },
  watch: {
    selectedNetName(newNetName) {
      this.editedForm.net_weight = newNetName;
    },
    "editedForm.Brand_Name": function (newBrandName) {
      this.updateNetNames(newBrandName);
    },
    specifiedBrand(newSpecifiedBrand) {
      this.editedForm.Brand_Name = newSpecifiedBrand;
      this.editedForm.Brand_ID = 99;
    },
    "editedForm.town": {
      handler(newTown) {
        if (newTown) {
          this.fetchWholesalerData();
          this.fetchPKDData();
        }
      },
      immediate: true,
    },
    formId: {
      handler: function (newFormId) {
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
    isCustomBrandSelected() {
      return this.selectedBrand === "Others";
    },
    imageElements() {
      return this.selectedImages.map((image, index) => ({
        src: image.src,
        index: index,
        key: index,
      }));
    },

    combinedPKDDate() {
      if (this.editedForm.pkd_month && this.editedForm.pkd_year) {
        return `${this.editedForm.pkd_year}-${this.editedForm.pkd_month}-${this.editedForm.pkd_day}`;
      }
      return null;
    },

    filteredForms() {
      const query = this.searchQuery.toLowerCase();
      return this.filledForms.filter((form) => {
        return (
          form.State_Name.toLowerCase().includes(query) ||
          form.District_Name.toLowerCase().includes(query) ||
          form.Town_Name.toLowerCase().includes(query) ||
          // form.sku.toLowerCase().includes(query) ||
          form.mrp.toLowerCase().includes(query) ||
          form.Brand_Name.toLowerCase().includes(query)
        );
      });
    },

    canEdit() {
      return (form) => {
        if (form.submission_timestamp) {
          const submissionTime = new Date(form.submission_timestamp);
          const currentTime = new Date();
          const timeDifference =
            (currentTime - submissionTime) / (1000 * 60 * 60);

          if (timeDifference <= 24) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      };
    },
  },
  methods: {
    validateForm() {
      this.isFormValid =
        this.editedForm.date &&
        this.editedForm.state &&
        this.editedForm.district &&
        this.editedForm.town &&
        this.editedForm.Brand_Name &&
        // this.editedForm.sku &&
        this.editedForm.net_weight &&
        this.editedForm.mrp &&
        this.editedForm.pkd_month &&
        this.editedForm.pkd_year &&
        this.editedForm.pkd_day &&
        this.editedForm.consumer_price &&
        this.editedForm.units_in_ic &&
        this.editedForm.ic_rlp;
    },

    validateWholesalerForm() {
      this.isFormValid =
        this.editedForm.date &&
        this.editedForm.state &&
        this.editedForm.district &&
        this.editedForm.town &&
        this.editedForm.Brand_Name &&
        this.editedForm.wholesaler_outlet_name &&
        this.editedForm.beat_id &&
        this.editedForm.wholesaler_id &&
        this.editedForm.net_weight &&
        this.editedForm.pkd_month &&
        this.editedForm.pkd_year &&
        this.editedForm.ic_per_mc &&
        this.editedForm.units_in_ic &&
        this.editedForm.ic_wlp &&
        this.editedForm.ic_rlp;
    },
    validatePKD() {
      this.isFormValid =
        this.editedForm.date &&
        this.editedForm.state &&
        this.editedForm.district &&
        this.editedForm.town &&
        this.editedForm.Brand_Name &&
        this.editedForm.wholesaler_outlet_name &&
        this.editedForm.beat_id &&
        this.editedForm.wholesaler_id &&
        this.editedForm.net_weight &&
        this.editedForm.pkd_month &&
        this.editedForm.pkd_year &&
        this.editedForm.ic_per_mc &&
        this.editedForm.units_in_ic &&
        this.editedForm.ic_wlp &&
        this.editedForm.ic_rlp;
    },
    fetchBrandsAndWeights() {
      // Fetch both brands and their corresponding net weights
      Promise.all([
        axios.get(process.env.VUE_APP_ROOT_API + "/api/brandsname"),
        axios.get(process.env.VUE_APP_ROOT_API + "/api/netweightmaster/all"),
      ])
        .then(([brandsResponse, weightsResponse]) => {
          // Create a mapping of brands to their net weights
          this.netWeights = weightsResponse.data.reduce((acc, item) => {
            if (!acc[item.Brand]) {
              acc[item.Brand] = []; // Initialize an array for each brand
            }
            acc[item.Brand].push(item.NetName); // Add NetName to the brand's array
            return acc;
          }, {});

          // Map the brands response to a more usable format
          this.brands = brandsResponse.data.map((brand) => ({
            name: brand.Brand_Name,
            id: brand.Brand_ID,
          }));

          // Check if the current brand exists in the fetched brands
          const existingBrand = this.brands.find(
            (brand) => brand.name === this.editedForm.Brand_Name
          );

          if (existingBrand) {
            this.selectedBrand = existingBrand.name;
            this.editedForm.Brand_ID = existingBrand.id;
          } else {
            this.selectedBrand = "Others";
            this.specifiedBrand = this.editedForm.Brand_Name;
          }
        })
        .catch((error) => {
          console.error("Error fetching brands or net weights:", error);
        });
    },

    formattedDate(val, format) {
      return Datex.formattedDate(val, format);
    },
    async fetchFilledForms() {
      try {
        const username = localStorage.getItem("username");

        if (username) {
          const response = await axios.post(
            process.env.VUE_APP_ROOT_API + `/api/filled-forms/${username}`
          );

          this.filledForms = response.data.sort(
            (a, b) =>
              new Date(b.submission_timestamp) -
              new Date(a.submission_timestamp)
          );
        } else {
          console.error("No username found in local storage");
        }
      } catch (error) {
        console.error("Error fetching filled forms:", error);
        alert("An error occurred while fetching filled forms.");
      }
    },
    applySearch() {
      this.filteredForms = this.filledForms.filter((form) => {
        const query = this.searchQuery.toLowerCase();
        return (
          form.State_Name.toLowerCase().includes(query) ||
          form.District_Name.toLowerCase().includes(query) ||
          form.Town_Name.toLowerCase().includes(query) ||
          // form.sku.toLowerCase().includes(query) ||
          form.mrp.toLowerCase().includes(query) ||
          form.Brand_Name.toLowerCase().includes(query)
        );
      });
    },
    convertToISTTimestamp(timestamp) {
      const serverTimestamp = new Date(timestamp);
      serverTimestamp.setHours(serverTimestamp.getHours());
      serverTimestamp.setMinutes(serverTimestamp.getMinutes());

      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };
      const istTimeString = serverTimestamp.toLocaleString("en-IN", options);
      return istTimeString;
    },

    navigateToAddForm() {
      this.$router.push("/user/web-form");
    },
    navigateToAddPKDForm() {
      this.$router.push("/user/Pkd-web-form");
    },
    navigateToAddWholesalerForm() {
      this.$router.push("/user/wholesaler-web-form");
    },
    getImageUrl(imageUrl) {
      return process.env.VUE_APP_ROOT_API + `${imageUrl}`;
    },

    updateBrandName() {
      this.editedForm.Brand_Name = this.specifiedBrand;
      this.editedForm.Brand_ID = ""; // Reset the ID when specifying a new brand
    },
    updateNetWeight() {
      if (this.selectedBrand === "Others") {
        this.netWeight = this.customNetWeight; // Use custom net weight
        console.log("Custom Net Weight:", this.netWeight);
      } else {
        const selectedBrandData = this.brands.find(
          (brand) => brand.Brand_Name === this.selectedBrand
        );
        if (selectedBrandData) {
          this.netWeight = selectedBrandData.netWeight; // Assign NetWeight from the selected brand
          console.log("Selected Brand Net Weight:", this.netWeight);
        } else {
          this.netWeight = ""; // Reset if no brand is selected
          console.log("No Net Weight found for selected brand.");
        }
      }
    },
    updateNetNames(newBrandName) {
      // Ensure this method is defined
      this.netNames = this.netWeights[newBrandName] || [];
    },
    async fetchFormData(formId) {
      if (formId) {
        try {
          const response = await axios.get(
            process.env.VUE_APP_ROOT_API + `/api/forms/${formId}`
          );

          this.editedForm = response.data;
          this.fetchBrandsAndWeights();
          this.editedForm.sales_channel = response.data.sales_channel;
          this.editedForm = response.data;
          this.specifiedBrand = this.editedForm.Brand_Name;
          this.customNetWeight = this.editedForm.net_weight;
          // Fetch brands after getting form data
          this.fetchBrandsAndWeights();
          this.editedForm.channel_partner_name =
            response.data.channel_partner_name;
          var d = new Date(response.data.date);
          this.editedForm.date = Datex.formattedDate(
            new Date(d.getTime() + -d.getTimezoneOffset() * 60 * 1000),
            "yyyy-MM-DD"
          );
          if (!this.editedForm.pkd_day)
            this.editedForm.pkd_day = this.editedForm.pkd_date.split("-")[2];
          this.editedForm.latitude = response.data.latitude;
          this.editedForm.longitude = response.data.longitude;

          // Check if Brand_ID is 99
          if (this.editedForm.Brand_ID === 99) {
            this.selectedBrand = "Others";
            this.specifiedBrand = this.editedForm.Brand_Name;
          }

          this.fetchDistricts();
          this.fetchTowns();
          this.selectedImages = [
            {
              src: this.getImageUrl(this.editedForm.image1_url),
              imageUrl: this.editedForm.image1_url,
            },
            {
              src: this.getImageUrl(this.editedForm.image2_url),
              imageUrl: this.editedForm.image2_url,
            },
            {
              src: this.getImageUrl(this.editedForm.image3_url),
              imageUrl: this.editedForm.image3_url,
            },
            {
              src: this.getImageUrl(this.editedForm.image4_url),
              imageUrl: this.editedForm.image4_url,
            },
            {
              src: this.getImageUrl(this.editedForm.image5_url),
              imageUrl: this.editedForm.image5_url,
            },
          ].filter((image) => image.imageUrl !== "");
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
    onTownChange() {
      this.selectedWholesalerOutletName = null;
      this.fetchWholesalerData();
    },
    async fetchWholesalerData() {
      if (!this.editedForm.town) {
        console.error("Town is undefined or empty");
        return;
      }

      try {
        const response = await axios.get(
          process.env.VUE_APP_ROOT_API +
            `/api/wholesaler-data/${this.editedForm.town}`
        );
        this.wholesalerOutlets = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    onBrandChange() {
      this.selectedNetName = "";
      // Populate netNames based on the selected brand
      this.netNames =
        this.selectedBrand === "Others"
          ? []
          : this.netWeights[this.selectedBrand] || [];

      const selectedBrandObj = this.brands.find(
        (brand) => brand.name === this.selectedBrand
      );

      if (selectedBrandObj) {
        this.editedForm.Brand_Name = selectedBrandObj.name;
        this.editedForm.Brand_ID = selectedBrandObj.id;
      }

      //   if (this.editedForm.Brand_ID === 99 || this.selectedBrand === "Others") {
      //     this.selectedBrand = "Others";
      //     this.specifiedBrand = this.editedForm.Brand_Name;
      //   } else {
      //     this.specifiedBrand = "";
      //   }
    },

    async fetchPKDData() {
      if (!this.editedForm.town) {
        console.error("Town is undefined or empty");
        return;
      }

      try {
        const response = await axios.get(
          process.env.VUE_APP_ROOT_API + `/api/pkd-data/${this.editedForm.town}`
        );
        this.wholesalerOutlets = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // fetchSkus() {
    //   axios
    //     .get(process.env.VUE_APP_ROOT_API + "/api/skus")
    //     .then((response) => {
    //       this.skus = response.data.map((sku) => sku.SKU_Type_Name);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching SKUs:", error);
    //     });
    // },
    addBrand() {
      const newBrand = prompt("Add Brand Name");
      if (newBrand && newBrand.trim() !== "") {
        if (!this.brands.includes(newBrand)) {
          axios
            .post(process.env.VUE_APP_ROOT_API + "/api/add-brand", {
              brandName: newBrand,
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

    async editImageField(event, index) {
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

          const editedImageUrl = {
            src: process.env.VUE_APP_ROOT_API + response.data.imageUrl,
            imageUrl: response.data.imageUrl,
          };

          this.editedForm["image" + (index + 1) + "_url"] =
            editedImageUrl.imageUrl;

          this.selectedImages.splice(index, 1, editedImageUrl);
          this.uploadSuccess = true;
        } catch (error) {
          console.error("Error uploading image:", error);
          this.uploadError = "Error uploading image";
        }
      }
      this.uploading = false;
    },
    removeImageField(index) {
      if (index >= 0 && index < this.selectedImages.length) {
        this.editedForm["image" + (index + 1) + "_url"] = "";
        this.selectedImages.splice(index, 1);
      }
    },

    updateDate(event) {
      this.date = event.target.value;
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
      this.editedForm.pkd_date= this.combinedPKDDate;
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

      if (this.editedForm.type == "PKD") {
        this.isFormValid = true;
      } else if (this.editedForm.type == "Wholesaler") {
        this.validateWholesalerForm();
      } else {
        this.validateForm();
      }

      // delete this.editedForm.pkd_day;
      if (this.isFormValid) {
        try {
			console.log(this.editedForm);
          await axios.put(
            process.env.VUE_APP_ROOT_API + `/api/forms/${this.editedForm.id}`,
            this.editedForm
          );

          this.$toast.success("Form updated successfully!");
          this.fetchFilledForms();
          this.closeEditModal();
          this.$router.push("/user/dashboard");
        } catch (error) {
          console.error("Error saving edited form:", error);
        }
        this.fetchFilledForms();
        if (this.editedForm.type != "Wholesaler") {
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
        }
      } else {
        alert("Please fill in all mandatory (*) fields.");
      }
    },

    openEditModal(formId) {
      const formToEdit = this.filledForms.find((form) => form.id === formId);
      if (this.canEdit(formToEdit)) {
        this.formId = formId;
        if (formToEdit.type === "Wholesaler") {
          this.showWholesalerEditModal = true;
        } else if (formToEdit.type === "PKD") {
          this.showPKDEditModal = true;
        } else {
          this.showEditModal = true;
        }
      } else {
        alert(
          "Editing is not allowed as the time limit has exceeded 24 hours."
        );
      }
    },

    closeEditModal() {
      this.selectedForm = {};
      this.showEditModal = false;
      this.showWholesalerEditModal = false;
      this.showPKDEditModal = false;
    },
    openViewModal(form) {
      this.selectedForm = form;
      if (form.type == "Wholesaler") {
        this.showWholesalerViewModal = true;
      } else if (form.type == "PKD") {
        this.showPKDViewModal = true;
      } else {
        this.showViewModal = true;
      }
    },

    closeViewModal() {
      this.selectedForm = {};
      this.showViewModal = false;
      this.showWholesalerViewModal = false;
      this.showPKDViewModal = false;
    },
  },
};
</script>

<style scoped>
.table-div {
  max-width: 100%; /*1010px;*/
  max-height: 300px;
  overflow: scroll;
  overflow-x: scroll;
  overflow-y: scroll;
}

.text-caption {
  font-size: 0.8rem !important;
}

.icon-container {
  display: flex;
  gap: 10px;
}

.p-right {
  padding-right: 5px;
}

.view-form-modal {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.view-form-modal .modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-form-modal p {
  margin-bottom: 10px;
}

.view-form-modal .form-field {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.view-form-modal .form-field label {
  font-weight: bold;
  width: 150px;
}

.view-form-modal .form-field span {
  flex: 1;
}

.view-form-modal .modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.view-form-modal .modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.view-form-modal .modal-content {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  background-color: #fff;
}

.view-form-modal .modal-footer button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.view-form-modal .modal-footer button:hover {
  background-color: #0056b3;
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

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

.text-right {
  text-align: right;
  float: right;
}

.btn-dark {
  color: #fff;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
