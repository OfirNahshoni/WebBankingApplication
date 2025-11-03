// frontend/components/Layout/UserLayout/index.jsx

import React, { useMemo, useState } from 'react';
import {
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SendOutlined,
    DollarCircleOutlined,
    DownCircleOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const UserLayout = ({children}) => {
    const location = useLocation();

    const items = useMemo(() => ([
            {
              key: '/transfer',
              icon: <SendOutlined />,
              label: <Link to="/transfer">Transfer</Link>,
            },
            {
              key: '/withdraw',
              icon: <DownCircleOutlined />,
              label: <Link to="/withdraw">Withdraw</Link>,
            },
            {
              key: '/deposit',
              icon: <DollarCircleOutlined />,
              label: <Link to="/deposit">Deposit</Link>,
            },
            {
              key: '/',
              icon: <LogoutOutlined />,
              label: <Link to="/">Sign out</Link>,
            },
            {
              key: '/user',
              icon: <DashboardOutlined />,
              label: <Link to="/user">Dashboard</Link>,
            },
          ]), []);

    const selectedKey = useMemo(() => {
        // Select dashboard when at '/user'
        const path = location.pathname;
        if (path === '/user') return '/user';
        // Match first segment route keys if present
        const match = ['\/transfer','\/withdraw','\/deposit','\/logout']
            .find(p => new RegExp(`^${p}(?:$|\/)`).test(path));
        return match ? match.replace('\\','') : '/user';
    }, [location.pathname]);
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    
    return (
        <Layout className='!min-h-screen'>
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={items}
            />
        </Sider>
        <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                }}
            />
            </Header>
            <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
            {children}
            </Content>
        </Layout>
        </Layout>
    );
};

export default UserLayout;
