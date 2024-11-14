import React, { createContext } from "react";
import { useMediaQuery } from "react-responsive";

// DeviceContext 생성
const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  // 모바일 화면 기준 너비 설정 (768px 이하일 경우 모바일로 간주)
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => React.useContext(DeviceContext);
