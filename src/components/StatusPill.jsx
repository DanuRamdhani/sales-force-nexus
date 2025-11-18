import React from "react";
import PropTypes from "prop-types";

function StatusPill({ status }) {
  const cls = `status-pill status-pill--${(status || "unknown").toString().toLowerCase()}`;
  return (
    <span className={cls}>{status}</span>
  );
}

StatusPill.propTypes = {
  status: PropTypes.string,
};

StatusPill.defaultProps = {
  status: "unknown",
};

export default StatusPill;
