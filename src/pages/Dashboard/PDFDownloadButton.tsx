import React, { ReactElement } from "react";
import { Button } from "antd";
import {
  PDFDownloadLink,
  Document,
  Page,
  PDFViewer,
  Text,
} from "@react-pdf/renderer";
import { SelectedFacility } from "src/typings/Node";
import { format } from "date-fns";
import { LiveVisitation } from "src/typings/Call";

const MyDoc = (calls: LiveVisitation[]) => (
  <Document>
    <Page>
      <Text>Daily Schedule</Text>
      {calls.map((call) => (
        <Text>
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
  calls: LiveVisitation[];
}

const PDFDownloadButton: React.FC<Props> = React.memo(({ calls, facility }) => {
  console.log(calls);
  if (!calls) return <div />;
  return (
    <PDFDownloadLink
      document={MyDoc(calls)}
      fileName={`Daily Schedule | ${facility?.name}@${format(
        new Date(),
        "MM/dd/yyyy-HH:mm"
      )}`}
    >
      <Button type="primary">Download Schedule</Button>
    </PDFDownloadLink>
  );
});

export default PDFDownloadButton;
