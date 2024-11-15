import React, { useContext, useEffect, useState } from "react";
import { Calendar, ConfigProvider, Button, Space } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/es/locale/ko_KR";
import { ScheduleContext } from "../context/ScheduleContext";

dayjs.locale("ko");

const CalendarComponent = () => {
  const { appointments } = useContext(ScheduleContext);
  const [viewMode, setViewMode] = useState("month"); // 보기 모드: 일(day), 주(week), 월(month), 년(year)
  const [currentDate, setCurrentDate] = useState(dayjs()); // 현재 기준 날짜

  useEffect(() => {
    console.log("Appointments in CalendarComponent:", appointments);
  }, [appointments]);

  const cellRender = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");

    const dailyAppointments = (appointments || []).filter(
      (appointment) => appointment.date === formattedDate
    );

    return (
      <ul className="list-disc pl-4">
        {dailyAppointments.map((item) => (
          <li
            key={item.id}
            className="text-sm"
            style={{ color: item.color }} // 서비스별 색상 적용
          >
            {item.title} ({item.time}, {item.gender}, {item.duration}분)
          </li>
        ))}
      </ul>
    );
  };

  const renderHeader = () => (
    <Space>
      <Button onClick={() => setViewMode("day")}>일</Button>
      <Button onClick={() => setViewMode("week")}>주</Button>
      <Button onClick={() => setViewMode("month")}>월</Button>
      <Button onClick={() => setViewMode("year")}>년</Button>
    </Space>
  );

  const renderContent = () => {
    if (viewMode === "day") {
      return (
        <div>
          <h2>{currentDate.format("YYYY년 MM월 DD일")}</h2>
          {appointments
            .filter(
              (appointment) =>
                appointment.date === currentDate.format("YYYY-MM-DD")
            )
            .map((item) => (
              <div
                key={item.id}
                style={{
                  borderLeft: `4px solid ${item.color}`,
                  padding: "8px",
                  margin: "8px 0",
                }}
              >
                {item.title} ({item.time}, {item.gender}, {item.duration}분)
              </div>
            ))}
        </div>
      );
    } else if (viewMode === "week") {
      const weekStart = currentDate.startOf("week");
      const weekEnd = currentDate.endOf("week");
      const weekDays = Array.from({ length: 7 }, (_, i) =>
        weekStart.add(i, "day")
      );

      return (
        <div>
          <h2>
            {weekStart.format("YYYY년 MM월 DD일")} ~{" "}
            {weekEnd.format("YYYY년 MM월 DD일")}
          </h2>
          {weekDays.map((day) => (
            <div key={day.format("YYYY-MM-DD")}>
              <h3>{day.format("YYYY-MM-DD")}</h3>
              {(appointments || [])
                .filter(
                  (appointment) => appointment.date === day.format("YYYY-MM-DD")
                )
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      borderLeft: `4px solid ${item.color}`,
                      padding: "8px",
                      margin: "8px 0",
                    }}
                  >
                    {item.title} ({item.time}, {item.gender}, {item.duration}분)
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
    } else if (viewMode === "month") {
      return (
        <Calendar
          cellRender={cellRender}
          className="bg-white shadow-md rounded-lg p-4"
        />
      );
    } else if (viewMode === "year") {
      return (
        <div>
          <h2>{currentDate.format("YYYY년")}</h2>
          {Array.from({ length: 12 }, (_, i) => dayjs().month(i)).map(
            (month) => (
              <div key={month.format("YYYY-MM")}>
                <h3>{month.format("YYYY년 MM월")}</h3>
                {(appointments || [])
                  .filter((appointment) =>
                    appointment.date.startsWith(month.format("YYYY-MM"))
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      style={{
                        borderLeft: `4px solid ${item.color}`,
                        padding: "8px",
                        margin: "8px 0",
                      }}
                    >
                      {item.title} ({item.time}, {item.gender}, {item.duration}
                      분)
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      );
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="bg-white shadow-md rounded-lg p-4">
        {renderHeader()}
        {renderContent()}
      </div>
    </ConfigProvider>
  );
};

export default CalendarComponent;
