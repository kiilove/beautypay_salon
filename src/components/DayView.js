import React from "react";
import AppointmentItem from "./AppointmentItem";

const DayView = ({ currentDate, appointments }) => {
  const formattedDate = currentDate.format("YYYY-MM-DD");
  const dailyAppointments = (appointments || []).filter(
    (appointment) => appointment.date === formattedDate
  );

  return (
    <div>
      <h2 style={{ marginBottom: 16, textAlign: "center" }}>
        {currentDate.format("YYYY년 MM월 DD일")}
      </h2>
      {dailyAppointments.map((item) => (
        <AppointmentItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default DayView;
