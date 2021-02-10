import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#e5f2ff",
    padding: 4,
  },
  title: {
    // fontFamily: 'Lato Bold',
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    width: "100%",
  },
});

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default SectionHeader;
