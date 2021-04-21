import React from "react";
import { Svg, Path } from "@react-pdf/renderer";

interface Props {}

const LogoIconBW = () => {
  return (
    <Svg style={{ width: 20, height: 20 }}>
      <Path
        d="M0.153625 4.10988L3.68013 3.83725L5.99198 11.435L0.153625 4.10988Z"
        fill="#424242"
      />
      <Path
        d="M2.91382 0.266663L6.37 11.6285L9.28279 3.83727L2.91382 0.266663Z"
        fill="#424242"
      />
      <Path
        d="M0 19.3061L5.1687 14.8984L3.41543 19.5875L0 19.3061Z"
        fill="#424242"
      />
      <Path
        d="M9.37788 4.4393L4.2843 18.0621L8.03616 17.1051L12.8564 15.8755L9.37788 4.4393Z"
        fill="#424242"
      />
      <Path
        d="M10.8826 8.3353L16.0888 7.00812L12.9954 15.2814L10.8826 8.3353Z"
        fill="#424242"
      />
      <Path
        d="M15.245 10.1198L16.4421 6.91776L19.959 8.90373L15.245 10.1198Z"
        fill="#424242"
      />
    </Svg>
  );
};

export default LogoIconBW;
