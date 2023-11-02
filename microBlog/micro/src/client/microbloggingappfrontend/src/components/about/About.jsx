import React from "react";
import classes from "./about.module.css";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";

const About = ({ about }) => {
  if (typeof about !== "string") {
    throw new Error("Invalid prop: 'about' must be a string.");
  }

  return (
    <Card className={classes.aboutCard}>
      {" "}
      <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
        {" "}
        <Typography variant="h5" component="h2">
          <div className={classes.aboutCardHeading}>About</div>
          <div className={classes.line} />{" "}
          <h6 style={{ fontFamily: "sans-serif", fontWeight: "lighter" }}>
            {about}{" "}
          </h6>{" "}
        </Typography>
        <br />{" "}
      </CardContent>{" "}
    </Card>
  );
};

About.propTypes = {
  about: PropTypes.string.isRequired, 
};

export default About;
