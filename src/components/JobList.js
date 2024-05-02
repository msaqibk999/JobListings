import React, { useState, useEffect } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import { connect } from "react-redux";
import debounce from "../utils/debounce";

const JobList = ({ filters }) => {
  // Declaring a state for jobs
  const [jobs, setJobs] = useState([]);
  // Declaring a state for filtered jobs
  const [filteredJobs, setFilteredJobs] = useState([]);
  // Declaring a loading state for async requests
  const [loading, setLoading] = useState(true);
  // Declaring a state to manage offset for fetching jobs
  const [offset, setOffset] = useState(0);

  // function to fetch jobs
  const fetchJobs = () => {
    // setting loading to true before making request
    setLoading(true);

    // putting headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      // Setting a limit of 9 jobs per fetch
      limit: 9,
      offset: offset,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result && result.jdList) {
          // Updating jobs by concatinating the fresh fetched jobs
          setJobs((prev) => {
            const newJobs = [...prev, ...result.jdList];
            // sending the new jobs to apply the selected filters and put to filteredJobs
            setFilteredJobsFunction(newJobs);
            return newJobs;
          });
        }
        // removing the loader post fetching
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const setFilteredJobsFunction = (newJobs) => {
    const filteredJobs = newJobs.filter((job) => {
      // Initialize a flag to track if all filter conditions are met
      let isMatch = true;

      // Check the location filter
      if (filters.location && job.location) {
        isMatch =
          isMatch &&
          job.location.toLowerCase().includes(filters.location.toLowerCase());
      }
      // Check the minExperience filter
      if (filters.minExperience && job.minExp) {
        isMatch =
          isMatch && parseInt(job.minExp) >= parseInt(filters.minExperience);
      }
      // Check the minBasePay filter
      if (filters.minBasePay && job.minJdSalary) {
        isMatch =
          isMatch && parseInt(job.minJdSalary) >= parseInt(filters.minBasePay);
      }
      // Check the jobMode filter
      if (filters.jobMode && job.location) {
        if (
          (filters.jobMode === "remote" && job.location !== "remote") ||
          (filters.jobMode === "onsite" && job.location === "remote")
        )
          isMatch = false;
      }
      // Check the companyName filter
      if (filters.companyName && job.companyName) {
        isMatch =
          isMatch &&
          job.companyName
            .toLowerCase()
            .includes(filters.companyName.toLowerCase());
      }
      // Check the Tech stack filter
      if (filters?.techStack?.length && job?.techStack?.length) {
        console.log("Checking tech stack");
        //Not getting any tech stack from api, for simplicity, let's assume the job's techStack is an array of strings
        isMatch =
          isMatch &&
          job.techStack.some((tech) =>
            filters.techStack.includes(tech.toLowerCase())
          );
      }

      // Check the Tech stack filter
      if (filters?.roles?.length && job.jobRole) {
        isMatch =
          isMatch &&
          filters.roles
            .map((role) => role.toLowerCase())
            .includes(job.jobRole.toLowerCase());
      }

      // Return the result of all filter conditions
      return isMatch;
    });
    // if after filtering number of jobs becomes less than 8 fetch more.
    if (jobs.length !== 0 && filteredJobs.length < 8) {
      setOffset((prev) => prev + 1);
    }
    // updating filtered jobs
    setFilteredJobs(filteredJobs);
  };

  // function to load fresh jobs when touching the bottom
  const handleInfiniteScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setOffset((prev) => prev + 1);
    }
  };

  // debounced the handleInfiniteScroll function to avoid multiple fetches by touching bottom multiple times in less than a second
  const debouncedHandleInfiniteScroll = debounce(handleInfiniteScroll, 800);

  // useEffect for adding a scroll listener
  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleInfiniteScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleInfiniteScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect to fetch new jobs for first time and on every offset change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]); // Fetch jobs when offset changes

  // useEffect to filter jobs on filters change by the user
  useEffect(() => {
    setFilteredJobsFunction(jobs); // Update filtered jobs whenever filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <Grid container spacing={2}>
      {/* FilterBar */}
      <Grid item xs={12}>
        <FilterBar />
      </Grid>

      {/* Job Cards */}
      <Grid container spacing={6} style={{ marginTop: "2.5rem" }}>
        {filteredJobs.map((job, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>

      {/* Loading Indicator */}
      {loading && (
        <Grid
          item
          xs={12}
          style={{ textAlign: "center", marginTop: "1rem", width: "100%" }}
        >
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

// mapping the filters state to the filters prop of JobList component
const mapStateToProps = (state) => ({
  filters: state.filter.filters,
});

// connecting the component to redux-store and default exporting it
export default connect(mapStateToProps)(JobList);
