import React from "react";
import { Calendar } from "antd";

const MonthView = ({ currentDate, onDateSelect, cellRender }) => (
  <div>
    <h2 style={{ marginBottom: 16, textAlign: "center" }}>
      {currentDate.format("YYYY년 MM월")}
    </h2>
    <Calendar
      value={currentDate}
      onSelect={onDateSelect}
      headerRender={() => null}
      cellRender={cellRender}
      className="bg-white shadow-md rounded-lg p-4"
      mode="month"
    />
  </div>
);

export default MonthView;
