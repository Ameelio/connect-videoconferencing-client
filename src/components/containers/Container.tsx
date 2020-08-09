import React from "react";

interface Props {}

const Container: React.FC<Props> = ({ children }) => {
  return <section className="main-container">{children}</section>;
};

export default Container;
