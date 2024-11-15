import {
  UserOutlined,
  CalendarOutlined,
  PieChartOutlined,
  SettingOutlined,
  DatabaseOutlined,
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
    key: "/salon-management",
    icon: <DatabaseOutlined />,
    label: "마이데이터",
    allowedGroups: ["admin"],
    children: [
      {
        key: "/salon-management/salon-info", // 회사 정보
        label: "회사 정보",
        allowedGroups: ["admin"],
      },
      {
        key: "/salon-management/staff-management", // 직원 관리
        label: "직원 관리",
        allowedGroups: ["admin"],
      },
      {
        key: "/salon-management/staff-new", // 새 직원 추가
        label: "새 직원 추가",
        allowedGroups: ["admin"],
      },
    ],
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
        key: "/customer-management/customer-generator", // 가상 고객 추가
        label: "가상 고객 추가",
        allowedGroups: ["admin", "staff"],
      },
      {
        key: "/customer-management/customer-list", // 고객 리스트
        label: "고객 리스트",
        allowedGroups: ["admin", "staff", "user"],
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
