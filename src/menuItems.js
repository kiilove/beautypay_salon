import {
  UserOutlined,
  CalendarOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React from "react";

const menuItems = [
  {
    key: "/beautypay-salon",
    icon: <UserOutlined />,
    label: "BeautyPay Salon",
    allowedGroups: ["admin", "staff", "user"],
  },
  {
    key: "/customer-management",
    icon: <UserOutlined />,
    label: "고객 관리",
    allowedGroups: ["admin", "staff", "user"],
    children: [
      {
        key: "/customer-management/customer-new", // 새 고객 추가
        label: "새 고객 추가",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/customer-management/customer-list", // 고객 리스트
        label: "고객 리스트",
        allowedGroups: ["admin", "staff", "user"],
      },
      {
        key: "/customer-management/basic-info",
        label: "고객 정보",
        allowedGroups: ["admin", "staff", "user"],
      },
      {
        key: "/customer-management/treatment-history",
        label: "시술 이력",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/customer-management/preferences",
        label: "고객 취향/선호도",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/customer-management/consultation",
        label: "상담 기록",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/customer-management/membership-points",
        label: "멤버십/포인트 관리",
        allowedGroups: ["admin"],
      },
    ],
  },
  {
    key: "/reservation-management",
    icon: <CalendarOutlined />,
    label: "예약 관리",
    allowedGroups: ["admin", "staff"],
    children: [
      {
        key: "/reservation-management/booking",
        label: "예약 접수/확인",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/reservation-management/notifications",
        label: "예약 알림 관리",
        allowedGroups: ["admin"],
      },
      {
        key: "/reservation-management/calendar-view",
        label: "캘린더 뷰",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/reservation-management/staff-schedule",
        label: "직원별 스케줄",
        allowedGroups: ["admin"],
      },
      {
        key: "/reservation-management/change-cancel",
        label: "예약 취소/변경 관리",
        allowedGroups: ["admin", "staff"],
      },
    ],
  },
  {
    key: "/statistics-management",
    icon: <PieChartOutlined />,
    label: "통계 관리",
    allowedGroups: ["admin"],
  },
  {
    key: "/admin-page",
    icon: <SettingOutlined />,
    label: "관리자 페이지",
    allowedGroups: ["admin"],
  },
];

export default menuItems;
