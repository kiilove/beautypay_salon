// src/utils/highlightText.js

import React from "react";

// 진한 연두색 하이라이트 스타일
const highlightStyle = {
  backgroundColor: "#b2ff66", // 진한 연두색
  fontWeight: "bold",
};

/**
 * 검색어와 일치하는 텍스트 부분을 하이라이트하는 함수
 * @param {string} text - 전체 텍스트
 * @param {string} keyword - 검색어
 * @returns {JSX.Element} - 하이라이트 처리된 텍스트
 */
const highlightText = (text, keyword) => {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex); // 검색어로 텍스트 분할
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={index} style={highlightStyle}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default highlightText;
