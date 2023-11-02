import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import classes from "./followersList.module.css";
import { followersList } from "../../Service/pages";
import { useLocation } from "react-router-dom";

const FollowersList = () => {
  const [list, setFollowersList] = useState([]);
  const pageId = useLocation().state.id;

  const getFollowersList = () => {
    followersList(pageId).then((res) => {
      setFollowersList(res?.data?.users);
    });
  };
  useEffect(() => {
    getFollowersList();
  }, []);

  return (
    <>
      <Card className={classes.followersListCard}>
        <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
          <Typography variant="h5" component="h2">
            <div className={classes.FollowersListheading}>Followers</div>
          </Typography>
          <br />
          <div className={classes.line} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "20px",
            }}
          ></Box>
          {list?.map((follower) => (
            <>
              {" "}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar alt={follower?.profile_photo} />

                <div className={classes.followersListName}>
                  {follower?.userName}
                  <div className={classes.followersListAbout}>
                    {follower.email}
                  </div>
                </div>
              </Box>
            </>
          ))}
        </CardContent>
      </Card> 
    </>
  );
};

export default FollowersList;
