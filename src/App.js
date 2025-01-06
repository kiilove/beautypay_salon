import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CRMSystem from "./pages/CRMSystem";
import Login from "./pages/Login";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { DeviceProvider } from "./context/DeviceContext";
import { AuthProvider } from "./context/AuthContext";
import useFirebaseAuth from "./hooks/useAuth";
import { CircleLoader, PropagateLoader } from "react-spinners";
import Signup from "./pages/Signup";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useFirebaseAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Auth 상태 확인 중인지 여부
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCheckingAuth(false);
      setIsAuthenticated(!!currentUser); // currentUser가 존재하면 인증 완료
    }, 2000); // 최대 2초 대기
    console.log(currentUser);
    return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 타이머 정리
  }, [currentUser]);

  if (isCheckingAuth) {
    // Auth 상태 확인 중 로딩 표시
    return (
      <div className="w-full h-screen flex bg-white justify-center items-center">
        <PropagateLoader color="#fa8000" loading speedMultiplier={0.8} />
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 인증된 경우 요청된 컴포넌트 렌더링
  return children;
};

const AppContent = () => {
  const { isDarkTheme } = useTheme();

  return (
    <Router>
      <div className={isDarkTheme ? "dark" : ""}>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/beautypay-salon" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <CRMSystem />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
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
