<template>
                       <CRow>
                    <CCol :sm="12">
                        <CRow class="mb-4">
                            <CCol :xs="6">
								<CCol class="row">
								<CCol :xs= "6">
								<input v-model="searchTerm" type="text" class="form-control" placeholder="Search User" style="
									width: 100%;">
								</CCol>
								<CCol :xs="6"><p>Total: {{filteredUsers.length }}</p>
								</CCol>
								</CCol>
                            </CCol>
                            <CCol :xs="6">
                                <div class="add-btn-right">
                                    <CButton color="success" class="btn btn-success primary" @click="openAddModal">Add&nbsp;New&nbsp;User</CButton>
                                </div>
                            </CCol>
                        </CRow>
                        <div class="table-div">
                            <CTable bordered class="table table-striped">
                                <CTableHead color="secondary">
                                    <CTableRow class="text-caption">
                                        <CTableHeaderCell>User Name</CTableHeaderCell>
                                        <CTableHeaderCell>Email</CTableHeaderCell>

                                        <CTableHeaderCell>Region</CTableHeaderCell>
                                        <CTableHeaderCell>Contact Number</CTableHeaderCell>

                                        <!-- <CTableHeaderCell>Mobile</CTableHeaderCell> -->
                                        <CTableHeaderCell>Role</CTableHeaderCell>
                                        <!-- <CTableHeaderCell>Active</CTableHeaderCell> -->

                                        <CTableHeaderCell colspan="2">Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody class="text-caption">
                                    <CTableRow v-for="user in filteredUsers" :key="user.User_ID">
                                        <CTableDataCell>{{ user.Username }}</CTableDataCell>
                                        <CTableDataCell>{{ user.Email }}</CTableDataCell>

                                        <CTableDataCell>{{ user.Region }}</CTableDataCell>
                                        <CTableDataCell>{{ user.Contact_Number }}</CTableDataCell>

                                        <!-- <CTableDataCell>{{ user.Mobile }}</CTableDataCell> -->
                                        <CTableDataCell>{{ user.Role_Name }}</CTableDataCell>
                                        <!-- <CTableDataCell>{{ user.Is_Active }}</CTableDataCell> -->

                                        <CTableDataCell>
                                            <span>
                                                <font-awesome-icon icon="edit" @click="editUser(user)" title="Edit" />
                                            </span>
                                            <span v-if="user.Is_Active==1" class="ms-2">
                                                <font-awesome-icon icon="trash" @click="deleteUser(user.User_ID)" title="Delete" />
                                            </span>
                                            <span v-if="user.Is_Active==0" class="ms-2">
                                                <font-awesome-icon icon="refresh" @click="restoreUser(user.User_ID)" title="Restore" />
                                            </span>
                                        </CTableDataCell>
                                    </CTableRow>
                                </CTableBody>
                            </CTable>
                        </div>
                    </CCol>
                </CRow>
           
<!-- Add or Edit User Modal -->
<CModal :visible="showModal" @close="cancelUser">
    <CModalHeader>
        <h4>{{ newUser.User_ID ? "Edit User" : "Add New User" }}</h4>
    </CModalHeader>
    <CModalBody>
        <input v-model="newUser.Username" type="text" class="form-control mb-4" placeholder="UserName" />

        <input v-model="newUser.Email" type="email" class="form-control mb-4" placeholder="Email" :class="{ 'error-input': !isEmailValid && newUser.Email !== '' }" />
        <div class="error-message" v-if="!isEmailValid && newUser.Email !== ''">
            Invalid email format
        </div>
        <div class="password-input-container">
            <input v-model="newUser.Password" :type="showPassword ? 'text' : 'password'" class="form-control mb-4 password-input" placeholder="Password" :class="{
            'error-input': !isPasswordValid && newUser.Password !== '',
          }" />
            <span class="password-toggle-icon" @click="togglePasswordVisibility">
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
        </div>
        <div class="error-message" v-if="!isPasswordValid && newUser.Password !== ''">
            Password must be at least 8 characters long and contain letters,
            numbers, and symbols
        </div>

        <input v-model="newUser.Region" type="text" class="form-control mb-4" placeholder="Region" />

        <input v-model="newUser.Contact_Number" type="text" class="form-control mb-4" placeholder="Contact Number" :class="{
          'error-input': !isContactNumberValid && newUser.Contact_Number !== '',
        }" />
        <div class="error-message" v-if="!isContactNumberValid && newUser.Contact_Number !== ''">
            Contact number must be a 10-digit number
        </div>

        <!-- <input
        v-model="newUser.Mobile"
        type="text"
        class="form-control mb-4"
        placeholder="Mobile Number"
        :class="{ 'error-input': !isMobileValid && newUser.Mobile !== '' }"
      />
      <div class="error-message" v-if="!isMobileValid && newUser.Mobile !== ''">
        Mobile number must be a 10-digit number
      </div> -->

        <select v-model="newUser.Role_Name" class="form-control mb-4">
            <option value="" disabled selected>Select a Role</option>
            <option v-for="role in roleNames" :key="role">{{ role }}</option>
        </select>
    </CModalBody>
    <CModalFooter>
        <CButton color="secondary" @click="cancelUser">Cancel</CButton>
        <CButton color="success" @click="saveUser">Save</CButton>
    </CModalFooter>
</CModal>

<!-- Pagination buttons 
<div class="pagination">
    <CCol :sm="6">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn m-2">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-dark">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    </CCol>
</div>
-->
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            users: [],
            showModal: false,
            showPassword: false,

            newUser: {
                Username: "",
                Email: "",
                Password: "",
                Region: "",
                Contact_Number: "",
                Role_Name: "",
                Mobile: "",
                Created_By: "",
                Modified_By: "",
                roleNames: [],
                isEmailValid: false,
                isMobileValid: false,
                isContactNumberValid: false,
                isPasswordValid: false,
                emailErrorMessage: "",
                mobileErrorMessage: "",
                contactNumberErrorMessage: "",
                passwordErrorMessage: "",
            },
            searchTerm: "",
            usersPerPage: 20,
            currentPage: 1,
        };
    },
    computed: {
        isEmailValid() {
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
            return emailRegex.test(this.newUser.Email);
        },
        isMobileValid() {
            const mobileRegex = /^[0-9]{10}$/;
            return mobileRegex.test(this.newUser.Mobile);
        },
        isContactNumberValid() {
            const contactNumberRegex = /^[0-9]{10}$/;
            return contactNumberRegex.test(this.newUser.Contact_Number);
        },
        isPasswordValid() {
            const passwordRegex =
                /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{8,}$/;
            return passwordRegex.test(this.newUser.Password);
        },
        filteredUsers() {
            if (!this.searchTerm) {
                return this.users;
            }
            const searchTermLowerCase = this.searchTerm.toLowerCase();
            return this.users.filter(
                (user) =>
                user.Username.toLowerCase().includes(searchTermLowerCase) ||
                user.Email.toLowerCase().includes(searchTermLowerCase) ||
                (user.Region &&
                    user.Region.toLowerCase().includes(searchTermLowerCase)) ||
                (user.Contact_Number &&
                    user.Contact_Number.includes(searchTermLowerCase))
            );
        },
        // totalPages() {
        //     return Math.ceil(this.filteredUsers.length / this.usersPerPage);
        // },
        // startIndex() {
        //     return (this.currentPage - 1) * this.usersPerPage;
        // },
        // endIndex() {
        //     return this.startIndex + this.usersPerPage;
        // },
        // paginatedUsers() {
        //     return this.filteredUsers.slice(this.startIndex, this.endIndex);
        // },
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        openAddModal() {
            this.showModal = true;
        },
        fetchRoleNames() {
            axios
                .get(process.env.VUE_APP_ROOT_API + "/api/rolenames")
                .then((response) => {
                    this.roleNames = response.data;
                    //console.log("Fetched role names:", this.roleNames);
                })
                .catch((error) => {
                    console.error("Error fetching role names:", error);
                });
        },

        fetchUsers() {
            axios
                .post(process.env.VUE_APP_ROOT_API + "/api/users/fetch")
                .then((response) => {
                    this.users = response.data;//.sort((a, b) => b.userId - a.userId);
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                });
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

        addUser() {
            this.newUser.Created_By = localStorage.getItem('username');
            axios
                .post(process.env.VUE_APP_ROOT_API + "/api/users", this.newUser)
                .then(() => {
                    //console.log(response);
                    this.showModal = false;
                    this.fetchUsers();
                })
                .catch((error) => {
                    console.error("Error adding user:", error);
                });
        },
        editUser(user) {
            //console.log("Editing user:", user);
            this.newUser = {
                ...user
            };
            //console.log("New user data:", this.newUser);
            this.showModal = true;
        },

        updateUser() {
            //console.log("Updating user:", this.newUser);
            axios
                .put(
                    process.env.VUE_APP_ROOT_API + `/api/users/${this.newUser.User_ID}`,
                    this.newUser
                )
                .then(() => {
                    this.showModal = false;
                    this.fetchUsers(); // Refresh the user list
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                });
        },
        saveUser() {
            if (
                this.isEmailValid &&
                // this.isMobileValid &&
                this.isContactNumberValid &&
                this.isPasswordValid
            ) {
                if (this.newUser.User_ID) {
                    this.updateUser(); // Call the update method for editing
                } else {
                    this.addUser(); // Call the add method for adding
                }
                // Reset validation flags and clear form fields
                this.isEmailValid = true;
                this.isMobileValid = true;
                this.isContactNumberValid = true;
                this.isPasswordValid = true;
                this.emailErrorMessage = "";
                this.mobileErrorMessage = "";
                this.contactNumberErrorMessage = "";
                this.passwordErrorMessage = "";
                this.cancelUser();
            } else {
                if (!this.isEmailValid) {
                    this.emailErrorMessage = "Invalid email format";
                }
                if (!this.isMobileValid) {
                    this.mobileErrorMessage = "Mobile number must be a 10-digit number";
                }
                // if (!this.isContactNumberValid) {
                //   this.contactNumberErrorMessage =
                //     "Contact number must be a valid number";
                // }
                if (!this.isPasswordValid) {
                    this.passwordErrorMessage =
                        "Password must be at least 8 characters long and contain letters, numbers, and symbols";
                }
            }
        },

        cancelUser() {
            this.showModal = false;
            this.newUser = {
                Username: "",
                Email: "",
                Password: "",
                Region: "",
                Contact_Number: "",
                Role_Name: "",
                Mobile: "",
                Created_By: "",
                Modified_By: "",
            };
        },

        deleteUser(userId) {
            axios
                .delete(process.env.VUE_APP_ROOT_API + `/api/users/${userId}`)
                .then(() => {
                    // Remove the deleted user from the users array
                    //this.users = this.users.filter((user) => user.User_ID !== userId);
                    this.fetchUsers();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        },
        restoreUser(userId) {
            axios
                .put(process.env.VUE_APP_ROOT_API + `/api/users/restore/${userId}`)
                .then(() => {
                    // Remove the deleted user from the users array
                    //this.users = this.users.filter((user) => user.User_ID !== userId);
                    this.fetchUsers();
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        },
    },

    mounted() {
        this.fetchUsers();
        this.fetchRoleNames(); // Fetch role names when the component is mounted
    },
};
</script>

<style scoped>
.add-btn-right {
    float: right;
}

.table-div {
    max-width: 1010px;
    max-height: 300px;
    overflow: scroll;
    overflow-x: scroll;
    overflow-y: scroll;
}

.text-caption {
    font-size: 0.8rem !important;
}

.user-container {
    margin: 20px;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
}

.user-table th,
.user-table td {
    padding: 8px;
    border: 1px solid #ccc;
}

.user-table th {
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

.edit-btn {
    background-color: #64b5f6;
    color: #fff;
}

.delete-btn {
    background-color: #e57373;
    color: #fff;
}

.password-input-container {
    position: relative;
}

.password-input {
    padding-right: 40px;
}

.password-toggle-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
}

.error-input {
    border-color: red !important;
}

.error-message {
    color: red;
    font-size: 0.8rem;
    margin-top: 0.2rem;
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

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
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
</style>
