import { API_URL, fetchAuthenticated, toQueryString } from "./Common";
import url from "url";
import { Store } from "src/redux";
import {
  setLiveVisitations,
  setPastVisitations,
  setScheduledVisitations,
} from "src/redux/modules/visitation";
import camelcaseKeys from "camelcase-keys";
import { AppThunk } from "src/redux/helpers";

interface RawUser {
  id: number;
  first_name: string;
  last_name: string;
}

interface RawInmate {
  id: number;
  first_name: string;
  last_name: string;
  nodes: AmeelioNode[];
  inmate_number: string;
}

interface RawVisitation {
  id: number;
  connection: BaseConnection;
  connection_id: number;
  users: number[];
  start: number;
  end: number;
  first_live?: number;
  last_live?: number;
  last_status: string;
  room_id: number;
  kiosk_id: number;
  approved: boolean;
}

function cleanVisitation(visitation: RawVisitation): BaseVisitation {
  return {
    id: visitation.id,
    connectionId: visitation.connection_id,
    scheduledStartTime: visitation.start,
    scheduledEndTime: visitation.end,
    startTime: visitation.first_live,
    endTime: visitation.last_live,
    end: visitation.end,
    approved: visitation.approved,
    kiosk: { id: visitation.kiosk_id } as Kiosk,
  } as BaseVisitation;
}

// export async function getVisitations(
//   // filters: CallFilters<number | Date | string>,
//   startDate?: Date,
//   endDate?: Date,
//   query = "",
//   duration?: number[],
//   approved = true,
//   limit = 100,
//   offset = 0
// ): Promise<BaseVisitation[]> {
//   const options = [
//     ["approved", approved.toString()],
//     ["limit", limit.toString()],
//     ["offset", offset.toString()],
//   ];

//   if (startDate && endDate) options.push(["start", `{${startDate.getTime().toString()},  ${endDate.getTime().toString()}`]);
//   if (duration && duration.length === 2)
//     options.push(["duration", duration.join(",")]);
//   if (query.length) options.push(["global", query]);

//   const body = await fetchAuthenticated(
//     url.resolve(API_URL, `node/1/calls?` + toQueryString(options))
//   );

//   console.log(body);
//   if (!body.good) {
//     throw body;
//   }

//   const visitations = ((body.data as Record<string, unknown>)
//     .calls as RawVisitation[]).map(cleanVisitation) as RecordedVisitation[];

//   Store.dispatch(setPastVisitations(visitations));
//   return visitations;
// }

export const loadLiveVisitations = (): AppThunk => async (dispatch) => {
  const now = new Date().getTime();

  const options = [
    ["approved", "true"],
    ["first_live", [0, now].join(",")],
    ["end", [now, now + 1e8].join(",")],
  ];

  const body = await fetchAuthenticated(
    url.resolve(API_URL, "node/2/calls?" + toQueryString(options))
  );

  console.log(body);
  // TODO how to properly typecheck this?
  const visitations = ((body.data as Record<string, RawVisitation[]>).calls.map(
    cleanVisitation
  ) as any) as LiveVisitation[];

  dispatch(setLiveVisitations(visitations));
};
