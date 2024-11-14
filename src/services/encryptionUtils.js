import forge from "node-forge";

const secretKey = process.env.REACT_APP_SECRET_KEY;

export const encryptData = (data) => {
  if (!data) return ""; // 빈 값 처리

  const key = forge.util.createBuffer(secretKey).getBytes(32);
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher("AES-GCM", key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(data, "utf8"));
  cipher.finish();

  const encryptedData = forge.util.encode64(cipher.output.getBytes());
  const encodedIv = forge.util.encode64(iv);
  const authTag = forge.util.encode64(cipher.mode.tag.getBytes()); // 인증 태그 추출 및 인코딩
  return `${encodedIv}:${encryptedData}:${authTag}`; // IV, 암호화된 데이터, 인증 태그 결합
};

export const decryptData = (encryptedDataWithIv) => {
  if (!encryptedDataWithIv || !encryptedDataWithIv.includes(":")) {
    console.warn("Invalid encrypted data format"); // 형식 오류 경고
    return ""; // 유효하지 않은 데이터는 빈 문자열 반환
  }

  const [encodedIv, encryptedData, encodedTag] = encryptedDataWithIv.split(":");
  if (!encodedIv || !encryptedData || !encodedTag) {
    console.warn("Invalid encrypted data format - missing IV, data, or tag");
    return ""; // 유효하지 않은 데이터는 빈 문자열 반환
  }

  const key = forge.util.createBuffer(secretKey).getBytes(32);
  const iv = forge.util.decode64(encodedIv);
  const data = forge.util.decode64(encryptedData);
  const authTag = forge.util.decode64(encodedTag); // 인증 태그 디코딩

  try {
    const decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({ iv, tag: forge.util.createBuffer(authTag) }); // 인증 태그 포함
    decipher.update(forge.util.createBuffer(data));
    const result = decipher.finish();

    if (!result) {
      console.warn("Authentication tag does not match");
      return ""; // 인증 오류 시 빈 문자열 반환
    }

    return decipher.output.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return ""; // 복호화 실패 시 빈 문자열 반환
  }
};
