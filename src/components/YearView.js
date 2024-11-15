import React from "react";
import { Calendar } from "antd";

const YearView = ({ currentDate, onDateSelect, cellRender }) => (
  <div>
    <h2 style={{ marginBottom: 16, textAlign: "center" }}>
      {currentDate.format("YYYY년")}
    </h2>
    <Calendar
      value={currentDate}
      onSelect={onDateSelect}
      headerRender={() => null}
      cellRender={cellRender}
      className="bg-white shadow-md rounded-lg p-4"
      mode="year"
    />
  </div>
);

export default YearView;
