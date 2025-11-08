import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, message } from "antd";

import AmountForm from "../../components/forms/AmountForm";
import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers";
import { deposit } from "../../lib/api";

export default function DepositPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (amount: number) => {
    setLoading(true);
    try {
      await deposit({ amount });
      message.success("Deposit submitted successfully");
    } catch (error) {
      const description = error instanceof Error ? error.message : "Deposit failed. Please try again.";
      message.error(description);
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
          { label: "Dashboard", href: "/dashboard" },
          { label: "Transfer", href: "/transfer" },
          { label: "Withdraw", href: "/withdraw" },
          { label: "Deposit", href: "/deposit" },
        ]}
        activeHref="/deposit"
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
          <h2 style={{ color: "#ffffff", marginBottom: 24 }}>Deposit Funds</h2>

          <AmountForm buttonText="Deposit" onSubmit={handleSubmit} loading={loading} />
        </Card>
      </div>
    </div>
  );
}
