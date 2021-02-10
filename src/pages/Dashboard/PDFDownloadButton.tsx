import React from "react";
import { Button } from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SelectedFacility } from "src/typings/Facility";
import { format } from "date-fns";
import { Call } from "src/typings/Call";
import DailyReport from "./DailyReport";
import _ from "lodash";

interface Props {
  facility?: SelectedFacility;
  calls: Call[];
}

const PDFDownloadButton: React.FC<Props> = React.memo(({ calls, facility }) => {
  if (!facility || !calls.length)
    return (
      <Button type="primary" size="large" disabled>
        No calls today
      </Button>
    );
  console.log(_.groupBy(calls, (call) => call.scheduledStartTime));
  return (
    <PDFDownloadLink
      document={
        <DailyReport
          callBlocks={_.groupBy(calls, (call) => call.scheduledStartTime)}
          facility={facility}
          canViewDetails={true}
        />
      }
      fileName={`Daily Schedule | ${facility?.name}@${format(
        new Date(),
        "MM/dd/yyyy-HH:mm"
      )}`}
    >
      <Button type="primary" size="large">
        Print Daily Schedule
      </Button>
    </PDFDownloadLink>
  );
});

export default PDFDownloadButton;
