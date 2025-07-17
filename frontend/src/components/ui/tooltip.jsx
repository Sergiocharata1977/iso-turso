import React from 'react';

const Tooltip = ({ content, children }) => (
  <span title={content}>{children}</span>
);

export { Tooltip };
export default Tooltip; 