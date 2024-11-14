// src/utils/formatPhoneNumber.js

/**
 * 한국 전화번호를 포맷팅하는 함수
 * @param {string} phoneNumber - 입력된 전화번호 문자열
 * @returns {string} 포맷된 전화번호 문자열
 */
const formatPhoneNumber = (phoneNumber) => {
  // 숫자 외의 문자를 제거
  const cleaned = phoneNumber.replace(/[^\d]/g, "");

  // 휴대전화 번호 패턴 (010-XXXX-XXXX)
  if (/^010\d{8}$/.test(cleaned)) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 일반 전화번호 패턴 (지역번호 포함)
  // 02-XXX-XXXX 또는 02-XXXX-XXXX
  if (/^02\d{7,8}$/.test(cleaned)) {
    return cleaned.length === 9
      ? cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3")
      : cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 기타 지역번호 패턴 (서울 외 3자리 지역번호)
  // 031-XXX-XXXX 또는 031-XXXX-XXXX
  if (/^\d{2,3}\d{7,8}$/.test(cleaned)) {
    return cleaned.length === 10
      ? cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
      : cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 포맷에 맞지 않으면 원본 반환
  return phoneNumber;
};

export default formatPhoneNumber;
