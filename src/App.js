import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CRMSystem from "./pages/CRMSystem";
import CustomerDetails from "./pages/CustomerDetails";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { DeviceProvider } from "./context/DeviceContext";
import { AuthProvider } from "./context/AuthContext";

const AppContent = () => {
  const { isDarkTheme } = useTheme();

  return (
    <div className={isDarkTheme ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/beautypay-salon" />} />
            <Route path="/*" element={<CRMSystem />} />
            <Route
              path="/customer-management/details/:id"
              element={<CustomerDetails />}
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

const App = () => {
  sessionStorage.setItem("userGroup", "admin");

  return (
    <AuthProvider>
      <ThemeProvider>
        <DeviceProvider>
          <AppContent />
        </DeviceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
