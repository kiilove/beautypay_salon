import React, { useState } from "react";
import { Layout } from "antd";
import { useTheme } from "../context/ThemeContext";
import { useDevice } from "../context/DeviceContext";
import menuItems from "../menuItems";
import Header from "../components/Header";
import AppRoutes from "../components/AppRoutes"; // 분리한 Routes

const { Content } = Layout;

const CRMSystem = ({ userGroup }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { isMobile } = useDevice();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);

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

  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4 bg-white ">
        <AppRoutes />
      </Content>
    </Layout>
  );
};

export default CRMSystem;
