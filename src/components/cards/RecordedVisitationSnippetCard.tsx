import React from "react";
import { format, differenceInMinutes } from "date-fns";
import { Video } from "react-feather";

interface Props {
  record: RecordedVisitation;
}

const RecordedVisitationSnippetCard: React.FC<Props> = ({ record }) => {
  return (
    <div className="d-flex flex-row align-items-center justify-content-between p-1 border-bottom mt-1">
      <div className="d-flex flex-column ml-3">
        <div className="d-flex flex-row align-items-center">
          <Video color="#6d6d6d" />
          <span className="black-500 p7 ml-1">Video Call</span>
        </div>
        <span className="black-500 p7">
          {format(
            differenceInMinutes(record.endTime, record.startTime),
            "mm:ss"
          )}
        </span>
      </div>
      <div className="black-500 p6">{format(record.createdAt, "MMM d")}</div>
    </div>
  );
};

export default RecordedVisitationSnippetCard;
