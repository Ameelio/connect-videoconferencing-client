import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Call } from "src/typings/Call";
import DailyReport from "./DailyReport";

interface Props {
  facilityName: string;
  calls: Call[];
  canViewDetails: boolean;
  filename: string;
}

const PDFDownloadButton: React.FC<Props> = ({
  calls,
  facilityName,
  canViewDetails,
  filename,
}) => {
  // TODO: delete this safeguard once the maintainers of this package resolve aa known issue
  // https://github.com/diegomura/react-pdf/issues/844
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setHasMounted(true), 2000);
  }, []);

  if (!hasMounted)
    return (
      <Typography.Text type="secondary">
        Generating daily report... <Spin size="small" />
      </Typography.Text>
    );

  const type = canViewDetails ? "Admin" : "Public";
  return (
    <PDFDownloadLink
      document={
        <DailyReport
          calls={calls}
          facilityName={facilityName}
          canViewDetails={canViewDetails}
          filename={filename}
        />
      }
      fileName={filename}
    >
      {type} Schedule (PDF)
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
