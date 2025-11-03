// frontend/components/Layout/HomeLayout/index.jsx

import React from 'react';
import { Button, Layout } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;

const HomeLayout = ({children}) => {
    return (
        <Layout className="min-h-screen bg-blue-950">
            <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                paddingLeft: 16,
                paddingRight: 16,
            }}
            >
                <Link to="/signup">
                    <Button type="default" className="font-semibold">Sign up</Button>
                </Link>
            </Header>
            <Content
            style={{
                margin: 0,
                padding: 0,
                minHeight: 'calc(100vh - 64px)',
                background: 'transparent',
            }}
            >
                {children}
            </Content>
        </Layout>
    );
};

export default HomeLayout;
