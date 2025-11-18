import React from "react";

export default function ScoreBadge({ score = 0 }) {
  const pct = Math.round(score);
  let cls = "score-badge medium";
  if (pct >= 75) cls = "score-badge high";
  else if (pct >= 40) cls = "score-badge medium";
  else cls = "score-badge low";

  return (
    <div className={cls} aria-hidden>
      {pct}%
    </div>
  );
}
