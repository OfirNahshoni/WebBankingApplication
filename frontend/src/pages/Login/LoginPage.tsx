import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Checkbox, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import TiltedCard from "../../components/bits/TiltedCard";
import AuthSplit from "../../components/layout/AuthSplit";

import { useAuth } from "../../app/providers";

type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function LoginPage() {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinish = async ({ email, password }: LoginFormValues) => {
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      const description = error instanceof Error ? error.message : "Unable to login. Please try again.";
      message.error(description);
    } finally {
      setLoading(false);
    }
  };

  const rightColumn = (
    <Card
      style={{
        width: 420,
        maxWidth: "100%",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(6px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      }}
      bodyStyle={{ padding: 28 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#ffffff", margin: 0, fontSize: 28 }}>Welcome back</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8 }}>Login to enter to your account</p>
      </div>

      <Form<LoginFormValues>
        layout="vertical"
        form={form}
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            type="email"
            placeholder="you@example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Your password"
            size="large"
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: "rgba(255,255,255,0.75)" }}>Remember me</Checkbox>
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 16, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
        <span>New here? </span>
        <Link to="/signup" style={{ color: "#1677ff" }}>
          Create an account
        </Link>
      </div>
    </Card>
  );

  return (
    <AuthSplit
      leftSlot={
        <TiltedCard
          imageSrc="../../src/assets/login-pic.jpg"
          captionText="Bank Login"
          showMobileWarning={false}
        />
      }
      rightSlot={rightColumn}
      hideLeftOnMobile={false}
    />
  );
}
