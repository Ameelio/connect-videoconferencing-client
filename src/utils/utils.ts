import { EventInput } from "@fullcalendar/react";

export const genFullName = (entity?: Inmate | Contact): string =>
  entity ? `${entity.firstName} ${entity.lastName}` : "";

export const genImageUri = (user?: User): string => {
  return user?.imageUri || "default.jpg";
};

export const VisitationToEventInput = (visitation: Visitation): EventInput => {
  return {
    title: `${genFullName(visitation.connection.inmate)} <> ${genFullName(
      visitation.connection.contact
    )}`,
    start: visitation.scheduledStartTime,
    end: visitation.scheduledEndTime,
  };
};
