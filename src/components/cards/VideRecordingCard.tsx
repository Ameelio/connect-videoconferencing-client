import React, { ReactElement } from "react";
import { File } from "react-feather";
import { Button } from "react-bootstrap";
// import Video from 'src/assets/recording.';

interface Props {
  filename: string;
  pathname?: string;
  size: number;
  handleVideoRequest: () => void; // pass down this function from
}

export default function VideRecordingCard({
  filename,
  size,
  handleVideoRequest,
  pathname,
}: Props): ReactElement {
  const handleClick = (event: React.MouseEvent) => {
    handleVideoRequest();
  };

  return !pathname ? (
    <div className="d-flex flex-row border p-3 justify-content-between">
      <div className="d-flex flex-row align-items-center">
        <File className="black-400" size={38} />
        <div className="d-flex flex-column ml-1">
          <span className="black-500">{filename}</span>
          <span className="black-400 p7">{size}MB</span>
        </div>
      </div>
      <Button onClick={handleClick}>Request</Button>
    </div>
  ) : (
    <video autoPlay playsInline muted className="w-100">
      <source src={pathname} type="video/mp4" />
    </video>
  );
}
