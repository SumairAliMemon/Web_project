export const routes = {
  hostelOwner: [
   /*  { path: '/hostel-owner-dashboard', component: 'HostelOwnerDashboard' },
    { path: '/manage-hostels', component: 'ManageHostels' },
    { path: '/view-bookings', component: 'ViewBookings' },
   */],
  customer: [
    { path: '/customer-dashboard', component: 'CustomerDashboard' },
    { path: '/search-hostels', component: 'SearchHostels' },
    { path: '/my-bookings', component: 'MyBookings' },
  ],
  superAdmin: [
    { path: '/super-admin-dashboard', component: 'SuperAdminDashboard' },
    { path: '/manage-users', component: 'ManageUsers' },
    { path: '/site-statistics', component: 'SiteStatistics' },
  ],
  shared: [
    { path: '/', component: 'Home' }, // Home component can be the login/register page
    { path: '/register', component: 'Register' },
  ],
};
