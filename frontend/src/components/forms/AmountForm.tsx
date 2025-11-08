import React from "react";
import { Button, Form, InputNumber } from "antd";
import { DollarOutlined } from "@ant-design/icons";

type AmountFormProps = {
  buttonText: string;                  // e.g., "Withdraw" or "Deposit"
  onSubmit: (amount: number) => void;  // callback with validated amount
  loading?: boolean;
};

type AmountField = { amount?: number };

export default function AmountForm({ buttonText, onSubmit, loading }: AmountFormProps) {
  const [form] = Form.useForm<AmountField>();
  const handleFinish = (values: AmountField) => {
    if (typeof values.amount === "number") {
      onSubmit(values.amount);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: 420, maxWidth: "100%" }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item<AmountField>
        label="Amount"
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
          // Currency formatting as per AntD InputNumber docs
          formatter={(v) => (v === undefined || v === null ? "" : `$ ${v}`)}
          parser={(v) => (v || "").replace(/[^\d.]/g, "") as any}
          prefix={<DollarOutlined />}
        />
      </Form.Item>

      <Form.Item style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );
}
