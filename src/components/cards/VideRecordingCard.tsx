import React, { ReactElement, useState } from "react";
import { File } from "react-feather";
import { Button } from "react-bootstrap";

interface Props {
  filename: string;
  size: number;
  handleVideoRequest: () => void; // pass down this function from
}

export default function VideRecordingCard({
  filename,
  size,
  handleVideoRequest,
}: Props): ReactElement {
  //
  const [clicked, setClicked] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent) => {
    handleVideoRequest();
    setClicked(true);
  };

  return !clicked ? (
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
    <video autoPlay playsInline muted className=" w-100">
      <source src={require("src/assets/recording_demo.mp4")} />
    </video>
  );
}
