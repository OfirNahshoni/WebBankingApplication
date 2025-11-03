// frontend/components/Home/Signup/index.jsx

import { LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Row, Col } from "antd";
import { Link } from 'react-router-dom';

const { Item } = Form;

const Signup = () => {
    const onFinish = (values) => {
        console.log(values)
    }
    
    return (
        <>
        <div
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
                height: 64,
            }}
        >
            <Link to="/">
                <Button type="default" className="font-semibold">Login</Button>
            </Link>
        </div>
        <Row align="stretch" gutter={0} className="h-[calc(100vh-64px)]">
            {/* Left: Logo */}
            <Col xs={24} md={12} className="h-[50vh] md:h-full">
                <Card
                    className="bg-blue-200 h-full w-full rounded-none"
                    bodyStyle={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    bordered={true}
                >
                    <img 
                        src="/bank-dark-logo2.jpg" 
                        alt="Bank"
                        className="w-4/5 max-w-xl object-contain"
                    />
                </Card>
            </Col>
            {/* Right: Signup Form */}
            <Col xs={24} md={12} className="h-[50vh] md:h-full">
                <Card
                    className="bg-blue-200 h-full w-full rounded-none flex"
                    bodyStyle={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
                    bordered={true}
                >
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-center mb-6">Bank Signup</h2>
                        <Form
                            name="signup"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Item name="email" label="Email" rules={[{required:true}]}> 
                                <Input prefix={<UserOutlined />} placeholder="example@gmail.com" />
                            </Item>
                            <Item name="password" label="Password" rules={[{required:true}]}> 
                                <Input.Password prefix={<LockOutlined />} placeholder="********" />
                            </Item>
                            <Item name="phone" label="Phone" rules={[{required:true}]}> 
                                <Input prefix={<PhoneOutlined />} placeholder="05X-XXXXXXX" />
                            </Item>
                            <Item>
                                <Button type="primary" htmlType="submit" block>
                                    Submit
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
        </>
    )
}

export default Signup;
