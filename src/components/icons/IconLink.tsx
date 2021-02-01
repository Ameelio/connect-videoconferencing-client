import React, { ReactElement } from "react";
import "./Icon.css";
interface Props {
  src: string;
  label: string;
}

export default function IconLink({ src, label }: Props): ReactElement {
  return (
    <a className="icon-link">
      <img className="icon-link-label" src={src} alt={label} />
      {label}
    </a>
  );
}
