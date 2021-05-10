import React from "react";
import { VideoHTMLAttributes, useEffect, useRef, useState } from "react";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
  isFadingOut?: boolean;
};

export default function Video({ srcObject, isFadingOut, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.addEventListener("loadeddata", () => setLoading(false));
  }, []);

  return (
    <video
      ref={refVideo}
      {...props}
      style={{
        ...props.style,
        opacity: loading || isFadingOut ? 0 : 1,
      }}
    />
  );
}
