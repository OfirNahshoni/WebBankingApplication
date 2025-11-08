import React, { PropsWithChildren } from "react";
import { Card, Typography } from "antd";

type AuthFormProps = {
  title: string;
  subtitle?: string;
  width?: number | string;
};

export default function AuthForm({
  title,
  subtitle,
  width = 420,
  children,
}: PropsWithChildren<AuthFormProps>) {
  return (
    <Card
      style={{
        width,
        maxWidth: "100%",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(6px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>

        {subtitle && (
          <Typography.Paragraph type="secondary" style={{ marginTop: 6 }}>
            {subtitle}
          </Typography.Paragraph>
        )}
      </div>

      <div>{children}</div>
    </Card>
  );
}

