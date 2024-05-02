import { APPLY_FILTER } from "./types";

export const applyFilter = (filters) => ({
  type: APPLY_FILTER,
  payload: filters,
});
