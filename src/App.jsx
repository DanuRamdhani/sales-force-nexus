import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LeadDetailPage from "./pages/LeadDetailPage.jsx";
import AdmindashboardPage from "./pages/AdmindashboardPage.jsx";
import SalesManagementPage from "./pages/SalesManagementPage.jsx";
import CustomerManagementPage from "./pages/CustomerManagementPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import LeadManagementPage from "./pages/LeadManagementPage.jsx";
import AdminManagementPage from "./pages/AdminManagementPage.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import RequireSales from "./components/RequireSales.jsx";
import RequireSuperAdmin from "./components/RequireSuperAdmin.jsx";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Sales Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireSales>
              <DashboardPage />
            </RequireSales>
          }
        />
        <Route
          path="/leads/:leadId"
          element={
            <RequireSales>
              <LeadDetailPage />
            </RequireSales>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdmindashboardPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <RequireAdmin>
              <SalesManagementPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <RequireAdmin>
              <CustomerManagementPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/customers/:customerId"
          element={
            <RequireAdmin>
              <CustomerDetailPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/leads/:leadId"
          element={
            <RequireAdmin>
              <LeadManagementPage />
            </RequireAdmin>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin/users"
          element={
            <RequireSuperAdmin>
              <AdminManagementPage />
            </RequireSuperAdmin>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
