import React, { useEffect, useState } from "react";
import JitsiMeet from "src/components/videoconference/JitsiMeet";
import { Video } from "react-feather";
import { format } from "date-fns";
import { calculateDurationMS } from "src/utils/utils";

interface Props {
  visitation: LiveVisitation;
}

const LiveVisitationCard: React.FC<Props> = ({ visitation }) => {
  const { inmate, contact } = visitation.connection;
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateDurationMS(new Date(), visitation.scheduledEndTime));
    }, 1000);
    return () => clearTimeout(timer);
  });
  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <span className="p2 font-weight-bold">Kiosk #{visitation.kioskId}</span>
        <div className="d-flex flex-row">
          <div className="d-flex align-items-center">
            <Video />
            <span className="ml-1">Video Call</span>
          </div>
          <div className="d-flex ml-3 align-items-center">
            <span className="circle" />
            <span className="ml-1">{timeLeft}</span>
          </div>
          <div className="d-flex flex-row ml-3 align-items-center">
            <span>Start Time:</span>
            <span className="ml-1">{format(visitation.startTime, "h:mm")}</span>
          </div>
        </div>
      </div>
      <JitsiMeet />
      <div className="d-flex flex-row">
        <span className="p3">{`${inmate?.firstName} ${inmate?.lastName}`}</span>
        <span className="p3 black-400">&nbsp;calling&nbsp;</span>
        <span className="p3">
          {`${contact?.firstName} ${contact?.lastName}`}
        </span>
      </div>
    </div>
  );
};

export default LiveVisitationCard;
