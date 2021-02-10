import React, { ReactElement } from "react";
import { Button } from "antd";
import {
  PDFDownloadLink,
  Document,
  Page,
  PDFViewer,
  Text,
  View,
} from "@react-pdf/renderer";
import { SelectedFacility } from "src/typings/Facility";
import { format } from "date-fns";
import { BaseCall, Call, LiveCall } from "src/typings/Call";
import DailyReport from "./DailyReport";
import _ from "lodash";

const styles = {};
const MyDoc = (calls: LiveCall[]) => (
  <Document>
    <Page size="letter">
      <Text>Ameelio Connect Daily Activity Report</Text>
      <Text>{format(new Date(), "MMMM dd, YYYY")}</Text>

      <View></View>
      {calls.map((call) => (
        <Text key={call.id}>
          {call.connection.inmate.firstName}-{call.connection.contact.firstName}{" "}
          | {call.connection.relationship} |{" "}
          {format(new Date(call.scheduledStartTime), "HH:mm")}-
          {format(new Date(call.scheduledEndTime), "HH:mm")}
        </Text>
      ))}
    </Page>
  </Document>
);

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
