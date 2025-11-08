import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Typography, Button } from "antd";

import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers/AuthProvider";
import { getBalance } from "../../lib/api";

interface TransactionRow {
  key: string;
  index: number;
  amount: string;
  to: string;
  status: string;
}

function formatBalance(value?: string): string {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "0.00";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [balanceState, setBalanceState] = useState<{ loading: boolean; error: string | null; balance: string }>(
    { loading: true, error: null, balance: "0.00" }
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchBalance() {
      try {
        const response = await getBalance();
        if (cancelled) return;
        setBalanceState({ loading: false, error: null, balance: formatBalance(response.balance) });
      } catch (error) {
        console.error("Failed to load balance", error);
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Unable to load balance";
        setBalanceState((prev) => ({ ...prev, loading: false, error: message }));
      }
    }

    fetchBalance();

    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        width: 80,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "To",
        dataIndex: "to",
        key: "to",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
    ],
    []
  );

  const dataSource: TransactionRow[] = useMemo(
    () => [
      {
        key: "1",
        index: 1,
        amount: "$1,250.00",
        to: "Savings Account",
        status: "Completed",
      },
      {
        key: "2",
        index: 2,
        amount: "$540.00",
        to: "Visa •• 3846",
        status: "Pending",
      },
      {
        key: "3",
        index: 3,
        amount: "$2,100.00",
        to: "Investment Portfolio",
        status: "Completed",
      },
    ],
    []
  );

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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <Card
          style={{
            marginBottom: 24,
            background: "linear-gradient(135deg, rgba(22,119,255,0.24), rgba(22,119,255,0.08))",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            boxShadow: "0 18px 38px rgba(0,0,0,0.22)",
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Typography.Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16 }}>
            Your balance
          </Typography.Text>
          <Typography.Title level={1} style={{ color: "#ffffff", marginTop: 12, marginBottom: 0 }}>
            ${balanceState.balance}
          </Typography.Title>
        </Card>
        {balanceState.error && (
          <Typography.Text style={{ color: "#ff7875", display: "block", marginBottom: 24 }}>
            {balanceState.error}
          </Typography.Text>
        )}

        <Card
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          bodyStyle={{ padding: 24 }}
        >
          <Typography.Title level={4} style={{ color: "#ffffff", marginBottom: 16 }}>
            Recent activity
          </Typography.Title>
          <Table<TransactionRow>
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered={false}
            scroll={{ x: true }}
            style={{ background: "transparent" }}
          />
        </Card>
      </div>
    </div>
  );
}
