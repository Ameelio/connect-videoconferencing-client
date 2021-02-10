import React from "react";
import animationData from "src/assets/lotties/VideoCam.json";
import LottieSpinner from "src/assets/lotties/LottieSpinner.json";

import Lottie from "react-lottie";
import { LoadingTypes } from "src/utils/constants";
import { Spin } from "antd";

interface WithLoadingProps {
  loading: boolean;
  loadingType?: LoadingTypes;
}

export const WithLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> => ({
  loading,
  loadingType,
  ...props
}: WithLoadingProps) => {
  let defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const genFeedback = (): JSX.Element => {
    if (!loadingType) return <Spin />;
    switch (loadingType) {
      case LoadingTypes.AcceptConnection:
        // defaultOptions.animationData = CaringFamily;
        const option = { ...defaultOptions, animationData: LottieSpinner };

        return (
          <div>
            <Lottie options={option} width={200} height={200} />
            <span>Creating the connection...</span>
            <span>Notifying both parties that the request was accepted</span>
          </div>
        );
      case LoadingTypes.FetchRecording:
        return (
          <div>
            <Lottie options={defaultOptions} height={400} width={400} />
            <span>
              We're processing your request...it might take a minute or two.
            </span>
          </div>
        );
      default:
        return <Spin />;
    }
  };
  return loading ? (
    <div className="d-flex flex-column align-item-center justify-content-center text-center">
      {genFeedback()}
    </div>
  ) : (
    <Component {...(props as P)} />
  );
};
