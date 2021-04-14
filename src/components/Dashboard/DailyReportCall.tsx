import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { genFullName } from "src/utils";
import { Call } from "src/typings/Call";
import { ContactIcon, CameraIcon, PersonIcon } from "src/components/pdf/Icons";
import format from "date-fns/format";
import { LogoIconBW } from "src/components/pdf/Icons";

interface Props {
  calls: Call[];
  canViewDetails: boolean;
}

const styles = StyleSheet.create({
  container: {},
  card: {
    borderBottomStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: "#EEEEEE",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#EEEEEE",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexGrow: 0,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  headerText: {
    fontWeight: "semibold",
    fontSize: 16,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
  },
  rowFirstItem: {
    flex: 1,
    flexShrink: 0,
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
  },
  rowItem: {
    flex: 1,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },
  itemTitle: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "light",
  },
  itemBody: {
    fontWeight: "semibold",
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
  logoIcon: {
    maxHeight: 20,
    maxWidth: 20,
  },
});

const DailyReportCall = ({ calls, canViewDetails }: Props) => (
  <View style={styles.container}>
    {calls.map((call) => (
      <View key={call.id} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {format(new Date(call.scheduledStart), "HH:mm aaa")} -{" "}
            {format(new Date(call.scheduledEnd), "HH:mm aaa")}
          </Text>
          <View style={styles.logoIcon}>
            <LogoIconBW />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowFirstItem}>
            <View style={styles.icon}>
              <CameraIcon />
            </View>
            <View>
              <Text style={styles.itemTitle}>Call ID</Text>
              <Text style={styles.itemBody}>{call.id}</Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.itemTitle}>Call Station</Text>
            <Text style={styles.itemBody}>{call.kiosk.name}</Text>
          </View>
        </View>
        {call.inmates.map((inmate) => (
          <View style={styles.row} key={inmate.id}>
            <View style={styles.rowFirstItem}>
              <View style={styles.icon}>
                <PersonIcon />
              </View>
              <View>
                <Text style={styles.itemTitle}>Participant</Text>
                <Text style={styles.itemBody}>{genFullName(inmate)}</Text>
              </View>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.itemTitle}>Unique ID</Text>
              <Text style={styles.itemBody}>{inmate.inmateIdentification}</Text>
            </View>
          </View>
        ))}
        {canViewDetails && (
          <View style={styles.row}>
            <View style={styles.rowFirstItem}>
              <View style={styles.icon}>
                <ContactIcon />
              </View>
              <View>
                <Text style={styles.itemTitle}>Contact Name</Text>
                {call.contacts.map((contact) => (
                  <Text
                    key={`${contact.id}-${contact.firstName}-${contact.lastName}`}
                    style={styles.itemBody}
                  >
                    {genFullName(contact)}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.itemTitle}>Contact ID</Text>
              {call.contacts.map((contact) => (
                <Text key={contact.id} style={styles.itemBody}>
                  {contact.id}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    ))}
  </View>
);

export default DailyReportCall;
