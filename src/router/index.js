import { h, resolveComponent } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import jwt from "jsonwebtoken";
import { logout } from "@/utils/authUtils";

import DefaultLayout from "@/layouts/DefaultLayout";
const routes = [
  {
    path: "/admin",
    name: "Admin",
    component: DefaultLayout,

    redirect: "/admin/user",
    children: [
      {
        path: "/admin/user",
        name: "User Master",
        component: () => import("@/components/AdminPanel/UserMaster.vue"),
        meta: { roles: ["Admin"] },
      },
      {
        path: "/admin/brand",
        name: "Brand Master",
        component: () => import("@/components/AdminPanel/BrandMaster.vue"),
        meta: { roles: ["Admin"] },
      },
      {
        path: "/admin/net",
        name: "Net Weight Master",
        component: () => import("@/components/AdminPanel/NetWeightMaster.vue"),
        meta: { roles: ["Admin"] },
      },
      {
        path: "/admin/role",
        name: "Role Master",
        component: () => import("@/components/AdminPanel/RoleMaster.vue"),
        meta: { roles: ["Admin"] },
      },
      {
        path: "/admin/sku",
        name: "SKU Type Master",
        component: () => import("@/components/AdminPanel/SKUTypeMaster.vue"),
        meta: { roles: ["Admin"] },
      },
      
      {
        path: "/admin/reports",
        name: "Retailer Reports",
        component: () => import("@/components/ReportPage.vue"),
        meta: { roles: ["Admin"] },
      },
      {
        path: "/admin/pkdreports",
        name: "PKD Reports",
        component: () => import("@/components/PKDReportPage.vue"),
        meta: { roles: ["Admin"] },
      },


      {
        path: "/admin/wholesaler-reports",
        name: "Wholesaler Reports",
        component: () => import("@/components/WholesalerReportPage.vue"),
        meta: { roles: ["Admin"] },
      },
      // {
      //     path: "/admin/dailyreports",
      //     name: "Daily Pkd Reports",
      //     component: () => import("@/components/AdminPanel/DailyPkdReport.vue"),
      //     meta: { roles: ["Admin"] },
      //   },
      {
        path: "/admin/automailer",
        name: "Automailers",
        component: () => import("@/components/AdminPanel/AutoMailer.vue"),
        meta: { roles: ["Admin"] },
      },
    ],
  },
  // Regular user routes
  {
    path: "/user",
    component: DefaultLayout,
    children: [
      {
        path: "/user/web-form",
        name: "Retailer Tracking Form",
        component: () => import("@/components/WebForm.vue"),
        meta: { roles: ["Regularuser"] },
      },
      {
        path: "/user/wholesaler-web-form",
        name: "Wholesaler Tracking Form",
        component: () => import("@/components/WholesalerWebForm.vue"),
        meta: { roles: ["Regularuser"] },
      },
      {
        path: "/user/Pkd-web-form",
        name: "ADD PKDForms",
        component: () => import("@/components/PKDForms.vue"),
        meta: { roles: ["Regularuser"] },
      },
      {
        path: "/user/dashboard",
        name: "Filled Forms List",
        component: () => import("@/components/AdminPanel/DashBoard.vue"),
        meta: { roles: ["Regularuser"] },
      },
      {
        path: "/user/filled-form",
        name: "Filled Form Master",
        component: () => import("@/components/FilledForms.vue"),
        meta: { roles: ["Regularuser"] },
      },
      {
        path: "/user/edit-form/:formId",
        name: "EditForm",
        component: () => import("@/components/EditForm.vue"),
        meta: { roles: ["Regularuser"] },
      },
    ],
  },

  {
    path: "/",
    redirect: "/login",
    component: {
      render() {
        return h(resolveComponent("router-view"));
      },
    },
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/components/LoginPage.vue"),
      },
      {
        path: "/unauthorized",
        name: "Unauthorized",
        component: () => import("@/components/UnauthorizedPage.vue"), // Unauthorized access page
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  },
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // Check if the user is authenticated
  if (token) {
    const decodedToken = jwt.decode(token);
    console.log("Token expiration time:", new Date(decodedToken.exp * 1000)); // Debugging log

    if (decodedToken.exp * 1000 > Date.now()) {
      // Check if the route requires role-based authorization
      if (to.meta.roles) {
        if (to.meta.roles.includes(decodedToken.Role_Name)) {
          next(); // Allow navigation
        } else {
          // Redirect to unauthorized if user doesn't have required role
          next("/unauthorized");
        }
      } else {
        next(); // Continue navigation for routes without role restrictions
      }
    } else {
      //token expired
      logout(); // Use the logout utility function to clear local storage
      next("/login"); // Redirect user to login page
    }
  } else {
    // If not authenticated, only allow navigation to login page
    if (to.path === "/login") {
      next(); // Continue to login page
    } else {
      next("/login"); // Redirect to login page for all other routes
    }
  }
});

export default router;
