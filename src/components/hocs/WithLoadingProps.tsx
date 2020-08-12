import React from "react";
import animationData from "src/assets/lotties/VideoCam.json";
import Lottie from "react-lottie";

interface WithLoadingProps {
  loading: boolean;
}
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const WithLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> => ({
  loading,
  ...props
}: WithLoadingProps) =>
  loading ? (
    <div className="d-flex flex-column align-item-center justify-content-center text-center">
      <Lottie options={defaultOptions} height={400} width={400} />
      <span>
        We're processing your request...it might take a minute or two!
      </span>
    </div>
  ) : (
    <Component {...(props as P)} />
  );
