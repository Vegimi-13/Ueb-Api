export const roles = {
  ADMIN: {
    menu: [
      { label: "Dashboard", path: "/admin", icon: "bi-speedometer2" },
      { label: "Manage Users", path: "/admin/users", icon: "bi-people" },
      { label: "Job Category", path: "/admin/category", icon: "bi bi-bookmarks-fill" },
      { label: "Job Location", path: "/admin/location", icon: "bi bi-geo-alt-fill" },
      { label: "Applications", path: "/admin/applications", icon: "bi-file-earmark-text" }
    ],
  },
  CANDIDATE: {
    menu: [
      { label: "My Profile", path: "/candidate/profile", icon: "bi-person" },
      { label: "My Job Applications", path: "/candidate/candidateApplications", icon: "bi-ui-radios" },
      { label: "Search Jobs", path: "/", icon: "bi-file-earmark-plus" },

    ],
  },
  EMPLOYER: {
    menu: [
      { label: "Profile", path: "/company/profile" },
      { label: "Register Company", path: "/company/registerCompany" },
      { label: "Create Jobs", path: "/company/jobs" },
      { label: "Open Job Applications", path: "/company/openApplications" },
      { label: "Applications", path: "/company/companyApplications" },

    ],
  },
};
