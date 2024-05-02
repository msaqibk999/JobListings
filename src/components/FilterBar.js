import React, { useState } from "react";
import { MenuItem, Chip } from "@material-ui/core";
import { connect } from "react-redux";
import { applyFilter } from "../actions/filterActions";
import debounce from "../utils/debounce";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const FilterBar = ({ applyFilter }) => {
  // Declaring a state object for filters
  const [filters, setFilters] = useState({
    minExperience: "",
    minBasePay: "",
    companyName: "",
    jobMode: "",
    location: "",
    roles: [],
    techStack: [],
  });

  // below states are created to fix the issue with MUI Label shift due to the use of startAdornment in InputProps
  const [shrinkRole, setShrinkRole] = useState(false);
  const [shrinkTechStack, setShrinkTechStack] = useState(false);

  // function to append filters to redux managed state
  const applyFiltersFun = (name, value) => {
    applyFilter({ ...filters, [name]: value });
  };

  // function to debounce applyFilterFun for typed changes to filters
  const debouncesApplyFiltersFun = debounce(applyFiltersFun, 1000);

  // fucntion to handle changes in input type: text
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // appending the filter to respective name
    setFilters({ ...filters, [name]: value });

    // making state updatsx based on changes
    debouncesApplyFiltersFun(name, value);
  };

  // function to handle changes in chip type input
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // prevent event bubbling
      event.preventDefault();

      // selected role
      if (event.target.name === "roles") {
        const newRole = event.target.value.trim();
        if (newRole) {
          setFilters({ ...filters, roles: [...filters.roles, newRole] });
          debouncesApplyFiltersFun("roles", [...filters.roles, newRole]);
        }
        event.target.value = "";
      }

      // selected tech stack
      if (event.target.name === "techStack") {
        const newtechStack = event.target.value.trim();
        if (newtechStack) {
          setFilters({
            ...filters,
            techStack: [...filters.techStack, newtechStack],
          });
          debouncesApplyFiltersFun("techStack", [
            ...filters.techStack,
            newtechStack,
          ]);
        }
        event.target.value = "";
      }
    }
  };

  // funtion to handle changes in input type select
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
    applyFiltersFun(name, value);
  };

  // function to delete a chip in input
  const handleDelete = (type, toDelete) => () => {
    if (type === "role") {
      // removing the filter from component state
      setFilters({
        ...filters,
        roles: filters.roles.filter((role) => role !== toDelete),
      });

      // removing the filter from global state managed by redux
      debouncesApplyFiltersFun(
        "roles",
        filters.roles.filter((role) => role !== toDelete)
      );
    } else if (type === "techStack") {
      setFilters({
        ...filters,
        techStack: filters.techStack.filter(
          (techStack) => techStack !== toDelete
        ),
      });
      debouncesApplyFiltersFun(
        "techStack",
        filters.techStack.filter((techStack) => techStack !== toDelete)
      );
    }
  };

  return (
    // container Grid
    <Grid
      container
      spacing={1}
      style={{ marginTop: "1.5rem" }}
      alignItems="center"
      columns={{ xs: 2, md: 7, lg: 7 }}
    >
      {/* Experience Filter */}
      <Grid item xs={1} sm={1} md={1} lg>
        <TextField
          select
          defaultValue=""
          name="minExperience"
          label="Experience"
          value={filters.minExperience}
          onChange={handleSelectChange}
          fullWidth
          variant="outlined"
        >
          {[...Array(10)].map((_, index) => (
            <MenuItem key={index} value={index}>
              {index}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Company name filter */}
      <Grid item xs={1} sm={1} md={1} lg>
        <TextField
          name="companyName"
          label="Company Name"
          value={filters.companyName}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
      </Grid>

      {/* Location filter */}
      <Grid item xs={1} sm={1} md={1} lg>
        <TextField
          name="location"
          label="Location"
          value={filters.location}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
      </Grid>

      {/* Job type filter (Remote/Onsite) */}
      <Grid item xs={1} sm={1} md={1} lg>
        <TextField
          select
          defaultValue=""
          label="Job Type"
          id="job-type"
          name="jobMode"
          value={filters.jobMode}
          onChange={handleSelectChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="remote">Remote</MenuItem>
          <MenuItem value="onsite">Onsite</MenuItem>
        </TextField>
      </Grid>

      {/* Tech stack filter */}
      <Grid
        item
        xs={1}
        sm={1}
        md={1}
        lg
        style={{ maxWidth: "10.6rem", overflowX: "auto" }}
      >
        <TextField
          name="techStack"
          label="Tech Stack"
          InputLabelProps={{
            shrink: shrinkTechStack,
          }}
          onFocus={() => setShrinkTechStack(true)}
          onBlur={(e) =>
            setShrinkTechStack(filters.techStack.length > 0 || !!e.target.value)
          }
          onKeyDown={handleKeyDown}
          variant="outlined"
          InputProps={{
            style: { width: "100%" },
            startAdornment:
              filters.techStack ? (
                filters.techStack.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    onDelete={handleDelete("techStack", role)}
                    style={{ marginRight: 5 }}
                  />
                ))
              ) : (
                <></>
              ),
          }}
        />
      </Grid>

      {/* Roles Filter */}
      <Grid
        item
        xs={1}
        sm={1}
        md={1}
        lg
        style={{ maxWidth: "10.6rem", overflowX: "auto" }}
      >
        <TextField
          name="roles"
          label="Roles"
          InputLabelProps={{
            shrink: shrinkRole,
          }}
          onFocus={() => setShrinkRole(true)}
          onBlur={(e) =>
            setShrinkRole(filters.roles.length > 0 || !!e.target.value)
          }
          onKeyDown={handleKeyDown}
          variant="outlined"
          InputProps={{
            style: { width: "100%" },
            startAdornment: filters.roles ? (
              filters.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  onDelete={handleDelete("role", role)}
                  style={{ marginRight: 5 }}
                />
              ))
            ) : (
              <></>
            ),
          }}
        />
      </Grid>

      {/* Mininum base pay filter */}
      <Grid item xs={1} sm={1} md={1} lg>
        <TextField
          select
          defaultValue=""
          name="minBasePay"
          label="Min Base Pay"
          value={filters.minBasePay}
          onChange={handleSelectChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem key={-1} value={-1}>
            Any
          </MenuItem>
          {[...Array(10)].map((_, index) => (
            <MenuItem key={index} value={index + 5}>
              {index + 5 + " LPA"}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

// connecting the component to redux-store and default exporing it
// passed null as no need for subscription to state updates
// mapped applyFilter action creator to the props
export default connect(null, { applyFilter })(FilterBar);
