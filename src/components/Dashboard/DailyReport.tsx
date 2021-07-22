import React, { useEffect, useState } from "react";
import { Call } from "src/typings/Call";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import Header from "src/components/pdf/Header";
import SectionHeader from "src/components/pdf/SectionHeader";
import DailyReportCall from "./DailyReportCall";
import Footer from "../pdf/Footer";
import { groupBy } from "src/utils";

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
  calls: Call[];
  facilityName: string;
  canViewDetails: boolean;
  filename: string;
}

const DailyReport: React.FC<Props> = ({
  calls,
  facilityName,
  canViewDetails,
  filename,
}) => {
  const [callBlocks, setCallBlocks] = useState<Record<string, Call[]>>({});

  useEffect(() => {
    const blocks: Record<string, Call[]> = groupBy(
      calls,
      (call) => call.scheduledStart
    );
    setCallBlocks(blocks);
  }, [calls]);

  return (
    <Document
      author="Ameelio.org"
      keywords="schedule, conneect"
      title="Daily Schedule"
    >
      <Page style={styles.page} wrap>
        <Header title={filename} subtitle={facilityName} />
        {Object.keys(callBlocks).map((block) => (
          <View key={block} style={styles.blockContainer}>
            <SectionHeader
              title={format(new Date(block), "HH:mm aaa, M/d/yy")}
            />
            <DailyReportCall
              calls={callBlocks[block]}
              canViewDetails={canViewDetails}
            />
          </View>
        ))}
        <Footer />
      </Page>
    </Document>
  );
};
export default DailyReport;
