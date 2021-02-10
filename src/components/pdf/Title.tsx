import { StyleSheet, Text } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  title: {
    // fontFamily: 'Lato Bold',
    fontSize: 14,
    marginBottom: 10,
    textTransform: "uppercase",
  },
});

const Title = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <Text style={styles.title}>{children}</Text>
);

export default Title;
