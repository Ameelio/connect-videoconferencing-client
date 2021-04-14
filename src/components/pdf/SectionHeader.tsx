import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#CECECE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 4,
  },
  title: {
    fontWeight: "semibold",
    fontSize: 18,
  },
});

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default SectionHeader;
