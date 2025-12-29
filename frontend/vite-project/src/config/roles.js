export const roles = {
  admin: {
    menu: [
      { label: "Dashboard", path: "/admin", icon: "bi-speedometer2" },
      { label: "Manage Users", path: "/admin/users",  icon: "bi-people" },
      { label: "Job Category", path: "/admin/category" },
      { label: "Job Location", path: "/admin/location" }
    ],
  },
  candidate: {
    menu: [
        { label: "Dashboard", path: "/candidate" , icon: "bi-speedometer2"},
        { label: "My Profile", path: "/candidate/profile", icon:  "bi-person" },
        { label: "My Job Applications", path: "/candidate/applications" , icon: "bi-ui-radios"},
    ],
  },
  company: {
    menu: [
        { label: "Dashboard", path: "/company" ,  icon: "bi-speedometer2"},
        { label: "Profile", path: "/company/profile" },
        { label: "Open Job Applications", path: "/company/openApplications" },
    ],
  },
};
