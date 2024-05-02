import { APPLY_FILTER } from "../actions/types";

const initialState = {
  filters: {
    minExperience: "",
    companyName: "",
    location: "",
    jobMode: "",
    techStack: "",
    role: "",
    minBasePay: "",
  }, // Object to hold applied filters
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPLY_FILTER:
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

export default filterReducer;
