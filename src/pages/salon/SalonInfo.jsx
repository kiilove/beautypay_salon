import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Checkbox,
  TimePicker,
  Select,
  Upload,
  message,
  Modal,
  ConfigProvider,
} from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import locale from "antd/es/locale/ko_KR";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import { useFirestoreAddData } from "../../hooks/useFirestore";

dayjs.locale("ko");

const { RangePicker } = TimePicker;
const { Option } = Select;

const SalonInfo = () => {
  const [form] = Form.useForm();
  const [businessHours, setBusinessHours] = useState({
    weekdays: { start: null, end: null },
    weekends: { start: null, end: null },
  });
  const [checkedWeeks, setCheckedWeeks] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isShopManagerModalVisible, setShopManagerModalVisible] =
    useState(false);
  const [isDistributorModalVisible, setDistributorModalVisible] =
    useState(false);

  const { addData, error: addedError, data: addedData } = useFirestoreAddData();
  const onFinish = async (values) => {
    // Helper function to replace undefined or null with an empty string
    const cleanValues = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[key] = value === undefined || value === null ? "" : value;
        return acc;
      }, {});
    };

    // Clean the main form values
    const cleanedValues = cleanValues(values);

    // Format the business hours and holidays
    const formattedValues = {
      ...cleanedValues,
      businessHours, // Assuming this is already handled elsewhere in your code
      holidays: {
        weeks: checkedWeeks, // Assuming checkedWeeks is defined
        days: selectedDays, // Assuming selectedDays is defined
      },
    };

    delete formattedValues.logo;

    try {
      await addData("salons", formattedValues);

      if (addedError) {
        message.error("사업장 등록에 실패했습니다.");
        console.log(addedError);
        console.log("폼 제출 데이터:", formattedValues);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      message.success("새로운 사업장이 등록되었습니다.");
      console.log("폼 제출 데이터:", formattedValues);
    }
  };

  const handleBusinessHoursChange = (type, times) => {
    setBusinessHours((prev) => ({
      ...prev,
      [type]: {
        start: times && times[0] ? times[0].format("HH:mm") : null,
        end: times && times[1] ? times[1].format("HH:mm") : null,
      },
    }));
  };

  const handleWeekChange = (values) => {
    setCheckedWeeks(values);
  };

  const handleDayChange = (values) => {
    setSelectedDays(values);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-left">사업장 정보</h2>
      <ConfigProvider locale={locale}>
        <Form
          form={form}
          name="salonInfoForm"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* 기본 정보 */}
          <Card
            title="기본 정보"
            className="mb-6"
            styles={{ header: { backgroundColor: "#f1f8e9" } }}
            style={{ borderColor: "#aed581" }}
          >
            <Form.Item label="로고" name="logo">
              <Upload name="logo" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>로고 업로드</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="상호명"
              name="name"
              rules={[{ required: true, message: "상호명을 입력해주세요!" }]}
            >
              <Input placeholder="예: 서울 강남점" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="사업자등록번호"
                  name="businessNumber"
                  rules={[
                    {
                      required: true,
                      message: "사업자등록번호를 입력해주세요!",
                    },
                  ]}
                >
                  <Input placeholder="예: 123-45-67890" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="대표자명"
                  name="ownerName"
                  rules={[
                    { required: true, message: "대표자명을 입력해주세요!" },
                  ]}
                >
                  <Input placeholder="대표자명 입력" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="주소"
              name="address"
              rules={[{ required: true, message: "주소를 입력해주세요!" }]}
            >
              <Input placeholder="예: 서울시 강남구..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="업태"
                  name="industry"
                  rules={[{ required: true, message: "업태를 입력해주세요!" }]}
                >
                  <Input placeholder="예: 서비스" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="종목"
                  name="sector"
                  rules={[{ required: true, message: "종목을 입력해주세요!" }]}
                >
                  <Input placeholder="예: 미용" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="과세/비과세"
                  name="taxType"
                  rules={[
                    { required: true, message: "과세 유형을 선택해주세요!" },
                  ]}
                >
                  <Select placeholder="과세 유형 선택">
                    <Option value="과세">과세</Option>
                    <Option value="비과세">비과세</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="샵 관리자" name="shopManager">
              <Search
                onClick={() => setShopManagerModalVisible(true)}
                onSearch={() => setShopManagerModalVisible(true)}
                type="button"
              />
            </Form.Item>

            <Form.Item label="담당 총판" name="distributor">
              <Search
                onClick={() => setDistributorModalVisible(true)}
                onSearch={() => setDistributorModalVisible(true)}
                type="button"
              />
            </Form.Item>
          </Card>

          {/* 영업시간 설정 */}
          <Card
            title="영업시간 설정"
            className="mb-6"
            styles={{ header: { backgroundColor: "#e3f2fd" } }}
            style={{
              borderColor: "#90caf9",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="주중 영업시간">
                  <RangePicker
                    format="HH:mm"
                    locale={{
                      okText: "확인",
                      cancelText: "취소",
                      placeholder: "시작 시간 및 종료 시간 선택",
                    }}
                    onChange={(times) =>
                      handleBusinessHoursChange("weekdays", times)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="주말(공휴일) 영업시간">
                  <RangePicker
                    format="HH:mm"
                    locale={{
                      okText: "확인",
                      cancelText: "취소",
                      placeholder: "시작 시간 및 종료 시간 선택",
                    }}
                    onChange={(times) =>
                      handleBusinessHoursChange("weekends", times)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 휴무일 설정 */}
          <Card
            title="휴무일 설정"
            className="mb-6"
            styles={{ header: { backgroundColor: "#fce4ec" } }}
            style={{ borderColor: "#f8bbd0" }}
          >
            <Form.Item label="주차별 휴무">
              <Checkbox.Group
                options={["1주", "2주", "3주", "4주", "5주"]}
                value={checkedWeeks}
                onChange={handleWeekChange}
              />
            </Form.Item>
            <Form.Item label="요일별 휴무">
              <Checkbox.Group
                options={[
                  { label: "월요일", value: "Monday" },
                  { label: "화요일", value: "Tuesday" },
                  { label: "수요일", value: "Wednesday" },
                  { label: "목요일", value: "Thursday" },
                  { label: "금요일", value: "Friday" },
                  { label: "토요일", value: "Saturday" },
                  { label: "일요일", value: "Sunday" },
                ]}
                value={selectedDays}
                onChange={handleDayChange}
              />
            </Form.Item>
          </Card>

          {/* 제출 버튼 */}
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="w-full py-3">
              데이터 제출
            </Button>
          </Form.Item>

          {/* 샵 관리자 모달 */}
          <Modal
            title="샵 관리자 검색"
            open={isShopManagerModalVisible}
            onCancel={() => setShopManagerModalVisible(false)}
            footer={null}
          >
            <p>샵 관리자 검색 모달 내용</p>
          </Modal>

          {/* 담당 총판 모달 */}
          <Modal
            title="담당 총판 검색"
            open={isDistributorModalVisible}
            onCancel={() => setDistributorModalVisible(false)}
            footer={null}
          >
            <p>담당 총판 검색 모달 내용</p>
          </Modal>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default SalonInfo;
