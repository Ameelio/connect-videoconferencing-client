import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 16,
    left: 16,
    width: "100%",
  },
  footerText: {
    fontSize: 12,
  },
});

const Footer = () => {
  return (
    <View style={styles.container} fixed>
      <Text style={styles.footerText}>ameelio.org</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
};

export default Footer;
