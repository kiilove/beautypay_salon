import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Button } from "antd";
import BasicInfo from "../components/customer/BasicInfo";
import TreatmentHistory from "../components/customer/TreatmentHistory";
import Preferences from "../components/customer/Preferences";
import Consultation from "../components/customer/Consultation";

const { TabPane } = Tabs;

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = {
    key: id,
    name: "홍길동",
    phone: "010-1234-5678",
    email: "hong@example.com",
  };

  return (
    <div className="p-4">
      <Button onClick={() => navigate(-1)} className="mb-4">
        ← 돌아가기
      </Button>
      <h2>{customer.name}님의 상세 정보</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="기본 정보" key="1">
          <BasicInfo customer={customer} />
        </TabPane>
        <TabPane tab="시술 이력" key="2">
          <TreatmentHistory customer={customer} />
        </TabPane>
        <TabPane tab="고객 선호도" key="3">
          <Preferences customer={customer} />
        </TabPane>
        <TabPane tab="상담 기록" key="4">
          <Consultation customer={customer} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
