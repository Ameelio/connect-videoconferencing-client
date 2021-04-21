import React from "react";
import { InitialsAvatar } from "./InitialsAvatar";
import { Image } from "antd";

interface Props {
  fallback: string;
  size?: number;
  src?: string;
}

const Avatar = ({ fallback, size, src }: Props) => {
  return src ? (
    <Image src={src} width={size || 200} />
  ) : (
    <InitialsAvatar name={fallback} size={size || "default"} shape="square" />
  );
};

export default Avatar;
