import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, InputNumber, Button } from "antd";
import {
  MailOutlined,
  DollarOutlined,
  DashboardOutlined,
  SwapOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers/AuthProvider";
import { transfer } from "../../lib/api";
import { notifyError, notifySuccess, notifyWarning } from "../../lib/notify";

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
    const recipientEmail = values.to?.trim();
    const amount = Number(values.amount);

    if (!recipientEmail) {
      notifyWarning("Missing recipient", "Please enter a recipient email.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      notifyWarning("Invalid amount", "Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      await transfer({ recipientEmail, amount });
      notifySuccess(
        "Transfer successful",
        `Sent $${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
      );
      form.resetFields();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      notifyError("Transfer failed", message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1115" }}>
      <PillNav
        logo="../../src/assets/logo.jpg"
        items={[
          { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlined /> },
          { label: "Transfer", href: "/transfer", icon: <SwapOutlined /> },
          { label: "Withdraw", href: "/withdraw", icon: <ArrowUpOutlined /> },
          { label: "Deposit", href: "/deposit", icon: <ArrowDownOutlined /> },
        ]}
        activeHref="/transfer"
        baseColor="#071a3d"
        pillColor="rgba(11, 89, 233, 0.12)"
        hoveredPillTextColor="#0b1937"
        activePillTextColor="#0b1937"
        rightSlot={
          <Button
            className="pill-nav-signout"
            size="large"
            ghost
            icon={<LogoutOutlined />}
            style={{
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.4)",
              color: "#f6f8ff",
              paddingInline: 24,
              height: 48,
              fontWeight: 600,
            }}
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
              <Button type="primary" htmlType="submit" block size="large" loading={loading} disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
