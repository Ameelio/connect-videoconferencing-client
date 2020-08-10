import { subDays, addSeconds } from "date-fns";
import { add } from "date-fns/esm";

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

function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const INMATE_IDS = ["K32135", "P32145", "J32183", "K54544", "B3235", "P63954"];
const RELATIONSHIPS = [
  "Sibling",
  "Parent",
  "Friend",
  "Son/Daughter",
  "Significant Other",
];

export const PODS = [
  { id: 1, name: "D-Pod", capability: 5 },
  { id: 2, name: "MCU", capability: 2 },
  { id: 3, name: "Incentive Pod", capability: 3 },
];

const genInmates = (): Inmate[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    inmateId: pickRandom(INMATE_IDS),
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    hasCallPrivilege: true,
    pod: pickRandom(PODS),
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
    document: "Colorado DL 1472",
    dob: new Date("1990-10-27"),
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
      requestedAt: new Date(),
      approvedAt: new Date(),
      recordedVisitations: {} as Map<number, RecordedVisitation>,
      numPastCalls: pickRandom([6, 8, 12, 15, 21, 3]),
    };
  });
};

const genConnectionRequests = (): ConnectionRequest[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
    const inmate = pickRandom(INMATES) as Inmate;
    const contact = pickRandom(CONTACTS) as Contact;
    return {
      id: id,
      inmateId: inmate.id,
      contactId: contact.id,
      inmate: inmate,
      contact: contact,
      requestedAt: new Date(),
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
    endTime: addSeconds(
      subDays(new Date(), id * 7),
      getRandomArbitrary(900, 1500)
    ),
    status: "done" as VisitationStatus,
    connection: connection,
  }));

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    ...pastVisitations[id - 1],
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
    scheduledEndTime: add(new Date(), { minutes: 15 }),
    startTime: new Date(),
    endTime: new Date(),
    status: "ongoing",
    connection: pickRandom(CONNECTIONS) as Connection,
  }));
};

const genScheduledVisitations = (): Visitation[] => {
  const arrays: Visitation[][] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) =>
    [1, 2, 3, 4, 5].map((day) => ({
      id: id,
      createdAt: new Date(),
      scheduledStartTime: new Date(`2020-08-${10 + day - 1}T${9 + id - 1}:00`),
      scheduledEndTime: new Date(),
      status: "scheduled",
      connection: pickRandom(CONNECTIONS) as Connection,
      callUrl: "",
    }))
  );
  const result = arrays.reduce(
    (accumulator, value) => accumulator.concat(value),
    []
  );

  return result;
};

export const LIVE_VISITATIONS = genVisitations();
export const SCHEDULED_VISITATIONS = genScheduledVisitations();
export const CONNECTION_REQUESTS = genConnectionRequests();
