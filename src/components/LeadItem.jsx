import React from "react";
import PropTypes from "prop-types";
import LeadItemBody from "./LeadItemBody";
import ScoreBadge from "./ScoreBadge";
import StatusPill from "./StatusPill";
import { Link } from "react-router-dom";

function LeadItem({ id, name, age, job, amount, score, status, description }) {
  return (
    <article className="lead-item card" data-id={id}>
      <div className="lead-item__left">
        <ScoreBadge score={score} />
      </div>
      <div className="lead-item__main">
        <LeadItemBody
          name={name}
          age={age}
          job={job}
          amount={amount}
          description={description}
        />
      </div>
      <div className="lead-item__right">
        <StatusPill status={status} />
        <Link to={`/leads/${id}`} className="lead-item__detail-link">Detail</Link>
      </div>
    </article>
  );
}

LeadItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  job: PropTypes.string,
  amount: PropTypes.string,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
  description: PropTypes.string,
};

LeadItem.defaultProps = {
  name: "Unnamed",
  age: "-",
  job: "-",
  amount: "-",
  score: "-",
  status: "unknown",
  description: "",
};

export default LeadItem;