import React from "react";

interface Props {
  fluid?: boolean;
}

const Container: React.FC<Props> = ({ children, fluid }) => {
  const width = fluid ? "w-100" : "";
  return <section className={`main-container ${width}`}>{children}</section>;
};

export default Container;
