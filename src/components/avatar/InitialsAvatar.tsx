import { Avatar } from "antd";
import { AvatarProps } from "antd/lib/avatar";
import React from "react";
import { generateBgColor, getInitials } from "src/utils";

interface Props extends AvatarProps {
  name: string;
}
export const InitialsAvatar = ({ name, ...props }: Props): JSX.Element => (
  <Avatar style={{ backgroundColor: generateBgColor(name) }} {...props}>
    {getInitials(name)}
  </Avatar>
);
