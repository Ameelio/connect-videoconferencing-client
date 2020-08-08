import React from "react";
import { format } from "date-fns";
import { Video } from "react-feather";

interface Props {
  record: RecordedVisitation;
}

const RecordedVisitationSnippetCard: React.FC<Props> = ({ record }) => {
  return (
    <div className="d-flex flex-row align-items-center">
      {/* <div className="d-flex flex-column">
                <div>
                    <Video />

                <div/>
            </div> */}
      {/* <div>{format(record.visitation.createdAt, 'MMM D')}</div> */}
    </div>
  );
};

export default RecordedVisitationSnippetCard;
