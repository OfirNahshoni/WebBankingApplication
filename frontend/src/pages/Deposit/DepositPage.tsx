import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import {
  DashboardOutlined,
  SwapOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import AmountForm from "../../components/forms/AmountForm";
import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers/AuthProvider";
import { updateBalance } from "../../lib/api";
import { notifyError, notifySuccess, notifyWarning } from "../../lib/notify";

export default function DepositPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  const handleSubmit = async (amountInput: number) => {
    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      notifyWarning("Invalid amount", "Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      await updateBalance(Math.abs(amount));
      notifySuccess("Deposit successful", `Deposited $${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      setFormResetKey((value) => value + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      notifyError("Deposit failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1115" }}>
      <PillNav
        logo="../../src/assets/logo.jpg"
        logoAlt="Logo"
        items={[
          { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlined /> },
          { label: "Transfer", href: "/transfer", icon: <SwapOutlined /> },
          { label: "Withdraw", href: "/withdraw", icon: <ArrowUpOutlined /> },
          { label: "Deposit", href: "/deposit", icon: <ArrowDownOutlined /> },
        ]}
        activeHref="/deposit"
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
          <h2 style={{ color: "#ffffff", marginBottom: 24 }}>Deposit Funds</h2>

          <AmountForm
            key={formResetKey}
            buttonText={loading ? "Depositing..." : "Deposit"}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}
