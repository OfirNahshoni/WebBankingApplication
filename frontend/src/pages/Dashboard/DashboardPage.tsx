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
  const [outTransactions, setOutTransactions] = useState<Transaction[]>([]);
  const [inTransactions, setInTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [outPagination, setOutPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 5, total: 0 });
  const [inPagination, setInPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 5, total: 0 });

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

  // load outgoing transactions (page changes or initial mount)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setTxLoading(true);
      try {
        const currentPage = outPagination.current ?? 1;
        const response = await getTransactions(currentPage, "out");
        if (cancelled) return;
        setOutTransactions(response.items ?? []);
        setOutPagination({
          current: response.page ?? currentPage,
          pageSize: response.pageSize ?? 5,
          total: response.total ?? 0,
        });
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Failed to load transactions";
        notifyError("Transactions error", errMessage);
      } finally {
        if (!cancelled) {
          setTxLoading(false);
        }
      }
    };

    if (!showIn || outTransactions.length === 0) {
      load();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outPagination.current, showIn]);

  // load incoming transactions when needed
  useEffect(() => {
    if (!showIn && inTransactions.length > 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setTxLoading(true);
      try {
        const currentPage = inPagination.current ?? 1;
        const response = await getTransactions(currentPage, "in");
        if (cancelled) return;
        setInTransactions(response.items ?? []);
        setInPagination({
          current: response.page ?? currentPage,
          pageSize: response.pageSize ?? 5,
          total: response.total ?? 0,
        });
      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "Failed to load transactions";
        notifyError("Transactions error", errMessage);
      } finally {
        if (!cancelled) {
          setTxLoading(false);
        }
      }
    };

    if (showIn) {
      load();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inPagination.current, showIn]);

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
    []
  );

  const displayedColumns = useMemo(() => {
    if (showIn) {
      return baseColumns.filter((column) => column.key !== "to");
    }

    return baseColumns.filter((column) => column.key !== "from");
  }, [baseColumns, showIn]);

  const dataSource = showIn ? inTransactions : outTransactions;

  const handleTableChange: TableProps<Transaction>["onChange"] = (nextPagination) => {
    const nextPage = nextPagination.current ?? 1;

    if (showIn) {
      setInPagination((prev) => ({ ...prev, current: nextPage }));
    } else {
      setOutPagination((prev) => ({ ...prev, current: nextPage }));
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
              current: showIn ? inPagination.current ?? 1 : outPagination.current ?? 1,
              pageSize: 5,
              total: showIn ? inPagination.total ?? 0 : outPagination.total ?? 0,
              showSizeChanger: false,
            }}
            onChange={handleTableChange}
          />
        </Card>
      </div>
    </div>
  );
}
