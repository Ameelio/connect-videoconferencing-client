import React from "react";

interface Props {
  horizontal?: boolean;
}

const Wrapper: React.FC<Props> = ({ children, horizontal }) => {
  const direction = horizontal
    ? "flex-row justify-content-between"
    : "flex-column";

  return <section className={`d-flex ${direction} w-75`}>{children}</section>;
};

export default Wrapper;
