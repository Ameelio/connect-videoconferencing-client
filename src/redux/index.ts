import { combineReducers } from "redux";
import { liveVisitationsReducer } from "src/redux/modules/live_visitation";

export const rootReducer = combineReducers({
  liveVisitations: liveVisitationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
