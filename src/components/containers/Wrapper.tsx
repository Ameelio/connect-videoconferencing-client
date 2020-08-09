import React from "react";

interface Props {}

const Wrapper: React.FC<Props> = ({ children }) => {
  return <section className="main-wrapper">{children}</section>;
};

export default Wrapper;
