// ScheduleModal.js

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Select,
  Radio,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ScheduleModal = ({ visible, onCancel, onSave, selectedDate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedDate) {
      form.setFieldsValue({
        date: selectedDate,
      });
    }
  }, [selectedDate, form]);

  const serviceColors = {
    커트: "#FF7F7F",
    퍼머: "#FFD700",
    염색: "#7FFF00",
    기타: "#87CEFA",
  };

  // 성별과 서비스별 기본 소요시간 (분)
  const serviceDurations = {
    남성: {
      커트: 30,
      퍼머: 60,
      염색: 45,
      기타: 30,
    },
    여성: {
      커트: 40,
      퍼머: 90,
      염색: 60,
      기타: 45,
    },
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const duration = serviceDurations[values.gender][values.service]; // 소요시간 계산

      const appointment = {
        id: Date.now().toString(), // 고유 ID 생성
        title: `${values.customerName} - ${values.service}`, // 고객 이름과 서비스 조합
        customerName: values.customerName,
        gender: values.gender,
        service: values.service,
        color: serviceColors[values.service], // 서비스별 색상
        duration, // 소요시간
        date: dayjs(values.date).format("YYYY-MM-DD"), // 날짜 형식 변환
        time: dayjs(values.time).format("HH:mm"), // 시간 형식 변환
      };

      onSave(appointment); // 부모 컴포넌트에 데이터 전달
      form.resetFields();
    });
  };

  return (
    <Modal open={visible} title="예약 생성" onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="customerName"
          label="고객 이름"
          rules={[{ required: true, message: "고객 이름을 입력하세요!" }]}
        >
          <Input placeholder="고객 이름 입력" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="성별"
          rules={[{ required: true, message: "성별을 선택하세요!" }]}
        >
          <Radio.Group>
            <Radio value="남성">남성</Radio>
            <Radio value="여성">여성</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="service"
          label="서비스"
          rules={[{ required: true, message: "서비스를 선택하세요!" }]}
        >
          <Select placeholder="서비스 선택">
            <Option value="커트">커트</Option>
            <Option value="퍼머">퍼머</Option>
            <Option value="염색">염색</Option>
            <Option value="기타">기타</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="date"
          label="날짜"
          rules={[{ required: true, message: "날짜를 선택하세요!" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="time"
          label="시간"
          rules={[{ required: true, message: "시간을 선택하세요!" }]}
        >
          <TimePicker className="w-full" format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            저장
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;
