import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CRMSystem from "./pages/CRMSystem";
import CustomerDetails from "./pages/CustomerDetails";
import { ThemeProvider } from "./context/ThemeContext";
import { DeviceProvider } from "./context/DeviceContext";
import { AuthProvider } from "./context/AuthContext"; // AuthProvider 사용

const App = () => {
  sessionStorage.setItem("userGroup", "admin");

  return (
    <AuthProvider>
      <ThemeProvider>
        <DeviceProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/beautypay-salon" />} />
              <Route path="/*" element={<CRMSystem />} />
              {/* CustomerDetails 라우트 설정 추가 */}
              <Route
                path="/customer-management/details/:id"
                element={<CustomerDetails />}
              />
            </Routes>
          </Router>
        </DeviceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
