import React from "react";
import { useFirestoreAddData } from "../../hooks/useFirestore";
import CustomerForm from "./CustomerForm";
import dayjs from "dayjs";

const CustomerNew = () => {
  const addCustomer = useFirestoreAddData();
  const initialValues = {
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "여성",
    note: "",
    customerPhoto: "",
    allergies: "",
    preferredHairStyle: "",
    skinType: "",
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  const handleSubmit = async (data) => {
    console.log(data);
  };
  return <CustomerForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CustomerNew;
