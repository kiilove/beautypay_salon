import React, { useState } from "react";
import { Calendar, ConfigProvider, Button, Space, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import locale from "antd/es/locale/ko_KR";
import { PlusOutlined } from "@ant-design/icons";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";

dayjs.locale("ko");

const ViewModes = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

const CalendarComponent = ({ appointments, onAddAppointment }) => {
  const [viewMode, setViewMode] = useState(ViewModes.MONTH);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const onPrev = () => {
    setCurrentDate((prevDate) => prevDate.subtract(1, viewMode));
  };

  const onNext = () => {
    setCurrentDate((prevDate) => prevDate.add(1, viewMode));
  };

  const onToday = () => {
    setCurrentDate(dayjs());
  };

  const years = Array.from(
    { length: 21 },
    (_, i) => currentDate.year() - 10 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentDate((prevDate) => prevDate.clone().startOf(mode));
  };

  const handleSelectDate = (date) => {
    console.log("Selected Date:", date.format("YYYY-MM-DD"));
    setCurrentDate(date.clone());
    setViewMode(ViewModes.DAY);
  };

  const renderHeader = () => (
    <Space style={{ marginBottom: 16 }}>
      {Object.values(ViewModes).map((mode) => (
        <Button
          key={mode}
          onClick={() => handleViewModeChange(mode)}
          type={viewMode === mode ? "primary" : "default"}
        >
          {mode === ViewModes.DAY
            ? "일"
            : mode === ViewModes.WEEK
            ? "주"
            : mode === ViewModes.MONTH
            ? "월"
            : "년"}
        </Button>
      ))}
      <Button onClick={onPrev}>이전</Button>
      <Button onClick={onToday}>오늘</Button>
      <Button onClick={onNext}>다음</Button>
      <Select
        value={currentDate.year()}
        onChange={(year) => setCurrentDate(currentDate.clone().year(year))}
        style={{ width: 100 }}
      >
        {years.map((year) => (
          <Select.Option key={year} value={year}>
            {year}년
          </Select.Option>
        ))}
      </Select>
      <Select
        value={currentDate.month() + 1}
        onChange={(month) =>
          setCurrentDate(currentDate.clone().month(month - 1))
        }
        style={{ width: 100 }}
      >
        {months.map((month) => (
          <Select.Option key={month} value={month}>
            {month}월
          </Select.Option>
        ))}
      </Select>
    </Space>
  );

  const monthCellRender = (current) => {
    const formattedMonth = current.format("YYYY-MM");
    const monthlyAppointments = (appointments || []).filter((appointment) =>
      appointment.date.startsWith(formattedMonth)
    );

    return monthlyAppointments.length > 0 ? (
      <div
        className="notes-month"
        onClick={() => handleSelectDate(current)}
        style={{ cursor: "pointer" }}
      >
        <span>{monthlyAppointments.length}건의 예약</span>
      </div>
    ) : null;
  };

  const dateCellRender = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");
    const dailyAppointments = (appointments || []).filter(
      (appointment) => appointment.date === formattedDate
    );

    return (
      <div style={{ position: "relative", minHeight: 60 }}>
        {dailyAppointments.length > 0 && (
          <ul className="list-disc pl-4">
            {dailyAppointments.slice(0, 3).map((item) => (
              <li
                key={item.id}
                className="text-sm"
                style={{ color: item.color }}
              >
                {item.title}
              </li>
            ))}
            {dailyAppointments.length > 3 && (
              <li className="text-sm text-gray-500">...</li>
            )}
          </ul>
        )}
        <Button
          shape="circle"
          icon={<PlusOutlined className="text-blue-500" />}
          size="small"
          style={{
            position: "absolute",
            bottom: -15,
            right: 2,
          }}
          onClick={() => onAddAppointment(current)}
        />
      </div>
    );
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewModes.DAY:
        return (
          <DayView currentDate={currentDate} appointments={appointments} />
        );
      case ViewModes.WEEK:
        return (
          <WeekView currentDate={currentDate} appointments={appointments} />
        );
      case ViewModes.MONTH:
        return (
          <Calendar
            headerRender={() => null}
            value={currentDate}
            onSelect={handleSelectDate}
            cellRender={dateCellRender}
          />
        );
      case ViewModes.YEAR:
        return (
          <YearView
            currentDate={currentDate}
            onDateSelect={(date) => {
              setCurrentDate(date);
              setViewMode(ViewModes.MONTH);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="bg-white p-4">
        {renderHeader()}
        {renderContent()}
      </div>
    </ConfigProvider>
  );
};

export default CalendarComponent;
