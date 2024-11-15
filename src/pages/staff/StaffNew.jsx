import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  TimePicker,
  Tag,
  Space,
  Tabs,
  Card,
  Row,
  Col,
  Upload,
  message,
  ConfigProvider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import locale from "antd/es/locale/ko_KR";
import { useFirestoreAddData } from "../../hooks/useFirestore";

dayjs.locale("ko");

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = TimePicker;

const StaffNew = () => {
  const [specialties, setSpecialties] = useState([]);
  const [businessHours, setBusinessHours] = useState({
    weekdays: { start: null, end: null },
    weekends: { start: null, end: null },
  });
  const [form] = Form.useForm();
  const { addData, error: addedError, data: addedData } = useFirestoreAddData();

  const handleFinish = async (values) => {
    const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
      acc[key] = value === undefined || value === null ? "" : value;
      return acc;
    }, {});

    console.log("Form Values:", {
      ...cleanedValues,
      businessHours,
      specialties,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
    // 데이터 저장 로직 추가
    const formmatedValues = {
      ...cleanedValues,
      businessHours,
      specialties,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await addData(
        "salons/Oc2MGp4nUw4q0nxHmWdM/staffs",
        formmatedValues,
        (response) => {
          if (response) {
            message.success("새 스탭이 추가되었습니다.");
          } else {
            message.error("스탭 추가 실패!");
          }
        }
      );
    } catch (error) {
      message.error("스탭 추가 실패!");
    }
  };

  const handleAddSpecialty = (value) => {
    if (value && !specialties.includes(value)) {
      setSpecialties([...specialties, value]);
    }
  };

  const handleRemoveSpecialty = (value) => {
    setSpecialties(specialties.filter((specialty) => specialty !== value));
  };

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} 파일 업로드 완료`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 파일 업로드 실패`);
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

  return (
    <ConfigProvider locale={locale}>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          새 직원 추가
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: "active",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            tabPosition="top"
            style={{ marginBottom: 20 }}
          >
            <TabPane tab="기본 정보" key="1">
              <Card className="mb-6">
                <Form.Item name="photo" label="사진 업로드">
                  <Upload
                    name="photo"
                    listType="picture"
                    maxCount={1}
                    onChange={handleUploadChange}
                  >
                    <Button icon={<UploadOutlined />}>사진 업로드</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  name="name"
                  label="이름"
                  rules={[{ required: true, message: "이름을 입력하세요." }]}
                >
                  <Input placeholder="이름" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="전화번호"
                  rules={[
                    { required: true, message: "전화번호를 입력하세요." },
                  ]}
                >
                  <Input placeholder="전화번호" />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="주소"
                  rules={[{ required: true, message: "주소를 입력하세요." }]}
                >
                  <Input placeholder="주소" />
                </Form.Item>

                <Form.Item
                  name="emergencyContact"
                  label="비상연락망"
                  rules={[
                    { required: true, message: "비상연락망을 입력하세요." },
                  ]}
                >
                  <Input placeholder="비상연락망" />
                </Form.Item>
              </Card>
            </TabPane>

            <TabPane tab="부가 정보" key="2">
              <Card>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="주중 영업시간">
                      <RangePicker
                        format="HH:mm"
                        placeholder={["시작 시간", "종료 시간"]}
                        style={{ width: "100%" }}
                        onChange={(times) =>
                          handleBusinessHoursChange("weekdays", times)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="주말 영업시간">
                      <RangePicker
                        format="HH:mm"
                        placeholder={["시작 시간", "종료 시간"]}
                        style={{ width: "100%" }}
                        onChange={(times) =>
                          handleBusinessHoursChange("weekends", times)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="status"
                      label="상태"
                      rules={[
                        { required: true, message: "상태를 선택하세요." },
                      ]}
                    >
                      <Select>
                        <Option value="active">활동중</Option>
                        <Option value="inactive">비활동</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="전문분야">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Input.Search
                      placeholder="전문분야 추가"
                      enterButton="추가"
                      onSearch={handleAddSpecialty}
                    />
                    <div>
                      {specialties.map((specialty) => (
                        <Tag
                          closable
                          key={specialty}
                          onClose={() => handleRemoveSpecialty(specialty)}
                        >
                          {specialty}
                        </Tag>
                      ))}
                    </div>
                  </Space>
                </Form.Item>

                <Form.Item label="첨부파일 업로드" name="attachment">
                  <Upload
                    name="attachment"
                    listType="file"
                    maxCount={1}
                    onChange={handleUploadChange}
                  >
                    <Button icon={<UploadOutlined />}>첨부파일 업로드</Button>
                  </Upload>
                </Form.Item>
              </Card>
            </TabPane>
          </Tabs>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="w-full py-3">
              직원 추가
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default StaffNew;
