import { combineReducers } from "redux";
import { liveVisitationsReducer } from "src/redux/modules/visitation";

export const rootReducer = combineReducers({
  visitations: liveVisitationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
