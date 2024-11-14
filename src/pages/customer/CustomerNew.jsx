import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Tabs,
  Upload,
  Row,
  Col,
  Card,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useFirestoreAddData } from "../../hooks/useFirestore";
import { encryptData } from "../../services/encryptionUtils";

const { TabPane } = Tabs;
const { Option } = Select;

const CustomerNew = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { addData, loading, error } = useFirestoreAddData(); // 훅 사용

  // 새 고객 추가 로직
  const onFinish = (values) => {
    // 선택값이 비어있다면 공란 처리
    const formattedValues = {
      ...values,
      name: encryptData(values.name) || "", // 이름 암호화 후 공란 처리
      phone: encryptData(values.phone) || "", // 연락처 암호화 후 공란 처리
      email: values.email ? encryptData(values.email) : "", // 이메일이 있으면 암호화 후 공란 처리
      address: values.address ? encryptData(values.address) : "", // 주소가 있으면 암호화 후 공란 처리
      notes: values.notes || "", // 공란 처리
      customerPhoto: values.customerPhoto || "", // 공란 처리
      allergies: values.allergies || "", // 공란 처리
      preferredHairStyle: values.preferredHairStyle || "", // 공란 처리
      skinType: values.skinType || "", // 공란 처리
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // 현재 날짜 저장
    };

    // 고객 데이터를 Firestore에 저장
    addData("customers", formattedValues, (response) => {
      if (response) {
        message.success("새 고객이 추가되었습니다.");
        navigate("/customer-management/customer-list"); // 고객 리스트 페이지로 이동
      } else {
        message.error("고객 추가 실패!");
      }
    });
  };

  // 사진 업로드 처리
  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} 파일 업로드 완료`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 파일 업로드 실패`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">새 고객 추가</h2>
      <Form
        form={form}
        name="customerNew"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
      >
        {/* 탭을 사용하여 기본정보와 부가정보를 구분 */}
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          style={{ marginBottom: 20 }}
        >
          <TabPane tab="기본 정보" key="1">
            <Card className="mb-6">
              <Form.Item
                label="고객 이름"
                name="name"
                rules={[
                  { required: true, message: "고객 이름을 입력해주세요!" },
                ]}
              >
                <Input placeholder="고객 이름" />
              </Form.Item>

              <Form.Item
                label="연락처"
                name="phone"
                rules={[{ required: true, message: "연락처를 입력해주세요!" }]}
              >
                <Input placeholder="연락처" />
              </Form.Item>
            </Card>
          </TabPane>

          <TabPane tab="부가 정보" key="2">
            <Card>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="고객 사진" name="customerPhoto">
                    <Upload
                      name="photo"
                      listType="picture"
                      onChange={handleUploadChange}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>사진 업로드</Button>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="주소" name="address">
                    <Input.TextArea placeholder="주소" rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="기타 메모" name="notes">
                <Input.TextArea placeholder="기타 메모" rows={4} />
              </Form.Item>

              <Form.Item label="알레르기 정보" name="allergies">
                <Input.TextArea placeholder="알레르기 정보" rows={4} />
              </Form.Item>

              <Form.Item label="헤어 스타일 선호" name="preferredHairStyle">
                <Input placeholder="헤어 스타일 선호" />
              </Form.Item>

              <Form.Item label="피부 타입" name="skinType">
                <Select placeholder="피부 타입">
                  <Option value="dry">건성</Option>
                  <Option value="oily">지성</Option>
                  <Option value="combination">혼합형</Option>
                </Select>
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>

        {/* 고객 추가 버튼 */}
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" className="w-full py-3">
            고객 추가
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerNew;
