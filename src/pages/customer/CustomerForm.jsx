import React, { useCallback } from "react";
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
import { UploadOutlined } from "@ant-design/icons";
import { useCustomerFormHandler } from "../../hooks/useCustomerFormHandler";
import { useEffect } from "react";
import { useDevice } from "../../context/DeviceContext";
const { TabPane } = Tabs;
const { Option } = Select;

const CustomerForm = ({ onSubmit, initialValues }) => {
  const { isMobile } = useDevice();
  const [form] = Form.useForm();
  const {
    formValues,
    errors,
    images,
    tempImages,
    isSubmitting,
    isUploading,
    uploadProgress,
    handleChange,
    handleDateChange,
    handleImageAdd,
    handleImageRemove,
    formSubmit,
  } = useCustomerFormHandler(initialValues);

  const handleFormSubmit = () => {
    formSubmit(onSubmit, { ...initialValues, ...form.getFieldsValue() });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">새 고객 추가</h2>
      <Form
        form={form}
        name="customerNew"
        onFinish={handleFormSubmit}
        layout="vertical"
        initialValues={initialValues}
      >
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
                label="성별"
                name="gender"
                rules={[{ required: true, message: "성별을 선택해주세요!" }]}
              >
                <Select placeholder="성별 선택">
                  <Option value="여성">여성</Option>
                  <Option value="남성">남성</Option>
                  <Option value="기타">기타</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="연락처"
                name="phone"
                rules={[{ required: true, message: "연락처를 입력해주세요!" }]}
              >
                <Input placeholder="연락처" />
              </Form.Item>
              <Form.Item label="이메일" name="email">
                <Input placeholder="이메일" />
              </Form.Item>
            </Card>
          </TabPane>

          <TabPane tab="부가 정보" key="2">
            <Card>
              <Row gutter={16}>
                <Col span={isMobile ? 24 : 12}>
                  <Form.Item label="고객 사진" name="customerPhoto">
                    <Upload name="photo" listType="picture" maxCount={1}>
                      <Button icon={<UploadOutlined />}>사진 업로드</Button>
                    </Upload>
                  </Form.Item>
                </Col>

                <Col span={isMobile ? 24 : 12}>
                  <Form.Item label="주소" name="address">
                    <Input.TextArea placeholder="주소" rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="기타 메모" name="note">
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
                  <Option value="건성">건성</Option>
                  <Option value="지성">지성</Option>
                  <Option value="혼합">혼합형</Option>
                </Select>
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" className="w-full py-3">
            고객 추가
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerForm;
