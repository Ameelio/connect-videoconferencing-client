import React from "react";
import { Svg, Path, Polygon, Defs } from "@react-pdf/renderer";

interface Props {
  width?: number;
  height?: number;
}
const Logo = ({ width, height }: Props) => {
  return (
    <Svg
      viewBox="0 0 666.85 257.93"
      style={{ width: width || 100, height: height || 30 }}
    >
      <Path
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        d="M111.83,48.88h0l-8.38,20.22L98.27,81.58l0,0v.08L91.48,98h0L90,101.55h0l-2.9,7-.6-2.23-.64-2.43-4-15.27L71,47.66l-1.6-6.1L63.79,20.1Z"
      />
      <Polygon
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        opacity={0.7}
        points="87.09 108.56 85.99 107.12 84.4 105.05 77.65 96.2 71.96 88.74 50.31 60.32 41.21 48.39 71.04 47.66 81.83 88.63 85.85 103.9 86.49 106.33 87.09 108.56"
      />
      <Polygon
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        points="67.95 154.72 59.71 174.61 29.58 171.5 58.55 149.76 64.48 145.32 75.17 137.31 67.96 154.69 67.95 154.72"
      />
      <Path
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        d="M134.41,137.69h0L81.75,151.16l-2.83.73-11,2.8,7.21-17.38h0l2.27-5.48h0l9.54-23,.1-.23h0l2.9-7h0L91.47,98h0l6.75-16.29h0l0-.09,5.17-12.47,8.38-20.22h0l4,15.53,4.51,17.78,4.95,19.43,3,11.89h0Z"
      />
      <Polygon
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        points="161.52 72.3 156.34 84.79 151.4 96.73 147.81 105.36 146.74 107.93 146.74 107.94 134.41 137.69 128.27 113.52 128.26 113.52 125.24 101.63 120.29 82.2 120.3 82.19 121.87 81.82 141.5 77.1 160.2 72.62 161.52 72.3"
      />
      <Polygon
        fill="#0073eb"
        stroke="#fff"
        strokeWidth={3}
        opacity={0.7}
        points="187.8 89.91 179.44 91.47 170.42 93.17 170.41 93.16 151.4 96.73 156.34 84.79 161.52 72.3 162.14 72.71 187.8 89.91"
      />
      <Path
        fill="#1a1a1a"
        d="M234.77,211.91h-17.2L209.18,190H163l-8.4,21.88H137.37l38.93-98.23h19.54Zm-66-36.73H203.4l-17.33-45.27Z"
      />
      <Path
        fill="#1a1a1a"
        d="M259.67,211.91H245V161.28h-5.64V148.07h11.83l6.19,6.2c5.5-4.54,12.24-7.43,18.57-7.43a20.61,20.61,0,0,1,17.34,8.66,31.53,31.53,0,0,1,21-8.66c11.7,0,22.43,8,22.43,26.55v38.52H322V173.39c0-8.39-4.54-12.93-11.28-12.93-7.57,0-12.52,4.54-12.52,10.59v40.86H283.61V173.39c0-8.39-4.68-12.93-11.29-12.93-7.42,0-12.65,4.4-12.65,10.18Z"
      />
      <Path
        fill="#1a1a1a"
        d="M393.53,190.72l12.1,6.61c-4.95,8.39-14.17,16.09-26.82,16.09-18.3,0-31.37-15.41-31.37-33.29s13.07-33.57,31.23-33.57,29.44,15.27,30,31.92l-5.5,5.36H362.3c.82,9.5,8.11,15.82,16.51,15.82C384.58,199.66,390.36,196,393.53,190.72ZM363,172.15h30.95c-1-7.15-7.43-12.52-15.27-12.52A15.72,15.72,0,0,0,363,172.15Z"
      />
      <Path
        fill="#1a1a1a"
        d="M461.76,190.72l12.11,6.61c-4.95,8.39-14.17,16.09-26.83,16.09-18.3,0-31.37-15.41-31.37-33.29s13.07-33.57,31.23-33.57,29.44,15.27,30,31.92l-5.5,5.36H430.53c.83,9.5,8.12,15.82,16.51,15.82C452.82,199.66,458.6,196,461.76,190.72Zm-30.54-18.57h30.95c-1-7.15-7.42-12.52-15.27-12.52A15.72,15.72,0,0,0,431.22,172.15Z"
      />
      <Path
        fill="#1a1a1a"
        d="M489.41,113.68l4.82-5h10.18V197.6h5.64v14.31H495.6l-6.19-6.33Z"
      />
      <Path
        fill="#1a1a1a"
        d="M540.73,211.91H526V161.28h-5.5V148.07h15l5.23,5.23ZM532,112a10.49,10.49,0,0,1,10.39,10.39A10.37,10.37,0,0,1,532,132.67a10.25,10.25,0,0,1-10.25-10.26A10.37,10.37,0,0,1,532,112Z"
      />
      <Path
        fill="#1a1a1a"
        d="M620,180a33.36,33.36,0,1,1-33.29-33.29A33.35,33.35,0,0,1,620,180Zm-15,0c0-10.32-7.71-19.12-18.3-19.12s-18.44,8.8-18.44,19.12,7.85,19.26,18.44,19.26S605,190.31,605,180Z"
      />
    </Svg>
  );
};

export default Logo;
