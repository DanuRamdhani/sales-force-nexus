
import React from "react";

export default function FilterBar({ query = "", onQuery }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Daftar Lead Prioritas</div>
          <div className="text-muted" style={{ marginTop: 6 }}>Lead diurutkan berdasarkan skor tertinggi</div>
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            aria-label="Cari nama nasabah"
            placeholder="Cari nama nasabah..."
            value={query}
            onChange={(e) => onQuery && onQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: 220,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "white"
            }}
          />
          <select style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}>
            <option>Semua Bucket</option>
            <option>Hot</option>
            <option>Warm</option>
            <option>Cold</option>
          </select>

          <select style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}>
            <option>Semua Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Won</option>
          </select>

          <select style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}>
            <option>Semua Pekerjaan</option>
            <option>Management</option>
            <option>Staff</option>
          </select>
        </div>
      </div>
    </div>
  );
}
