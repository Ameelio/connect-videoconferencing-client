import { useState, useEffect } from "react";
import { loadAllCallEntities } from "src/utils";
import {
  selectAllCalls,
  selectContactEntities,
  selectInmateEntities,
  selectKioskEntities,
} from "src/redux/selectors";
import { useAppSelector } from "src/redux";
import { Call, CallStatus } from "src/typings/Call";

export function useCalls() {
  const [calls, setCalls] = useState<Call[]>([]);
  const baseCalls = useAppSelector(selectAllCalls);
  const contactEnts = useAppSelector(selectContactEntities);
  const inmateEnts = useAppSelector(selectInmateEntities);
  const kioskEnts = useAppSelector(selectKioskEntities);

  useEffect(() => {
    setCalls(
      loadAllCallEntities(baseCalls, contactEnts, inmateEnts, kioskEnts)
    );
  }, [baseCalls, inmateEnts, contactEnts, kioskEnts]);

  return calls;
}

export function useCallsWithStatus(status: CallStatus) {
  const [calls, setCalls] = useState<Call[]>([]);
  const baseCalls = useAppSelector(selectAllCalls);
  const contactEnts = useAppSelector(selectContactEntities);
  const inmateEnts = useAppSelector(selectInmateEntities);
  const kioskEnts = useAppSelector(selectKioskEntities);

  useEffect(() => {
    let pendingCalls = baseCalls.filter((call) => call.status === status);
    if (status === "live") {
      pendingCalls = pendingCalls.filter(
        (c) => new Date(c.scheduledEnd) >= new Date()
      );
    }
    setCalls(
      loadAllCallEntities(pendingCalls, contactEnts, inmateEnts, kioskEnts)
    );
  }, [baseCalls, inmateEnts, contactEnts, kioskEnts, status]);

  return calls;
}

export function useCallCountWithStatus(status: CallStatus) {
  const [count, setCount] = useState(0);
  const baseCalls = useAppSelector(selectAllCalls);

  useEffect(() => {
    const callsWithStatus = baseCalls.filter((call) => call.status === status);
    setCount(callsWithStatus.length);
  }, [baseCalls, status]);

  return count;
}

export function useInmateCalls(id: string) {
  const [calls, setCalls] = useState<Call[]>([]);
  const baseCalls = useAppSelector(selectAllCalls);
  const contactEnts = useAppSelector(selectContactEntities);
  const inmateEnts = useAppSelector(selectInmateEntities);
  const kioskEnts = useAppSelector(selectKioskEntities);

  useEffect(() => {
    const baseInmateCalls = baseCalls.filter((call) =>
      call.inmateIds.includes(id)
    );
    setCalls(
      loadAllCallEntities(baseInmateCalls, contactEnts, inmateEnts, kioskEnts)
    );
  }, [baseCalls, inmateEnts, contactEnts, kioskEnts, id]);

  return calls;
}
