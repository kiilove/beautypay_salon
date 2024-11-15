import React from "react";

const AppointmentItem = ({ item }) => (
  <div
    style={{
      borderLeft: `4px solid ${item.color}`,
      padding: "8px",
      margin: "8px 0",
    }}
  >
    {item.title} ({item.time}, {item.gender}, {item.duration}분)
  </div>
);

export default AppointmentItem;
