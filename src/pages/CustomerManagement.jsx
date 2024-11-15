import React, { useState, useEffect } from "react";
import { Input, Table, Modal, Tabs, Card, Pagination, Checkbox } from "antd";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useDevice } from "../context/DeviceContext";
import { useFirestoreQuery } from "../hooks/useFirestore";
import { decryptData } from "../services/encryptionUtils";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import highlightText from "../utils/highlightText";
import { CloseOutlined } from "@ant-design/icons";

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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 행
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { getDocuments, getDocumentCount, loading, lastVisibleDoc } =
    useFirestoreQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchTotalCustomers = async () => {
      try {
        const total = await getDocumentCount(
          "salons/Oc2MGp4nUw4q0nxHmWdM/customers"
        );
        setTotalCustomers(total);
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    fetchTotalCustomers();
  }, []);

  const fetchPagingData = async () => {
    try {
      // 현재 페이지에서 가져올 데이터 수 계산
      const remainingRecords = totalCustomers - (currentPage - 1) * pageSize;
      const currentLimit = Math.min(pageSize, remainingRecords); // 남은 데이터 수만큼 가져오기

      await getDocuments(
        "salons/Oc2MGp4nUw4q0nxHmWdM/customers",
        (pagingData) => {
          if (!pagingData || pagingData.length === 0) {
            setDisplayData([]);
            return;
          }

          const decryptedData = pagingData.map((customer, index) => ({
            ...customer,
            key: customer.id || `customer-${index}`,
            name: decryptData(customer.name),
            phone: decryptData(customer.phone),
            email: decryptData(customer.email),
            address: decryptData(customer.address),
          }));

          setDisplayData(decryptedData); // 현재 페이지 데이터 덮어쓰기
        },
        {
          orderByField: "createdAt",
          orderByDirection: "desc",
          limitNumber: currentLimit, // 동적으로 limit 설정
          lastVisible: currentPage === 1 ? null : lastVisibleDoc,
          realtime: false,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      fetchPagingData();
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
        "salons/Oc2MGp4nUw4q0nxHmWdM/customers",
        (searchResults) => {
          const decryptedData = searchResults.map((customer) => ({
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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRowKeys(displayData.map((item) => item.key)); // 모든 행 선택
    } else {
      setSelectedRowKeys([]); // 선택 해제
    }
  };

  const renderMobileCards = (data) => {
    return (
      <div className="flex flex-wrap gap-4">
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
                <h3 className="text-lg font-bold">
                  {isSearching
                    ? highlightText(customer.name, searchQuery)
                    : customer.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {isSearching
                    ? highlightText(
                        formatPhoneNumber(customer.phone),
                        searchQuery
                      )
                    : formatPhoneNumber(customer.phone)}
                </p>
              </div>
            </div>
            <p className="text-sm">
              <strong>주소:</strong>{" "}
              {isSearching
                ? highlightText(customer.address, searchQuery)
                : customer.address}
            </p>
            <p className="text-sm">
              <strong>이메일:</strong>{" "}
              {isSearching
                ? highlightText(customer.email, searchQuery)
                : customer.email}
            </p>
          </Card>
        ))}
      </div>
    );
  };

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
        {searchQuery && (
          <div
            className="absolute right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer"
            onClick={resetSearch}
          >
            <CloseOutlined className="text-white text-sm" />
          </div>
        )}
      </div>

      {isMobile ? (
        <>
          {renderMobileCards(isSearching ? searchData : displayData)}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCustomers}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4 text-center"
          />
        </>
      ) : (
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={[
            {
              title: "번호",
              dataIndex: "index",
              key: "index",
              render: (_, __, index) =>
                (currentPage - 1) * pageSize + index + 1,
              width: "5%",
            },
            {
              title: "이름",
              dataIndex: "name",
              key: "name",
              render: (text) =>
                isSearching ? highlightText(text, searchQuery) : text,
            },
            {
              title: "연락처",
              dataIndex: "phone",
              key: "phone",
              render: (text) =>
                isSearching
                  ? highlightText(formatPhoneNumber(text), searchQuery)
                  : formatPhoneNumber(text),
            },
            {
              title: "주소",
              dataIndex: "address",
              key: "address",
              render: (text) =>
                isSearching ? highlightText(text, searchQuery) : text,
            },
          ]}
          dataSource={isSearching ? searchData : displayData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalCustomers,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}

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
        </Tabs>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
