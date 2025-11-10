import React, { ReactNode } from "react";

type AuthSplitProps = {
  leftSlot: ReactNode;                 // e.g., <TiltedCard ... />
  rightSlot: ReactNode;                // e.g., <AuthForm>...</AuthForm>
  minHeight?: string;                  // default: 100vh
  hideLeftOnMobile?: boolean;          // default: false
};

export default function AuthSplit({
  leftSlot,
  rightSlot,
  minHeight = "100vh",
  hideLeftOnMobile = false,
}: AuthSplitProps) {
  return (
    <div
      className="authsplit-root"
      style={{
        minHeight,
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(22,119,255,0.16), transparent 60%), #0f1115",
        color: "#ffffff",
      }}
    >
      {/* LEFT column (visual) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
        className="authsplit-left"
      >
        <div style={{ maxWidth: 520, width: "100%" }}>{leftSlot}</div>
      </div>

      {/* RIGHT column (form) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        className="authsplit-right"
      >
        {rightSlot}
      </div>

      {/* Responsive rules */}
      <style>{`
        @media (max-width: 992px) {
          .authsplit-left { padding: 16px; }
          .authsplit-right { padding: 16px; }
        }
        @media (max-width: 768px) {
          .authsplit-root { grid-template-columns: 1fr !important; }
          .authsplit-left {
            ${hideLeftOnMobile ? "display: none;" : "order: 2;"}
            border-right: none;
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          .authsplit-right { order: 1; }
        }
      `}</style>
    </div>
  );
}
