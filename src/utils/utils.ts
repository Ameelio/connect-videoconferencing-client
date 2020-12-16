import { EventInput } from "@fullcalendar/react";
import { addSeconds, format, differenceInSeconds } from "date-fns";

export const genFullName = (entity?: BasePersona): string =>
  entity ? `${entity.firstName} ${entity.lastName}` : "";

export const genImageUri = (user?: BasePersona): string => {
  return user?.profileImgPath || "default.jpg";
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

const formatSecondsToMS = (secs: number): string => {
  return format(addSeconds(new Date(0), secs), "mm:ss");
};
export const calculateDurationMS = (start: Date, end: Date): string => {
  const secs = differenceInSeconds(end, start);
  return formatSecondsToMS(secs);
};
