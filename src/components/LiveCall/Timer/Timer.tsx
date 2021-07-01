import { Typography } from "antd";
import React from "react";
import Countdown from "react-countdown";
import { ISOString } from "src/typings/Call";

const keyMinutes = [10, 5, 2];
const DEFAULT_BACKGROUND = "bg-gray-900 text-white";
const WHITE_BACKGROUND = "bg-white text-black";
const BLUE_BACKGROUND = "bg-blue-500 text-white";

export function mapCountdownTimeToStyle(
  minutes: number,
  seconds: number
): string {
  if (keyMinutes.some((val) => val === minutes && seconds === 0))
    return WHITE_BACKGROUND;
  if (keyMinutes.some((val) => val === minutes + 1 && seconds >= 56))
    return WHITE_BACKGROUND;
  if (minutes === 0 || (minutes === 1 && seconds === 0)) return BLUE_BACKGROUND;
  return DEFAULT_BACKGROUND;
}

interface Props {
  endTime: ISOString;
  style?: React.CSSProperties;
  className?: string;
}
// Renderer callback with condition
const renderer = ({
  formatted,
  minutes,
  seconds,
  completed,
}: {
  formatted: { minutes: string; seconds: string };
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  const style = mapCountdownTimeToStyle(minutes, seconds);

  return completed ? (
    <div />
  ) : (
    <Typography.Text className={`${style} px-6 py-4 rounded-md text-lg`}>
      {formatted.minutes}:{formatted.seconds}
    </Typography.Text>
  );
};

const Timer = ({ endTime, style, className }: Props) => {
  return (
    <div style={style} className={className}>
      <Countdown date={endTime} renderer={renderer} zeroPadTime={2} />{" "}
    </div>
  );
};

export default Timer;
