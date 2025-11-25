import React from 'react';

const RequireAdmin = ({ children }) => {
  const isAdmin = true; // Replace with actual admin check

  if (!isAdmin) {
    return <div>You do not have access to this page.</div>;
  }

  return children;
};

export default RequireAdmin;