import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";

import PillNav from "../../components/nav/PillNav";
import { useAuth } from "../../app/providers/AuthProvider";
import { getBalance, getTransactions } from "../../lib/api";
import type { Transaction } from "../../types";
import { notifyError } from "../../lib/notify";

const { Title, Text } = Typography;

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
  const { user, logout } = useAuth();
  const currentEmail = user?.email ?? "";

  const [balanceState, setBalanceState] = useState<{ loading: boolean; error: string | null; balance: string }>(
    { loading: true, error: null, balance: "0.00" }
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 5 });

  // load balance
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
        const errMessage = error instanceof Error ? error.message : "Unable to load balance";
        setBalanceState((prev) => ({ ...prev, loading: false, error: errMessage }));
      }
    }

    fetchBalance();

    return () => {
      cancelled = true;
    };
  }, []);

  // load transactions
  useEffect(() => {
    let mounted = true;

    const loadTransactions = async () => {
      setTxLoading(true);
      try {
        const current = pagination.current ?? 1;
        const type = showIn ? "in" : "out";
        const data = await getTransactions(current, type);
        if (mounted) {
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Failed to load transactions";
        notifyError("Transactions error", errMessage);
      } finally {
        if (mounted) {
          setTxLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      mounted = false;
    };
  }, [showIn, pagination.current]);

  const outTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === "out"),
    [transactions]
  );

  const inTransactions = useMemo(
    () => transactions.filter((tx) => tx.status === "in"),
    [transactions]
  );

  const baseColumns: ColumnsType<Transaction> = useMemo(
    () => [
      {
        title: "#",
        dataIndex: "row",
        key: "row",
        width: 80,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amt: number) => `$ ${Number(amt ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        sorter: (a, b) => (a.amount ?? 0) - (b.amount ?? 0),
      },
      { title: "To", dataIndex: "to", key: "to" },
      { title: "From", dataIndex: "from", key: "from" },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (d: string) => (d ? new Date(d).toLocaleString() : "-"),
        sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        defaultSortOrder: "descend",
      },
    ],
    [pagination]
  );

  const displayedColumns = useMemo(() => {
    if (showIn) {
      // Only show From column for incoming
      return baseColumns.filter((column) => column.key !== "to");
    }
    // Only show To column for outgoing
    return baseColumns.filter((column) => column.key !== "from");
  }, [baseColumns, showIn]);

  const dataSource = showIn ? inTransactions : outTransactions;

  const handleTableChange: TableProps<Transaction>["onChange"] = (nextPagination) => {
    setPagination({
      current: nextPagination.current ?? 1,
      pageSize: 5,
    });
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
        baseColor="#1677ff"
        pillColor="#cfdfff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000022"
        rightSlot={
          <Button
            type="primary"
            onClick={() => {
              logout();
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
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16 }}>Your balance</Text>
          <Title level={1} style={{ color: "#ffffff", marginTop: 12, marginBottom: 0 }}>
            ${balanceState.balance}
          </Title>
        </Card>
        {balanceState.error && (
          <Text style={{ color: "#ff7875", display: "block", marginBottom: 24 }}>
            {balanceState.error}
          </Text>
        )}

        <Card
          bordered={false}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
          }}
        >
          <Space align="center" style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
            <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
              {showIn ? "In Transactions" : "Out Transactions"}
            </Title>
            <Button
              type="primary"
              onClick={() => {
                setShowIn((prev) => !prev);
                setTransactions([]);
                setPagination({ current: 1, pageSize: pagination.pageSize ?? 5 });
              }}
            >
              {showIn ? "Out Transactions" : "In Transactions"}
            </Button>
          </Space>

          <Table<Transaction>
            rowKey="id"
            columns={displayedColumns}
            dataSource={dataSource}
            loading={txLoading}
            pagination={{
              current: pagination.current ?? 1,
              pageSize: 5,
            }}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </div>
  );
}
