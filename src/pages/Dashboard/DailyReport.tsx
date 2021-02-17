import React from "react";
import { Call } from "src/typings/Call";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import Header from "src/components/pdf/Header";
import { SelectedFacility } from "src/typings/Facility";
import SectionHeader from "src/components/pdf/SectionHeader";
import DailyReportCall from "./DailyReportCall";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
});

interface Props {
  callBlocks: Record<string, Call[]>;
  facility: SelectedFacility;
  canViewDetails: boolean;
}

const DailyReport: React.FC<Props> = React.memo(
  ({ callBlocks, facility, canViewDetails }) => (
    <Document
      author="Ameelio.org"
      keywords="schedule, conneect"
      title="Daily Schedule"
    >
      <Page style={styles.page}>
        <Header
          title="Daily Activity Report"
          subtitle={`${facility.name}`}
          extra={`Generated on ${format(new Date(), "MMMM/dd/yyyy HH:mm:ss")}`}
        />
        {Object.keys(callBlocks).map((block) => (
          <View key={block}>
            <SectionHeader
              title={format(new Date(parseInt(block)), "HH:mm")}
            ></SectionHeader>
            <DailyReportCall
              block={parseInt(block)}
              calls={callBlocks[block]}
              canViewDetails={canViewDetails}
            />
          </View>
        ))}
      </Page>
    </Document>
  )
);

export default DailyReport;
