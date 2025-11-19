import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import LeadList from "../components/LeadList";

const COLORS = {
  total: "linear-gradient(180deg,#10b981,#06b6d4)",
  hot: "linear-gradient(180deg,#ef4444,#f97316)",
  warm: "linear-gradient(180deg,#f59e0b,#f97316)",
  closed: "linear-gradient(180deg,#10b981,#06b6d4)"
};

const SAMPLE_LEADS = [
  {
    id: "1",
    name: "Andi Wijaya",
    age: 30,
    job: "Management",
    loanAmount: "€1.500.000",
    score: 85,
    primaryStatus: "hot",
    secondaryStatus: "progress",
    note: "Peluang tinggi untuk konversi karena profil keuangan yang kuat."
  },
  {
    id: "2",
    name: "Siti Rahma",
    age: 27,
    job: "Staff",
    loanAmount: "€400.000",
    score: 60,
    primaryStatus: "warm",
    secondaryStatus: "progress",
    note: "Telah dihubungi via WA."
  },
  {
    id: "3",
    name: "Budi Santoso",
    age: 45,
    job: "Owner",
    loanAmount: "€2.500.000",
    score: 32,
    primaryStatus: "cold",
    secondaryStatus: "progress",
    note: "Butuh dokumen lebih dulu."
  }
];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [leads] = useState(SAMPLE_LEADS);

  const filtered = useMemo(() => {
    if (!query) return leads;
    const q = query.toLowerCase();
    return leads.filter(l => (l.name || "").toLowerCase().includes(q));
  }, [leads, query]);

  const counts = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter(l => (l.primaryStatus || "").toLowerCase().includes("hot")).length;
    const warm = leads.filter(l => (l.primaryStatus || "").toLowerCase().includes("warm")).length;
    const closed = leads.filter(l => (l.primaryStatus || "").toLowerCase().includes("closed") || (l.primaryStatus || "").toLowerCase().includes("won")).length;
    return { total, hot, warm, closed };
  }, [leads]);

  const headerUser = { name: "Prasetyo", role: "Sales" };

  return (
    <div className="container">
      <Header siteName="SalesForce Nexus" subtitle="Lead Management Portal" user={headerUser} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        <StatCard title="Total Leads" value={counts.total} color={COLORS.total} />
        <StatCard title="Hot Leads" value={counts.hot} color={COLORS.hot} />
        <StatCard title="Warm Leads" value={counts.warm} color={COLORS.warm} />
        <StatCard title="Closed Won" value={counts.closed} color={COLORS.closed} />
      </div>

      <FilterBar query={query} onQuery={setQuery} />

      <div style={{ marginTop: 18 }}>
        <LeadList leads={filtered} />
      </div>
    </div>
  );
}
