import jwt from "jsonwebtoken";

const navigationItems = [
  {
    role: "Admin",
    component: "CNavItem",
    name: "User Master",
    to: "/admin/user",
    icon: "cilUser",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Brand Master",
    to: "/admin/brand",
    icon: "cilBadge",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Net Weight Master",
    to: "/admin/net",
    icon: "cilBadge",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Role Master",
    to: "/admin/role",
    icon: "cilSpreadsheet",
  },
  // {
  //   role: "Admin",
  //   component: "CNavItem",
  //   name: "SKU Type Master",
  //   to: "/admin/sku",
  //   icon: "cilVector",
  // },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Retailer Reports",
    to: "/admin/reports",
    icon: "cilList",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "PKD Reports",
    to: "/admin/pkdreports",
    icon: "cilList",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Wholesaler Reports",
    to: "/admin/wholesaler-reports",
    icon: "cilList",
  },
  //   {
  //     role: "Admin",
  //     component: "CNavItem",
  //     name: "Daily Pkd Report",
  //     to: "/admin/dailyreports",
  //     icon: "cilList",
  //   },
  {
    role: "Regularuser",
    component: "CNavItem",
    name: "DashBoard",
    to: "/user/dashboard",
    icon: "cilSpeedometer",
  },

  {
    role: "Regularuser",
    component: "CNavItem",
    name: "Add Retailer Data",
    to: "/user/web-form",
    icon: "cilCode",
  },

  {
    role: "Regularuser",
    component: "CNavItem",
    name: "Add Wholesaler Data",
    to: "/user/wholesaler-web-form",
    icon: "cilCode",
  },

  {
    role: "Regularuser",
    component: "CNavItem",
    name: "Add PKD Data",
    to: "/user/Pkd-web-form",
    icon: "cilCode",
  },
  {
    role: "Admin",
    component: "CNavItem",
    name: "Automailer",
    to: "/admin/automailer",
    icon: "cilCode",
  },
];

const getFilteredNavigationItems = () => {
  const token = localStorage.getItem("token");
  let filteredNavigationItems = [];

  if (token) {
    const decodedToken = jwt.decode(token);
    const userRole = decodedToken.Role_Name;
    filteredNavigationItems = navigationItems.filter(
      (item) => item.role === userRole
    );
  }

  return filteredNavigationItems;
};

export default getFilteredNavigationItems;
