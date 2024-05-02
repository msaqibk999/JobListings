// Importing the action type constant from the types file
import { APPLY_FILTER } from "./types";

// Defining and exporting an action creator function named applyFilter
export const applyFilter = (filters) => ({
  type: APPLY_FILTER,
  payload: filters,
});
