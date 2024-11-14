import React, { createContext, useContext, useState } from "react";

// ThemeContext 생성
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // 테마 토글 함수
  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ThemeContext를 쉽게 사용할 수 있는 커스텀 훅
export const useTheme = () => useContext(ThemeContext);
