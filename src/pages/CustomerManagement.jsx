import React, { useState, useEffect } from "react";
import { Input, Table, Modal, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../context/DeviceContext";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import BasicInfo from "../components/customer/BasicInfo";
import TreatmentHistory from "../components/customer/TreatmentHistory";
import Preferences from "../components/customer/Preferences";
import Consultation from "../components/customer/Consultation";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { decryptData } from "../services/encryptionUtils"; // 경로 수정된 부분
import highlightText from "../utils/highlightText";
import formatPhoneNumber from "../utils/formatPhoneNumber";

const { Search } = Input;
const { TabPane } = Tabs;

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false); // 검색 상태 관리
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { data: customerData, loading, getDocuments } = useFirestoreQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await getDocuments("customers", null, {
        realTime: true,
        limitNumber: pageSize,
        page: currentPage,
      });

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // customerData가 업데이트될 때마다 복호화하여 displayData로 설정
    const decryptedData = customerData.map((customer) => ({
      ...customer,
      name: decryptData(customer.name),
      phone: decryptData(customer.phone),
      email: decryptData(customer.email),
    }));
    setDisplayData(decryptedData);
  }, [customerData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (value) => {
    setSearchQuery(value);
    setIsSearching(true);

    const unsubscribe = await getDocuments("customers", (allData) => {
      const decryptedData = allData.map((customer) => ({
        ...customer,
        name: decryptData(customer.name),
        phone: decryptData(customer.phone),
        email: decryptData(customer.email),
      }));

      const isNumericSearch = /^\d+$/.test(value);

      const filtered = decryptedData.filter((customer) =>
        isNumericSearch
          ? customer.phone.includes(value) || customer.name.includes(value)
          : customer.name.includes(value) ||
            customer.phone.includes(value) ||
            customer.email.includes(value)
      );

      setFilteredData(filtered);
    });

    if (typeof unsubscribe === "function") {
      unsubscribe();
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setFilteredData([]);

    // customerData를 복호화한 후 첫 페이지 데이터만 표시
    const decryptedData = customerData.map((customer) => ({
      ...customer,
      name: decryptData(customer.name),
      phone: decryptData(customer.phone),
      email: decryptData(customer.email),
    }));
    setDisplayData(decryptedData.slice(0, pageSize)); // 첫 페이지 데이터만 다시 로드
    setCurrentPage(1); // 1페이지로 돌아가기
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    if (isMobile) {
      navigate(`/customer-management/details/${customer.key}`);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      render: (text) => highlightText(text, searchQuery),
    },
    {
      title: "연락처",
      dataIndex: "phone",
      key: "phone",
      render: (text) => highlightText(formatPhoneNumber(text), searchQuery),
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      render: (text) => highlightText(text, searchQuery),
    },
    {
      title: "상세 보기",
      key: "action",
      render: (_, customer) => (
        <a onClick={() => handleCustomerClick(customer)}>상세 정보</a>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">고객 관리</h1>

      {/* 검색 바 */}
      <Search
        placeholder="고객 이름, 연락처 또는 이메일로 검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        enterButton
        className="mb-4"
        suffix={
          isSearching ? (
            <CloseOutlined
              onClick={resetSearch}
              style={{ color: "red", cursor: "pointer" }}
            />
          ) : null
        }
      />

      <Table
        columns={columns}
        dataSource={searchQuery ? filteredData : displayData}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: searchQuery ? filteredData.length : displayData.length,
          onChange: handlePageChange,
        }}
        className="mb-4"
      />

      {!isMobile && (
        <Modal
          title={`${selectedCustomer?.name}님의 정보`}
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="기본 정보" key="1">
              <BasicInfo customer={selectedCustomer} />
            </TabPane>
            <TabPane tab="시술 이력" key="2">
              <TreatmentHistory customer={selectedCustomer} />
            </TabPane>
            <TabPane tab="고객 선호도" key="3">
              <Preferences customer={selectedCustomer} />
            </TabPane>
            <TabPane tab="상담 기록" key="4">
              <Consultation customer={selectedCustomer} />
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </div>
  );
};

export default CustomerManagement;
