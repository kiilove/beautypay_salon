import React, { useState, useEffect, useRef } from "react";
import { Input, Table, Modal, Tabs, Card } from "antd";
import { Avatar, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../context/DeviceContext";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { decryptData } from "../services/encryptionUtils";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import { CloseOutlined } from "@ant-design/icons";
import highlightText from "../utils/highlightText";

const { Search } = Input;
const { TabPane } = Tabs;

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const listRef = useRef(null);

  const { getDocuments, getDocumentCount, loading } = useFirestoreQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchTotalCustomers = async () => {
      try {
        const total = await getDocumentCount("customers");
        setTotalCustomers(total);
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    fetchTotalCustomers();
  }, []);

  useEffect(() => {
    if (!isSearching) {
      const fetchData = async () => {
        try {
          await getDocuments(
            "customers",
            (allData) => {
              if (!allData || allData.length === 0) {
                if (currentPage === 1) setDisplayData([]);
                return;
              }

              const decryptedData = allData.map((customer, index) => ({
                ...customer,
                key: customer.id || `customer-${index}`,
                name: decryptData(customer.name),
                phone: decryptData(customer.phone),
                email: decryptData(customer.email),
                address: decryptData(customer.address),
              }));

              setDisplayData((prevData) => [...prevData, ...decryptedData]);
            },
            {
              orderByField: "createdAt",
              orderByDirection: "asc",
              limitNumber: pageSize,
              page: currentPage,
            }
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [currentPage, isSearching]);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      resetSearch();
      return;
    }

    setSearchQuery(value);
    setIsSearching(true);
    setCurrentPage(1);

    try {
      await getDocuments(
        "customers",
        (allData) => {
          const decryptedData = allData.map((customer) => ({
            ...customer,
            name: decryptData(customer.name),
            phone: decryptData(customer.phone),
            email: decryptData(customer.email),
            address: decryptData(customer.address),
          }));

          const searchTerm = value.toLowerCase();
          const isNumericSearch = /^\d+$/.test(value);

          const filtered = decryptedData.filter((customer) => {
            if (isNumericSearch) {
              return customer.phone.replace(/[^0-9]/g, "").includes(searchTerm);
            }
            return (
              customer.name.toLowerCase().includes(searchTerm) ||
              customer.email.toLowerCase().includes(searchTerm) ||
              customer.phone.includes(searchTerm)
            );
          });

          setSearchData(filtered);
        },
        {
          orderByField: "createdAt",
          orderByDirection: "asc",
        }
      );
    } catch (error) {
      console.error("Error searching customers:", error);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchData([]);
    setCurrentPage(1);
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

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (isMobile && listRef.current) {
      listRef.current.addEventListener("scroll", handleScroll);
      return () => listRef.current.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile, loading]);

  const renderMobileCards = (data) => {
    return (
      <div ref={listRef} className="flex flex-wrap gap-4 overflow-auto h-full">
        {data.map((customer) => (
          <Card
            key={customer.key}
            className="w-full border rounded-md p-4 shadow-sm"
            onClick={() => handleCustomerClick(customer)}
          >
            <div className="flex items-center mb-4">
              <Avatar
                src={customer.customerPhoto || undefined}
                size="large"
                style={{
                  backgroundColor: customer.customerPhoto
                    ? "transparent"
                    : "#f56a00",
                }}
              >
                {!customer.customerPhoto && customer.name.charAt(0)}
              </Avatar>
              <div className="ml-4">
                <h3 className="text-lg font-bold">{customer.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatPhoneNumber(customer.phone)}
                </p>
              </div>
            </div>
            <p className="text-sm">
              <strong>주소:</strong> {customer.address}
            </p>
            <p className="text-sm">
              <strong>이메일:</strong> {customer.email}
            </p>
          </Card>
        ))}
      </div>
    );
  };

  const columns = [
    {
      title: "선택",
      dataIndex: "checkbox",
      key: "checkbox",
      render: (_, customer) => <Checkbox />,
      width: "5%",
    },
    {
      title: "순서",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: "5%",
    },
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            src={record.customerPhoto || undefined}
            size="large"
            style={{
              backgroundColor: record.customerPhoto ? "transparent" : "#f56a00",
            }}
          >
            {!record.customerPhoto && text.charAt(0).toUpperCase()}
          </Avatar>
          <span className="ml-2">
            {isSearching ? highlightText(text, searchQuery) : text}
          </span>
        </div>
      ),
    },
    {
      title: "연락처",
      dataIndex: "phone",
      key: "phone",
      render: (text) => {
        const formatted = formatPhoneNumber(text);
        return isSearching ? highlightText(formatted, searchQuery) : formatted;
      },
    },
    {
      title: "주소",
      dataIndex: "address",
      key: "address",
      render: (text) => {
        return isSearching ? highlightText(text, searchQuery) : text;
      },
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      render: (text) => (isSearching ? highlightText(text, searchQuery) : text),
    },
    {
      title: "상세 보기",
      key: "action",
      render: (_, customer) => (
        <a
          onClick={() => handleCustomerClick(customer)}
          className="text-blue-500"
        >
          상세 정보
        </a>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">고객 관리</h1>

      <div className="relative mb-4">
        <Search
          placeholder="고객 이름, 연락처 또는 이메일로 검색"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              resetSearch();
            }
            setSearchQuery(value);
          }}
          onSearch={handleSearch}
          enterButton
          size="large"
        />
        {isSearching && (
          <div
            className="absolute right-20 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer"
            onClick={resetSearch}
          >
            <CloseOutlined className="text-white text-sm" />
          </div>
        )}
      </div>

      {isMobile ? (
        renderMobileCards(isSearching ? searchData : displayData)
      ) : (
        <Table
          columns={columns}
          dataSource={isSearching ? searchData : displayData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: isSearching ? searchData.length : totalCustomers,
            onChange: (page) => setCurrentPage(page),
          }}
          className="mb-4"
        />
      )}

      {!isMobile && (
        <Modal
          title={`${selectedCustomer?.name}님의 정보`}
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="기본 정보" key="1">
              <p>기본 정보 내용</p>
            </TabPane>
            <TabPane tab="시술 이력" key="2">
              <p>시술 이력 내용</p>
            </TabPane>
            <TabPane tab="고객 선호도" key="3">
              <p>고객 선호도 내용</p>
            </TabPane>
            <TabPane tab="상담 기록" key="4">
              <p>상담 기록 내용</p>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </div>
  );
};

export default CustomerManagement;
