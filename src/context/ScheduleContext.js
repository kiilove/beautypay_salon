import React, { createContext, useReducer } from "react";

const initialState = {
  appointments: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };
    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.payload.id
            ? { ...appointment, ...action.payload }
            : appointment
        ),
      };
    case "DELETE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== action.payload
        ),
      };
    case "GET_APPOINTMENTS":
      return state; // READ operation (no modification to state, returns current state)
    default:
      return state;
  }
};

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ScheduleContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
};
