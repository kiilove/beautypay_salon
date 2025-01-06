import React, { useState } from "react";
import { encryptData } from "../services/encryptionUtils";
import { cleanedFormValues } from "../utils/cleanFormValues";

export const useCustomerFormHandler = ({ initialState, option = {} }) => {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 상태

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value ?? "" }));
  };
  // 날짜 변경 핸들러
  const handleDateChange = (name, date) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: date ?? "",
    }));
  };

  // 폼 제출 핸들러
  const formSubmit = async (onSubmit, values) => {
    console.log(values);
    const cleaned = cleanedFormValues(values);
    console.log(cleaned);
    const encryptedValues = {
      ...cleaned,
      name: encryptData(cleaned.name),
    };
  };
  return { formSubmit };
};
