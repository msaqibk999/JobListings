import React, { useState } from "react";
import { MenuItem, Chip } from "@material-ui/core";
import { connect } from "react-redux";
import { applyFilter } from "../actions/filterActions";
import debounce from "../utils/debounce";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";


const FilterBar = ({ applyFilter }) => {
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

  const applyFiltersFun = (name, value) => {
    applyFilter({ ...filters, [name]: value });
  };

  const debouncesApplyFiltersFun = debounce(applyFiltersFun, 1000);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
    debouncesApplyFiltersFun(name, value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.name === "roles") {
        const newRole = event.target.value.trim();
        if (newRole) {
          setFilters({ ...filters, roles: [...filters.roles, newRole] });
          debouncesApplyFiltersFun("roles", [...filters.roles, newRole]);
        }
        event.target.value = "";
      }
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

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
    applyFiltersFun(name, value);
  };

  const handleDelete = (type, toDelete) => () => {
    if (type === "role") {
      setFilters({
        ...filters,
        roles: filters.roles.filter((role) => role !== toDelete),
      });
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
    <Grid
      container
      spacing={1}
      style={{ marginTop: "1.5rem" }}
      alignItems="center"
      columns={{ xs: 2, md: 7, lg: 7 }}
    >
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
      <Grid item xs={1} sm={1} md={1} lg>
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
          fullWidth
          onKeyDown={handleKeyDown}
          variant="outlined"
          InputProps={{
            style: { overflowX: "auto", maxWidth: "10.6rem" },
            startAdornment:
              filters.techStack.length > 0 ? (
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
      <Grid item xs={1} sm={1} md={1} lg style={{ maxWidth: "10.6rem", overflowX: "auto" }}>
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

export default connect(null, { applyFilter })(FilterBar);
