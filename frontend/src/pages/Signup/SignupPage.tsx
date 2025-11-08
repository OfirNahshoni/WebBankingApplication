import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";

import TiltedCard from "../../components/bits/TiltedCard";
import AuthSplit from "../../components/layout/AuthSplit";
import { signup } from "../../lib/api";

interface SignupFormValues {
  email: string;
  password: string;
  phone: string;
}

export default function SignupPage() {
  const [form] = Form.useForm<SignupFormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      await signup(values);
      navigate("/dashboard");
    } catch (error) {
      const description = error instanceof Error ? error.message : "Sign up failed. Please try again.";
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
        <h2 style={{ color: "#ffffff", margin: 0, fontSize: 28 }}>Create your account</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 8 }}>
          Fill in your details to get started with WebBanking.
        </p>
      </div>

      <Form<SignupFormValues>
        layout="vertical"
        form={form}
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
          rules={[
            { required: true, message: "Please create a password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Minimum 6 characters"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^05\d[- ]?\d{7}$/, message: "מספר טלפון ישראלי לא תקין" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="05X-XXXXXXX"
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Sign up
          </Button>
        </Form.Item>
      </Form>

      <div style={{ marginTop: 16, textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
        <span>Already have an account? </span>
        <Link to="/" style={{ color: "#1677ff" }}>
          Log in
        </Link>
      </div>
    </Card>
  );

  return (
    <AuthSplit
      leftSlot={
        <TiltedCard
          imageSrc="../../src/assets/signup-pic.jpg"
          captionText="Create Account"
          showMobileWarning={false}
        />
      }
      rightSlot={rightColumn}
      hideLeftOnMobile={false}
    />
  );
}
