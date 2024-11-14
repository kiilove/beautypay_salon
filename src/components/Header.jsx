import React, { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useDevice } from "../context/DeviceContext";
import { useAuth } from "../context/AuthContext"; // useAuth 가져오기
import menuItems from "../menuItems";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { isMobile } = useDevice();
  const { userGroup } = useAuth(); // userGroup 가져오기
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

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
            </Drawer>
          </>
        ) : (
          <Menu
            theme={isDarkTheme ? "dark" : "light"}
            mode="horizontal"
            onClick={({ key }) => navigate(key)}
            selectedKeys={[location.pathname]}
            items={filteredMenuItems}
            className="bg-transparent flex-1"
            style={{ fontSize: "16px", fontWeight: 500 }}
          />
        )}
        <Button onClick={toggleTheme} type="primary">
          {isDarkTheme ? "Light Theme" : "Dark Theme"}
        </Button>
      </div>
    </AntHeader>
  );
};

export default Header;
