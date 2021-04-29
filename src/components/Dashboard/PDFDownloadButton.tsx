import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SelectedFacility } from "src/typings/Facility";
import { format } from "date-fns";
import { Call } from "src/typings/Call";
import DailyReport from "./DailyReport";
import { DownloadOutlined } from "@ant-design/icons";
import { groupBy } from "src/utils";

interface Props {
  facility: SelectedFacility;
  calls: Call[];
  canViewDetails: boolean;
}

const PDFDownloadButton: React.FC<Props> = React.memo(
  ({ calls, facility, canViewDetails }) => {
    // TODO: delete this safeguard once the maintainers of this package resolve aa known issue
    // https://github.com/diegomura/react-pdf/issues/844
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setTimeout(() => setHasMounted(true), 2000);
    }, []);

    if (!hasMounted)
      return (
        <Button disabled loading>
          Generating daily report...
        </Button>
      );

    const type = canViewDetails ? "Admin" : "Public";
    return (
      <PDFDownloadLink
        document={
          <DailyReport
            callBlocks={groupBy(calls, (call) => call.scheduledStart)}
            facility={facility}
            canViewDetails={canViewDetails}
          />
        }
        fileName={`Daily Schedule (${type}) | ${facility.name}@${format(
          new Date(),
          "MM/dd/yyyy-HH:mm"
        )}`}
      >
        {type} Schedule (PDF)
      </PDFDownloadLink>
    );
  }
);

export default PDFDownloadButton;
