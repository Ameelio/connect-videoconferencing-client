import React from "react";
import { AudioHTMLAttributes, useEffect, useRef } from "react";

type PropsType = AudioHTMLAttributes<HTMLAudioElement> & {
  srcObject: MediaStream;
  isFadingOut?: boolean;
  muted?: boolean;
};

export default function Video({
  srcObject,
  isFadingOut,
  muted,
  ...props
}: PropsType) {
  const refAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!refAudio.current) return;
    refAudio.current.srcObject = srcObject;
  }, [srcObject]);

  useEffect(() => {
    if (!refAudio.current) return;
    refAudio.current.muted = muted || false;
  }, [muted]);

  return <audio ref={refAudio} {...props} />;
}
