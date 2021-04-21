import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import Logo from "./Logo";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraColumn: {
    flexDirection: "column",
    alignSelf: "flex-end",
  },
  detailColumn: {
    flexDirection: "column",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
  },
});

interface Props {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: Props) => (
  <View style={styles.container} fixed>
    <View style={styles.detailColumn}>
      <View style={styles.header}>
        <Text style={styles.name}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.extraColumn}>
      <Logo width={180} height={45} />
    </View>
  </View>
);

export default Header;
