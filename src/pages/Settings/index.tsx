import React, { ReactElement } from "react";
import { useAppDispatch, useAppSelector } from "src/redux";
import { TentativeCallSlot } from "src/typings/Facility";
import { updateCallTimes } from "src/redux/modules/facility";
import Settings from "src/components/Settings";
import { selectAllKiosks, selectGroupEntities } from "src/redux/selectors";

function SettingsContainer(): ReactElement {
  const groupTree = useAppSelector((state) => state.groups.nodes);
  const groupEnts = useAppSelector(selectGroupEntities);
  const facility = useAppSelector((state) => state.facilities.selected);
  const kiosks = useAppSelector(selectAllKiosks);
  const dispatch = useAppDispatch();

  if (!facility) return <div />;

  const handleCallHoursChange = (callSlots: TentativeCallSlot[]) => {
    dispatch(
      updateCallTimes({
        newCallSlots: callSlots,
        oldCallSlots: facility.callTimes,
      })
    );
  };

  return (
    <Settings
      groupTree={groupTree}
      groupEnts={groupEnts}
      facility={facility}
      kiosks={kiosks}
      handleCallHoursChange={handleCallHoursChange}
    />
  );
}

export default SettingsContainer;
