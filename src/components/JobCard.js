import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@material-ui/core";

const JobCard = ({ job }) => {
  // destructing the job object
  const {
    companyName,
    jobRole,
    location,
    jobDetailsFromCompany,
    minExp,
    jdLink,
    maxJdSalary,
    minJdSalary,
    logoUrl,
  } = job;

  // Declaring state to manage expansion
  const [expanded, setExpanded] = useState(false);

  // custom class for managing expansion
  const descriptionClassName = `description-container ${
    expanded ? "expanded" : "collapsed"
  }`;

  // Function to toggle the expanded state
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      style={{
        borderRadius: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: "0rem 1rem",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Box
            component="img"
            alt="The house from the offer."
            src={
              logoUrl
                ? logoUrl
                : "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
            }
            height={45}
            width={45}
            sx={{marginTop: "0.5rem"}}
          />
          <Box style={{ margin: "0 0 0 1rem" }}>
          <Typography variant="h6" color="textSecondary">
              {companyName ? companyName : "N/A"}
            </Typography>
            <Typography variant="h6">
              {jobRole.toUpperCase()}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {location.charAt(0).toUpperCase() + location.slice(1)}
            </Typography>
          </Box>
        </Box>
        <Typography color="textSecondary" style={{ fontSize: "1rem" }}>
          Estimated Salary:{" "}
          {minJdSalary && maxJdSalary
            ? `${minJdSalary}-${maxJdSalary} LPA ✅`
            : "N/A"}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" component="h3">
            About Company:
          </Typography>
          <Typography variant="h6" component="h4">
            About us
          </Typography>
          <div className={descriptionClassName}>
            <Typography>
              {expanded
                ? `${jobDetailsFromCompany.slice(0, 420)}...`
                : jobDetailsFromCompany}
            </Typography>
          </div>

          {/* Show "View Job" button if description is longer than 150 characters */}
          {jobDetailsFromCompany.length > 150 && (
            <Box textAlign="center">
              <Button color="primary" onClick={toggleExpand}>
                {expanded ? "Show Less" : "View Job"}
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography color="textSecondary">Minimum Experience</Typography>
          <Typography color="textPrimary">
            {minExp ? `${minExp} years` : "N/A"}
          </Typography>
        </Box>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            href={jdLink}
            fullWidth={true}
            style={{
              height: "3rem",
              fontSize: "1.05rem",
              backgroundColor: "#33FFCA",
              fontWeight: 520,
              borderRadius: 8,
              textTransform: "none",
            }}
          >
            ⚡ Easy Apply
          </Button>
        </Box>
        <Box textAlign="center" sx={{ mt: 1 }}>
          <Button
            variant="contained"
            fullWidth={true}
            style={{
              height: "3rem",
              fontSize: "0.9rem",
              backgroundColor: "#5833FF",
              color: "white",
              borderRadius: 8,
              textTransform: "none",
            }}
          >
            Unlock Referral asks
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
