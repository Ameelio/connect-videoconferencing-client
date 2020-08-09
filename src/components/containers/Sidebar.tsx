import React from "react";

interface Props {
  title: string;
}

const Sidebar: React.FC<Props> = ({ title, children }) => {
  return (
    <section className="left-sidebar">
      <span className="p3">{title}</span>
      {children}
    </section>
  );
};

export default Sidebar;
