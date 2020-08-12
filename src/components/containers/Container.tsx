import React from "react";

interface Props {
  fluid?: boolean;
  rounded?: boolean;
}

const Container: React.FC<Props> = ({ children, fluid, rounded }) => {
  const width = fluid ? "w-100" : "";
  const corner = rounded ? "rounded" : "";
  return (
    <section className={`main-container ${width} ${corner}`}>
      {children}
    </section>
  );
};

export default Container;
