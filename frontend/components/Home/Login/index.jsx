// frontend/components/Home/Login/index.jsx

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Checkbox, Typography, Row, Col } from "antd";

const { Item } = Form;

const Login = () => {
    const onFinish = (values) => {
        console.log(values)
    }
    
    return (
        <Row align="stretch" gutter={0} className="h-[calc(100vh-64px)]">
            {/* Left: Logo */}
            <Col xs={24} md={12} className="h-[50vh] md:h-full">
                <Card
                    className="bg-blue-200 h-full w-full rounded-none"
                    bodyStyle={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    bordered={true}
                >
                    <img
                        src="/bank-dark-logo1.jpg"
                        alt="Bank"
                        className="w-4/5 max-w-xl object-contain"
                    />
                </Card>
            </Col>
            {/* Right: Form */}
            <Col xs={24} md={12} className="h-[50vh] md:h-full">
                <Card
                    className="bg-blue-200 h-full w-full rounded-none flex"
                    bodyStyle={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
                    bordered={true}
                >
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-center mb-6">Bank Login</h2>
                        <Form
                            name="login"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                                <Input prefix={<UserOutlined />} placeholder="example@gmail.com" />
                            </Item>
                            <Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="********" />
                            </Item>
                            <div className="flex items-center justify-between mb-3">
                                <Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Item>
                                <Item name="forgotPassword" noStyle>
                                    <Typography.Link href="#">Forgot password?</Typography.Link>
                                </Item>
                            </div>
                            <Item>
                                <Button type="primary" htmlType="submit" block>
                                    Login
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
    )
}

export default Login;
