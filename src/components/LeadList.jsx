import React from "react";
import PropTypes from "prop-types";
import LeadItem from "./LeadItem";
import LeadsData from "../data/lead";

function LeadList({ lead }) {
  const list = Array.isArray(lead) && lead.length ? lead : LeadsData;
  return (
    <section className="lead-list">
      {list.map((c) => (
        <LeadItem
          key={c.id}
          id={c.id}
          name={c.name || c.title}
          age={c.age}
          job={c.job}
          amount={c.amount}
          score={c.score}
          status={c.status}
          description={c.body || c.description}
        />
      ))}
    </section>
  );
}

LeadList.propTypes = {
  lead: PropTypes.arrayOf(PropTypes.object),
};

LeadList.defaultProps = {
  lead: undefined,
};

export default LeadList;