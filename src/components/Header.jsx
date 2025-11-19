
import React from "react";

export default function Header({
  siteName = "SalesForce Nexus",
  subtitle = "Lead Management Portal",
  user = { name: "Prasetyo", role: "Sales" }
}) {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="logo">
          <div className="logo__icon" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#g)"/>
              <path d="M7 14l2-3 3 4 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#10b981"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo__text">
            <div className="logo__title">{siteName}</div>
            <div className="logo__subtitle">{subtitle}</div>
          </div>
        </div>
      </div>

      <div className="app-header__right">
        <div className="user-card" role="button" tabIndex={0} aria-label={`Profile ${user.name}`}>
          <div className="user-avatar" aria-hidden>
            <span>{(user.name || "U").split(" ").map(n => n[0]).slice(0,2).join("")}</span>
          </div>

          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>

          <button className="logout-btn" title="Logout" aria-label="logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
