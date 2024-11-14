import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userGroup, setUserGroup] = useState(() => {
    // 세션에서 userGroup을 가져오거나 기본값 설정
    return sessionStorage.getItem("userGroup") || "guest";
  });

  useEffect(() => {
    // userGroup 변경 시 세션에 저장
    sessionStorage.setItem("userGroup", userGroup);
  }, [userGroup]);

  return (
    <AuthContext.Provider value={{ userGroup, setUserGroup }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 커스텀 훅
export const useAuth = () => useContext(AuthContext);
