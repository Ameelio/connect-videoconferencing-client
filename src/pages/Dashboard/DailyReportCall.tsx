import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { genFullName } from "src/utils";
import { Call } from "src/typings/Call";

interface Props {
  block: number;
  calls: Call[];
  canViewDetails: boolean;
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#112131",
    marginBottom: 8,
  },
  row: {
    display: "flex",
    borderBottomStyle: "solid",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 8,
  },
  header: {
    textDecoration: "underline",
    fontWeight: "bold",
  },
});

const DailyReportCall = ({ block, calls, canViewDetails }: Props) => (
  <View style={styles.container}>
    {calls.map((call) => (
      <View key={call.id}>
        <View style={styles.row}>
          <View>
            <Text style={styles.header}>Call ID</Text>
            <Text>{call.id}</Text>
          </View>
          <View>
            <Text style={styles.header}>Call Station</Text>
            <Text>{call.kiosk.name}</Text>
          </View>
        </View>
        {call.inmates.map((inmate) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.header}>Incarcerated Person</Text>
              <Text>{genFullName(inmate)}</Text>
            </View>
            <View>
              <Text style={styles.header}>Unique ID</Text>
              <Text>{inmate.inmateIdentification}</Text>
            </View>
          </View>
        ))}
        {canViewDetails &&
          call.contacts.map((contact) => (
            <View style={styles.row}>
              <View>
                <Text style={styles.header}>Contact ID</Text>
                <Text>{contact.id}</Text>
              </View>
              <View>
                <Text style={styles.header}>Contact Name</Text>
                <Text>{genFullName(contact)}</Text>
              </View>
              <View>
                <Text style={styles.header}>Relationship</Text>
                <Text>{contact}</Text>
              </View>
            </View>
          ))}
      </View>
    ))}
  </View>
);

export default DailyReportCall;
