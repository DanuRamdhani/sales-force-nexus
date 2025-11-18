import React from "react";
import PropTypes from "prop-types";

function LeadItemBody({ name, age, job, amount, description }) {
    return (
        <div className="lead-item__body">
            <h3 className="lead-item__name">{name}</h3>
            <div className="lead-item__meta">{age} • {job} • {amount}</div>
            {description && <p className="lead-item__description">{description}</p>}
        </div>
    );
}

LeadItemBody.propTypes = {
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    job: PropTypes.string,
    amount: PropTypes.string,
    description: PropTypes.string,
};

LeadItemBody.defaultProps = {
    name: "Unnamed",
    age: "-",
    job: "-",
    amount: "-",
    description: "",
};

export default LeadItemBody;