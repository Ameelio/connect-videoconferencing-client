import React, { useEffect, useState } from "react";
import JitsiMeet from "src/components/videoconference/JitsiMeet";
import { genFullName } from "src/utils/utils";
import VisitationCardHeader from "../headers/VisitationCardHeader";
import { CardType } from "src/utils/constants";
import VideRecordingCard from "./VideRecordingCard";
import { Button } from "react-bootstrap";

interface Props {
  visitation: LiveVisitation | RecordedVisitation;
  type: CardType;
  actionLabel: string;
  handleClick: () => void; // TODO: enforce this
}

const VisitationCard: React.FC<Props> = ({
  visitation,
  type,
  actionLabel,
  handleClick,
}) => {
  const { startTime, kioskId, scheduledEndTime, connection } = visitation;
  const { inmate, contact } = connection;
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const genMainComponent = (): JSX.Element => {
    switch (type) {
      case CardType.LiveVisitation:
        return <JitsiMeet />;
      case CardType.PastVisitation:
        const record = visitation as RecordedVisitation;
        return (
          <div className="w-50 mt-3">
            <VideRecordingCard
              filename={record.recordingUrl}
              size={321}
              handleVideoRequest={handleClick}
            />
          </div>
        );
      default:
        return <div />;
    }
  };
  return (
    <div>
      <VisitationCardHeader
        startTime={startTime}
        endTime={
          type === CardType.LiveVisitation
            ? scheduledEndTime
            : (visitation as RecordedVisitation).endTime
        }
        kioskId={kioskId}
        currentTime={
          type === CardType.LiveVisitation
            ? now
            : (visitation as RecordedVisitation).endTime
        }
      />
      {genMainComponent()}
      <div className="d-flex flex-row justify-space-between w-100">
        <div className="d-flex flex-row mt-3">
          <span className="p3">{genFullName(inmate)}</span>
          <span className="p3 black-400">&nbsp;{actionLabel}&nbsp;</span>
          <span className="p3">{genFullName(contact)}</span>
        </div>
        {type === CardType.LiveVisitation && (
          <Button onClick={(e) => handleClick()}>End Call</Button>
        )}
      </div>
    </div>
  );
};

export default VisitationCard;
