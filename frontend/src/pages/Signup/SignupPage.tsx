import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from "antd";
import { MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";

import TiltedCard from "../../components/bits/TiltedCard";
import AuthSplit from "../../components/layout/AuthSplit";
import { signup } from "../../lib/api";
import { notifyError, notifySuccess } from "../../lib/notify";

interface SignupFormValues {
  email: string;
  password: string;
  phone: string;
}

export default function SignupPage() {
  const [form] = Form.useForm<SignupFormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async ({ email, password, phone }: SignupFormValues) => {
    setLoading(true);
    try {
      await signup({ email, password, phone });
      notifySuccess("Signup successful", "Check your mailbox to activate your account.");
      navigate("/", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      notifyError("Signup failed", message);
    } finally {
      setLoading(false);
    }
  };

  const rightColumn = (
    <Card
      style={{
        width: 420,
        maxWidth: "100%",
        background: "#ffffff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
      bodyStyle={{ padding: 28 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#262626", margin: 0, fontSize: 28 }}>Create your account</h2>
        <p style={{ color: "rgba(0,0,0,0.65)", marginTop: 8 }}>
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

      <div style={{ marginTop: 16, textAlign: "center", color: "rgba(0,0,0,0.65)" }}>
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
          imageSrc="../../src/assets/bank-logo1.jpg"
          captionText="Create Account"
          showMobileWarning={false}
        />
      }
      rightSlot={rightColumn}
      hideLeftOnMobile={false}
    />
  );
}
