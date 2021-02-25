import { Avatar } from "antd";
import React from "react";
import { generateBgColor, getInitials } from "src/utils";

interface Props {
  name: string;
  size: "large" | "small" | "default";
  shape: "square" | "circle";
}
export const InitialsAvatar = ({ name, size, shape }: Props): JSX.Element => (
  <Avatar
    size={size}
    shape={shape}
    style={{ backgroundColor: generateBgColor(name) }}
  >
    {getInitials(name)}
  </Avatar>
);
