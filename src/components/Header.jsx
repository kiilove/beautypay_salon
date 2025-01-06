import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Avatar, Popconfirm } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useDevice } from "../context/DeviceContext";
import { useAuth } from "../context/AuthContext"; // useAuth 가져오기
import menuItems from "../menuItems";
import useFirebaseAuth from "../hooks/useAuth";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { isMobile } = useDevice();
  const { userGroup } = useAuth(); // userGroup 가져오기
  const [userEmail, setUserEmail] = useState(
    sessionStorage.getItem("userEmail")
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { logOut } = useFirebaseAuth();

  // 사용자 그룹에 맞는 메뉴 필터링
  const filteredMenuItems = menuItems
    .filter(
      (item) => !item.allowedGroups || item.allowedGroups.includes(userGroup)
    )
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) =>
          !child.allowedGroups || child.allowedGroups.includes(userGroup)
      ),
    }));

  // Drawer 열기/닫기
  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

  const handleLogout = () => {};

  return (
    <AntHeader
      className={isDarkTheme ? "bg-gray-800" : "bg-white shadow-md"}
      style={{ padding: isMobile ? "10px 20px" : "0 20px" }}
    >
      <div className="flex justify-between items-center">
        {isMobile ? (
          <>
            <Button icon={<MenuOutlined />} onClick={toggleDrawer} />
            <Drawer
              title="메뉴"
              placement="left"
              onClose={toggleDrawer}
              visible={drawerVisible}
            >
              <Menu
                theme={isDarkTheme ? "dark" : "light"}
                mode="inline"
                onClick={({ key }) => {
                  navigate(key);
                  toggleDrawer();
                }}
                selectedKeys={[location.pathname]}
                items={filteredMenuItems}
              />
              <Popconfirm
                title="로그아웃 하시겠습니까?"
                onConfirm={() => logOut()}
                okText="예"
                cancelText="아니오"
              >
                <Button type="default" block style={{ marginTop: "20px" }}>
                  로그아웃
                </Button>
              </Popconfirm>
            </Drawer>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Menu
              theme={isDarkTheme ? "dark" : "light"}
              mode="horizontal"
              onClick={({ key }) => navigate(key)}
              selectedKeys={[location.pathname]}
              items={filteredMenuItems}
              className="bg-transparent flex-1"
              style={{ fontSize: "16px", fontWeight: 500 }}
            />
            <p className="text-gray-200">{userEmail}</p>
            <Popconfirm
              title="로그아웃 하시겠습니까?"
              onConfirm={() => logOut()}
              okText="예"
              cancelText="아니오"
            >
              <Button type="default" style={{ marginLeft: "20px" }}>
                로그아웃
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
