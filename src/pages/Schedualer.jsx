import React, { useState, useContext } from "react";
import { ScheduleProvider, ScheduleContext } from "../context/ScheduleContext";
import CalendarComponent from "../components/Calendar";
import ScheduleModal from "../components/ScheduleModal";
import { Button } from "antd";

const InnerApp = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { appointments, dispatch } = useContext(ScheduleContext);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSave = (appointment) => {
    dispatch({ type: "CREATE_APPOINTMENT", payload: appointment });
    console.log("Saved appointment:", appointment); // 디버깅
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const handleAddAppointment = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start items-center gap-x-2">
        <h1 className="text-2xl font-bold">예약 스케줄링</h1>
        <Button onClick={() => setIsModalVisible(true)}>예약 추가</Button>
      </div>
      <CalendarComponent
        appointments={appointments}
        onAddAppointment={handleAddAppointment}
      />
      <ScheduleModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedDate(null);
        }}
        onSave={handleSave}
        selectedDate={selectedDate}
      />
    </div>
  );
};

const Schedualer = () => {
  return (
    <ScheduleProvider>
      <InnerApp />
    </ScheduleProvider>
  );
};

export default Schedualer;
