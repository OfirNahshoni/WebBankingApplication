import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, InputNumber, Button, message } from "antd";
import { MailOutlined, DollarOutlined } from "@ant-design/icons";

import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers/AuthProvider";
import { transfer } from "../../lib/api";

interface TransferFormValues {
  to: string;
  amount: number;
}

export default function TransferPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<TransferFormValues>();

  const handleFinish = async (values: TransferFormValues) => {
    setLoading(true);
    try {
      await transfer(values);
      message.success("Transfer submitted successfully");
      form.resetFields();
    } catch (error) {
      const description = error instanceof Error ? error.message : "Transfer failed. Please try again.";
      message.error(description);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1115" }}>
      <PillNav
        logo="../../src/assets/logo.jpg"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Transfer", href: "/transfer" },
          { label: "Withdraw", href: "/withdraw" },
          { label: "Deposit", href: "/deposit" },
        ]}
        activeHref="/transfer"
        baseColor="#1677ff"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
        rightSlot={
          <Button
            type="primary"
            onClick={() => {
              auth?.logout?.();
              navigate("/");
            }}
          >
            Sign Out
          </Button>
        }
      />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <Card
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}
          bodyStyle={{ padding: 32 }}
        >
          <h2 style={{ color: "#ffffff", marginBottom: 24 }}>New Transfer</h2>

          <Form<TransferFormValues>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              label="Recipient Email"
              name="to"
              rules={[
                { required: true, message: "Please enter recipient email" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                type="email"
                placeholder="recipient@example.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Amount (USD)"
              name="amount"
              rules={[
                { required: true, message: "Please enter an amount" },
                {
                  validator: (_, value) =>
                    typeof value === "number" && value > 0
                      ? Promise.resolve()
                      : Promise.reject(new Error("Amount must be greater than 0")),
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={1}
                prefix={<DollarOutlined />}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Send
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
