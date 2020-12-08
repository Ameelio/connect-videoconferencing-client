import { API_URL, fetchAuthenticated } from "./Common";
import url from "url";

interface RawVisitation {}

function cleanVisitation(visitation: RawVisitation): Visitation {
  return {} as Visitation;
}

export async function getVisitations(song: string): Promise<Visitation[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `node/1/calls`));
  if (!body.good || !body.data) {
    throw body;
  }
  const visitations = (body.data as RawVisitation[]).map((raw) =>
    cleanVisitation(raw)
  );

  // remove duplicate songs
  return visitations;
}
