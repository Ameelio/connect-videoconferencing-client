import React, { useEffect, useState } from "react";
import VideoChat from "src/pages/LiveVisitation/VideoChat";
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
  socket: SocketIOClient.Socket;
}

const VisitationCard: React.FC<Props> = ({
  visitation,
  type,
  actionLabel,
  handleClick,
  socket,
}) => {
  const {
    id: callId,
    startTime,
    kiosk: { id: kioskId },
    scheduledEndTime,
    connection,
  } = visitation;
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
      // case CardType.LiveVisitation:
      //   return <VideoChat callId={callId} socket={socket} />;
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
            ? now.getTime()
            : (visitation as RecordedVisitation).endTime
        }
      />
      {genMainComponent()}
      {/* <div className="d-flex flex-row justify-content-between w-100 mt-3">
        <div className="d-flex flex-row mt-3">
          <span className="p3">{genFullName(inmate)}</span>
          <span className="p3 black-400">&nbsp;{actionLabel}&nbsp;</span>
          <span className="p3">{genFullName(contact)}</span>
        </div>
        {type === CardType.LiveVisitation && (
          <Button variant="danger" onClick={(e) => handleClick()}>
            End Call
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default VisitationCard;
