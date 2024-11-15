import React from "react";
import dayjs from "dayjs";
import AppointmentItem from "./AppointmentItem";

const WeekView = ({ currentDate, appointments }) => {
  const weekStart = currentDate.startOf("week");
  const weekEnd = currentDate.endOf("week");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    weekStart.clone().add(i, "day")
  );

  return (
    <div>
      <h2 style={{ marginBottom: 16, textAlign: "center" }}>
        {weekStart.format("YYYY년 MM월 DD일")} ~{" "}
        {weekEnd.format("YYYY년 MM월 DD일")}
      </h2>
      {weekDays.map((day) => {
        const formattedDate = day.format("YYYY-MM-DD");
        const dailyAppointments = (appointments || []).filter(
          (appointment) => appointment.date === formattedDate
        );

        return (
          <div key={formattedDate} style={{ marginBottom: 16 }}>
            <h3>{day.format("MM월 DD일 (ddd)")}</h3>
            {dailyAppointments.map((item) => (
              <AppointmentItem key={item.id} item={item} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
