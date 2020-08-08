import { subDays } from "date-fns";

const firstNames = [
  "Harry",
  "George",
  "Rudolph",
  "Kevin",
  "Gabriel",
  "Marcus",
  "Joseph",
];
const lastNames = [
  "Wells",
  "Orwell",
  "Orchingwa",
  "Jones",
  "Matthews",
  "Jones",
];
const PICS = [
  "https://images.unsplash.com/photo-1545058147-f858e0840ea1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1708&q=80",
  "https://images.unsplash.com/photo-1562694895-964b358a923d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80",
  "https://images.unsplash.com/photo-1595347073915-c00b394f6213?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  "https://images.unsplash.com/photo-1545704881-d5dfa19efa38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  "https://images.unsplash.com/photo-1562694895-1526af8c59dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
];

const pickRandom = (items: any[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const INMATE_IDS = ["K32135", "P32145", "J32183", "K54544", "B3235", "P63954"];
const RELATIONSHIPS = [
  "Sibling",
  "Parent",
  "Friend",
  "Son/Daughter",
  "Significant Other",
];

const genInmates = (): Inmate[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    inmateId: pickRandom(INMATE_IDS),
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    hasCallPrivilege: true,
    unit: "MCU",
    dorm: "D-Pod",
    imageUri: pickRandom(PICS) as string,
  }));
};

const genContacts = (): Contact[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    imageUri: pickRandom(PICS) as string,
    relationship: pickRandom(RELATIONSHIPS),
    numPastCalls: 23,
  }));
};

const CONTACTS = genContacts();
const INMATES = genInmates();

const genConnections = (): Connection[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
    const inmate = pickRandom(INMATES) as Inmate;
    const contact = pickRandom(CONTACTS) as Contact;
    return {
      id: id,
      inmateId: inmate.id,
      contactId: contact.id,
      inmate: inmate,
      contact: contact,
      connectionRequestId: Math.random() * 100,
      requestedAt: new Date(),
      approvedAt: new Date(),
      recordedVisitations: {} as Map<number, RecordedVisitation>,
    };
  });
};

const genRecordedVisitations = (
  connection: Connection
): RecordedVisitation[] => {
  const pastVisitations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    kioskId: id,
    callUrl: "",
    createdAt: subDays(new Date(), id * 7),
    scheduledStartTime: subDays(new Date(), id * 7),
    scheduledEndTime: subDays(new Date(), id * 7),
    startTime: subDays(new Date(), id * 7),
    endTime: subDays(new Date(), id * 7),
    status: "done",
    connection: connection,
  }));

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    visitation: pastVisitations[id - 1],
    recordingUrl: "",
  }));
};

const rawConnection = genConnections();
const CONNECTIONS = rawConnection.map((connection) => ({
  ...connection,
  recordedVisitations: genRecordedVisitations(connection),
}));
const genVisitations = (): LiveVisitation[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    kioskId: id,
    callUrl: "",
    createdAt: new Date(),
    scheduledStartTime: new Date(),
    scheduledEndTime: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    status: "ongoing",
    connection: pickRandom(CONNECTIONS) as Connection,
  }));
};

export const LIVE_VISITATIONS = genVisitations();
