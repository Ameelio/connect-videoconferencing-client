import React from "react";

import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#112131",
    borderBottomStyle: "solid",
    padding: 8,
    alignItems: "stretch",
  },
  extraColumn: {
    flexDirection: "column",
    flexGrow: 2,
    alignSelf: "flex-end",
  },
  detailColumn: {
    flexDirection: "column",
    flexGrow: 9,
    textTransform: "uppercase",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    // fontFamily: "Lato Bold",
  },
  subtitle: {
    fontSize: 10,
    // alignSelf: "flex-end",
    // fontFamily: "Lato",
  },
  extra: {
    // fontFamily: "Lato",
    fontSize: 10,
    color: "black",
    alignSelf: "flex-end",
    fontStyle: "italic",
  },
});

interface Props {
  title: string;
  subtitle: string;
  extra: string;
}

const Header = ({ title, subtitle, extra }: Props) => (
  <View style={styles.container}>
    <View style={styles.detailColumn}>
      <Text style={styles.name}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.extraColumn}>
      <Text style={styles.extra}>{extra}</Text>
    </View>
  </View>
);

export default Header;
