import React from "react";
import { Call } from "src/typings/Call";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import Header from "src/components/pdf/Header";
import { SelectedFacility } from "src/typings/Facility";
import SectionHeader from "src/components/pdf/SectionHeader";
import DailyReportCall from "./DailyReportCall";
import Footer from "../pdf/Footer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  blockContainer: {
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#CECECE",
    borderWidth: 2,
    marginBottom: 16,
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
      <Page style={styles.page} wrap>
        <Header
          title={`Daily Activity Report | ${format(
            new Date(),
            "MMMM dd, yyyy"
          )}`}
          subtitle={`${facility.name}`}
        />
        {Object.keys(callBlocks).map((block) => (
          <View key={block} style={styles.blockContainer}>
            <SectionHeader title={format(new Date(block), "HH:mm aaa")} />
            <DailyReportCall
              // TODO: add this bug once we finalize integration work
              // https://github.com/Ameelio/connect-doc-client/issues/57
              // block={parseInt(block)}
              calls={callBlocks[block]}
              canViewDetails={canViewDetails}
            />
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  )
);

export default DailyReport;
