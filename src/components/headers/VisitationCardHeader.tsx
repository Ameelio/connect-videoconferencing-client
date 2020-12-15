import React, { ReactElement } from "react";
import { Video } from "react-feather";
import { format } from "date-fns";
import { calculateDurationMS } from "src/utils/utils";

interface Props {
  kioskId: number;
  endTime: Date;
  startTime: Date;
  currentTime: Date;
}

export default function VisitationCardHeader({
  kioskId,
  endTime,
  startTime,
  currentTime,
}: Props): ReactElement {
  return (
    <div className="d-flex flex-row justify-content-between">
      <span className="p2 font-weight-bold">Kiosk #{kioskId}</span>
      <div className="d-flex flex-row">
        <div className="d-flex align-items-center">
          <Video className="black-500" />
          <span className="ml-1 black-500">Video Call</span>
        </div>
        <div className="d-flex ml-3 align-items-center">
          <span className="circle red" />
          <span className="ml-1 black-500">
            {calculateDurationMS(currentTime, endTime)}
          </span>
        </div>
        <div className="d-flex flex-row ml-3 align-items-center">
          <span className="black-500">Start Time:</span>
          <span className="ml-1 black-500">{format(startTime, "h:mm")}</span>
        </div>
      </div>
    </div>
  );
}
