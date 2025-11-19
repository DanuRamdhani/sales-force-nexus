import React from "react";

export default function StatCard({ title, value = 0, color = "var(--primary)", icon }) {
  return (
    <div className="card" style={{ padding: 16, minHeight: 110, display: "flex", alignItems: "stretch" }}>
      <div style={{ width: 8, borderRadius: 8, background: color, marginRight: 12 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>{title}</div>
          {icon ? <div style={{ opacity: 0.9 }}>{icon}</div> : null}
        </div>
        <div style={{ marginTop: 18, fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{value}</div>
      </div>
    </div>
  );
}
