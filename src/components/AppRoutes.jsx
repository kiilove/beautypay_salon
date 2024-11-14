import React from "react";
import { Routes, Route } from "react-router-dom";
import BeautyPaySalon from "../pages/BeautyPaySalon";
import CustomerManagement from "../pages/CustomerManagement";
import BasicInfo from "../components/customer/BasicInfo";
import TreatmentHistory from "../components/customer/TreatmentHistory";
import Preferences from "../components/customer/Preferences";
import Consultation from "../components/customer/Consultation";
import MembershipPoints from "../components/customer/MembershipPoints";
import ReservationManagement from "../pages/ReservationManagement";
import Booking from "../components/reservation/Booking";
import Notifications from "../components/reservation/Notifications";
import CalendarView from "../components/reservation/CalendarView";
import StaffSchedule from "../components/reservation/StaffSchedule";
import ChangeCancel from "../components/reservation/ChangeCancel";
import StatisticsManagement from "../pages/StatisticsManagement";
import AdminPage from "../pages/AdminPage";
import CustomerNew from "../pages/customer/CustomerNew";
import CustomerGenerator from "../pages/customer/CustomerGenerator";

const AppRoutes = () => (
  <Routes>
    {/* 메인 페이지 */}
    <Route path="/beautypay-salon" element={<BeautyPaySalon />} />

    {/* 고객 관리 */}
    <Route path="/customer-management">
      <Route path="customer-new" element={<CustomerNew />} />
      <Route path="customer-generator" element={<CustomerGenerator />} />
      <Route path="customer-list" element={<CustomerManagement />} />
    </Route>

    {/* 예약 관리 */}
    <Route path="/reservation-management" element={<ReservationManagement />}>
      <Route path="booking" element={<Booking />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="calendar-view" element={<CalendarView />} />
      <Route path="staff-schedule" element={<StaffSchedule />} />
      <Route path="change-cancel" element={<ChangeCancel />} />
    </Route>

    {/* 통계 관리 */}
    <Route path="/statistics-management" element={<StatisticsManagement />} />

    {/* 관리자 페이지 */}
    <Route path="/admin-page" element={<AdminPage />} />
  </Routes>
);

export default AppRoutes;
