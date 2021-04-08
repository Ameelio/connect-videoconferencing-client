import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SelectedFacility } from "src/typings/Facility";
import { format } from "date-fns";
import { Call } from "src/typings/Call";
import DailyReport from "./DailyReport";
import _ from "lodash";
import { DownloadOutlined } from "@ant-design/icons";

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

    return (
      <PDFDownloadLink
        document={
          <DailyReport
            callBlocks={_.groupBy(calls, (call) => call.scheduledStart)}
            facility={facility}
            canViewDetails={true}
          />
        }
        fileName={`Daily Schedule | ${facility?.name}@${format(
          new Date(),
          "MM/dd/yyyy-HH:mm"
        )}`}
      >
        <Button icon={<DownloadOutlined />}>
          Download Schedule {canViewDetails ? "(Admin)" : "(Public)"}
        </Button>
      </PDFDownloadLink>
    );
  }
);

export default PDFDownloadButton;
