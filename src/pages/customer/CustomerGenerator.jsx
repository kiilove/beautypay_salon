import React, { useState } from "react";
import { Input, Button, Table, Select, message } from "antd";
import { useFirestoreAddData } from "../../hooks/useFirestore";
import { encryptData, decryptData } from "../../services/encryptionUtils";
import dayjs from "dayjs";

const { Option } = Select;

const lastNames = ["김", "이", "박", "최", "정", "조", "윤", "임", "한", "류"];
const maleFirstNames = [
  "민수",
  "준호",
  "재현",
  "현수",
  "성민",
  "철수",
  "영훈",
  "성준",
  "진우",
  "동혁",
];
const femaleFirstNames = [
  "지은",
  "서현",
  "수연",
  "지민",
  "서윤",
  "은지",
  "혜수",
  "미영",
  "수진",
  "나연",
];
const emailDomains = ["example.com", "testmail.com", "korea.com", "email.com"];
const danwonDistricts = [
  "와동",
  "고잔동",
  "중앙동",
  "호수동",
  "원곡동",
  "신길동",
  "백운동",
  "초지동",
  "선부동",
  "대부동",
];

const generateRandomPhone = () => {
  return Math.random() < 0.05
    ? `031-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
        1000 + Math.random() * 9000
      )}`
    : `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
};

const generateRandomEmail = (firstName, lastName) => {
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  return `${lastName}${firstName}${Math.floor(Math.random() * 100)}@${domain}`;
};

const generateRandomGender = () => (Math.random() < 0.7 ? "여성" : "남성");

const getRandomSkinType = () => {
  const skinTypes = ["건성", "지성", "혼합형", ""];
  return skinTypes[Math.floor(Math.random() * skinTypes.length)];
};

const getRandomAllergies = () => {
  const allergies = ["", "꽃가루", "견과류", "동물 털", "해산물"];
  return allergies[Math.floor(Math.random() * allergies.length)];
};

const getRandomHairStyle = () => {
  const styles = ["", "긴 머리", "단발", "웨이브", "숏컷"];
  return styles[Math.floor(Math.random() * styles.length)];
};

const generateRandomCreatedAt = () => {
  const startDate = dayjs().subtract(2, "year");
  const endDate = dayjs();
  const randomDate = startDate.add(
    Math.random() * endDate.diff(startDate, "millisecond"),
    "millisecond"
  );
  return randomDate.format("YYYY-MM-DD HH:mm:ss");
};

const CustomerGenerator = () => {
  const { addData } = useFirestoreAddData();
  const [gender, setGender] = useState("혼합");
  const [count, setCount] = useState(1);
  const [generatedData, setGeneratedData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const generateCustomers = () => {
    const customers = Array.from({ length: count }, () => {
      const isFemale =
        gender === "여성" ||
        (gender === "혼합" && generateRandomGender() === "여성");

      const firstName = isFemale
        ? femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)]
        : maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];

      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      const fullName = `${lastName}${firstName}`;
      const phone = generateRandomPhone();
      const email = generateRandomEmail(firstName, lastName);
      const genderType = isFemale ? "여성" : "남성";
      const address = `안산시 단원구 ${
        danwonDistricts[Math.floor(Math.random() * danwonDistricts.length)]
      }`;

      return {
        key: `${fullName}-${phone}`,
        name: encryptData(fullName),
        phone: encryptData(phone),
        email: encryptData(email),
        address: encryptData(address),
        gender: genderType,
        notes: "테스트 데이터",
        customerPhoto: "",
        allergies: getRandomAllergies(),
        preferredHairStyle: getRandomHairStyle(),
        skinType: getRandomSkinType(),
        createdAt: generateRandomCreatedAt(),
      };
    });
    setGeneratedData(customers);
  };

  const handleSelectChange = (selectedRowKeys) => {
    setSelectedKeys(selectedRowKeys);
  };

  const saveSelectedCustomers = () => {
    const selectedCustomers = generatedData.filter((customer) =>
      selectedKeys.includes(customer.key)
    );

    selectedCustomers.forEach((customer) => {
      const dataToSave = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        gender: customer.gender,
        notes: customer.notes,
        customerPhoto: customer.customerPhoto,
        allergies: customer.allergies,
        preferredHairStyle: customer.preferredHairStyle,
        skinType: customer.skinType,
        createdAt: customer.createdAt,
      };

      addData("customers", dataToSave, (response) => {
        if (response) {
          message.success("데이터가 저장되었습니다.");
        } else {
          message.error("저장에 실패했습니다.");
        }
      });
    });

    setSelectedKeys([]);
  };

  const columns = [
    { title: "이름", dataIndex: "displayName", key: "name" },
    { title: "성별", dataIndex: "gender", key: "gender" },
    { title: "연락처", dataIndex: "displayPhone", key: "phone" },
    { title: "이메일", dataIndex: "displayEmail", key: "email" },
    { title: "주소", dataIndex: "displayAddress", key: "address" },
    { title: "피부 타입", dataIndex: "skinType", key: "skinType" },
    { title: "알레르기", dataIndex: "allergies", key: "allergies" },
    {
      title: "헤어 스타일",
      dataIndex: "preferredHairStyle",
      key: "preferredHairStyle",
    },
    { title: "생성일", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">가상 고객 생성</h1>

      <div className="mb-4">
        <Select
          defaultValue={gender}
          onChange={setGender}
          style={{ width: 120, marginRight: 10 }}
        >
          <Option value="여성">여성</Option>
          <Option value="남성">남성</Option>
          <Option value="혼합">혼합</Option>
        </Select>

        <Input
          type="number"
          min="1"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          style={{ width: 80, marginRight: 10 }}
          placeholder="인원 수"
        />

        <Button type="primary" onClick={generateCustomers}>
          생성
        </Button>
      </div>

      <Table
        rowSelection={{
          type: "checkbox",
          onChange: handleSelectChange,
        }}
        columns={columns}
        dataSource={generatedData.map((customer) => ({
          ...customer,
          displayName: decryptData(customer.name),
          displayPhone: decryptData(customer.phone),
          displayEmail: decryptData(customer.email),
          displayAddress: decryptData(customer.address),
        }))}
        pagination={false}
      />

      <Button
        type="primary"
        onClick={saveSelectedCustomers}
        disabled={selectedKeys.length === 0}
        className="mt-4"
      >
        선택한 고객 저장
      </Button>
    </div>
  );
};

export default CustomerGenerator;
