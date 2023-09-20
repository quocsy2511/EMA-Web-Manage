import React from "react";

const HeadingTitle = ({ children, className }) => {
  return (
    <h2
      className={`text-lg font-semibold text-text1 mb-5 dark:text-fuchsia-300 ${className}`}
    >
      {children}
    </h2>
  );
};

export default HeadingTitle;
