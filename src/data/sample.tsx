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

const genRandomId = (): number => {
  return Math.random() * 1000 * Math.random();
};

const genInmates = (): Inmate[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    inmateId: genRandomId(),
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    hasCallPrivilege: true,
    unit: "",
    dorm: "",
    imageUri: pickRandom(PICS) as string,
  }));
};

const genContacts = (): Contact[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
    id: id,
    firstName: pickRandom(firstNames) as string,
    lastName: pickRandom(lastNames) as string,
    imageUri: pickRandom(PICS) as string,
    relationship: "parent",
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
    };
  });
};

const CONNECTIONS = genConnections();

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
