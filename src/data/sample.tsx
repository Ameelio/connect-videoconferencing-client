import { subDays, addSeconds, format } from "date-fns";
import { add } from "date-fns/esm";

const firstNames = [
  "Bart",
  "Bijan",
  "Rudolph",
  "Kevin",
  "Gabriel",
  "Marcus",
  "Joseph",
  "Robert",
  "Miguel",
  "Zo",
  "Mark",
  "James",
  "Felix",
  "Franky",
  "Pablo",
  "Mila",
  "Rafael",
  "Benjamin",
];

const firstNamesWomen = [
  "Donna",
  "Emma",
  "Lara",
  "Elizabeth",
  "Roberta",
  "Helen",
  "Sophia",
  "Daniela",
  "Susan",
  "Rosalie",
  "Angel",
];

const lastNames = [
  "Wells",
  "Orwell",
  "Orchingwa",
  "Jones",
  "Matthews",
  "Jones",
  "McKessen",
  "Pekala",
  "Pinedo",
  "Dimas",
  "Dorji",
  "Franklin",
  "Kieff",
  "Gray",
  "Schull",
  "Levin",
  "Lama",
];

const PICS = [
  "https://images.unsplash.com/photo-1545058147-f858e0840ea1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1708&q=80",
  "https://images.unsplash.com/photo-1562694895-964b358a923d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80",
  "https://images.unsplash.com/photo-1595347073915-c00b394f6213?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  "https://images.unsplash.com/photo-1545704881-d5dfa19efa38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  "https://images.unsplash.com/photo-1562694895-1526af8c59dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1570570133998-9a71f391632b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1540289327268-c149bdfd7d3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1565884280295-98eb83e41c65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1565884280295-98eb83e41c65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1546672657-366775449156?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
];

const WOMEN_PICS = [
  "https://images.unsplash.com/photo-1567037782848-d0fe9a51ec4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1589317621382-0cbef7ffcc4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1558284484-e364d0bd7713?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/flagged/photo-1579911301095-b317b761c865?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1589635021366-24ce21374163?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1514448553123-ddc6ee76fd52?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
];

const STAFF_PICS = [
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1573007974656-b958089e9f7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1546215364-12f3fff5d578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1523825036634-aab3cce05919?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1553267751-1c148a7280a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1561677843-39dee7a319ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
];

const STAFF_FIRST_NAME = [
  "George",
  "Dan",
  "Linna",
  "Fernanda",
  "Lucia",
  "Owen",
  "Alex",
];

const FACILITY: Facility = { id: 0, name: "Colorado State Penitentiary" };

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
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id: number) => ({
    id: id,
    inmateId: pickRandom(INMATE_IDS),
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    hasCallPrivilege: true,
    pod: pickRandom(PODS),
    imageUri: PICS[id - 1] as string,
    facility: FACILITY,
  }));
};

const genContacts = (): Contact[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id: number) => ({
    id: id,
    firstName: pickRandom(firstNamesWomen) as string,
    lastName: pickRandom(lastNames) as string,
    imageUri: WOMEN_PICS[id - 1] as string,
    relationship: pickRandom(RELATIONSHIPS),
    document: "Colorado DL 1472",
    dob: new Date("1990-10-27"),
  }));
};

const CONTACTS = genContacts();
export const INMATES = genInmates();

export const genConnections = (): Connection[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
    const inmate = pickRandom(INMATES) as Inmate;
    const contact = pickRandom(CONTACTS) as Contact;
    return {
      id: id,
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
    filename: `${pastVisitations[id - 1].connection.inmate.lastName}-${
      pastVisitations[id - 1].connection.contact.lastName
    }-${format(new Date(), "mm-dd-yyyy")}`,
    recordingSize: 100,
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

const genRandomRecordedVisitations = (): RecordedVisitation[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
    const connection = pickRandom(CONNECTIONS) as Connection;
    return {
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
      filename: `${connection.inmate.lastName}-${
        connection.contact.lastName
      }-${format(new Date(), "yyyy-MM-dd")}.mp4`,
      recordingSize: 100,
    };
  });
};

export const PAST_VISITATIONS = genRandomRecordedVisitations();

const genStaff = (): Staff[] => {
  return [1, 2, 3, 4, 5, 6, 7].map((id: number) => ({
    id: id,
    firstName: STAFF_FIRST_NAME[id - 1] as string,
    lastName: lastNames[id - 1] as string,
    imageUri: STAFF_PICS[id - 1] as string,
    role: "Operator" as StaffRole,
    isActive: (id % 2 === 0) as boolean,
    facility: FACILITY,
    email: `${STAFF_FIRST_NAME[id - 1]}.${lastNames[id - 1]}@state.co.us`,
  }));
};

export const STAFF = genStaff();
