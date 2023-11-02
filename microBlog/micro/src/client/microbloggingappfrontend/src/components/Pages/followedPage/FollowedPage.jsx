import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import classes from "./followedPage.module.css";
import { followedPageList, unFollowPage } from "../../../Service/pages";
import { NavLink } from "react-router-dom";

const FollowedPage = () => {
  const [followed, setFollowedList] = useState([]);

  const followedPageLists = () => {
    followedPageList().then((res) => {
      setFollowedList(res.data.pages);
    });
  };

  const handleUnfollow = async (pageId) => {
    try {
      await unFollowPage(pageId);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    followedPageLists();
  }, []);

  return (
    <>
      <Card className={classes.followedCard}>
        <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
          <Typography variant="h5" component="h2">
            <div className={classes.heading}>Pages Followed</div>
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

          {followed?.map((list) => (
            <Box
              key={list?._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <NavLink
                style={{ color: "black" }}
                state={{ id: list?._id }}
                to={`/pages/${list?._id}`}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt=""
                    src={
                      list?.profile_photo
                        ? list?.profile_photo
                        : list?.page_name
                    }
                  />
                  <div className={classes.gName}>
                    {list?.page_name}
                    <div className={classes.about}>{list?.about}</div>
                  </div>
                </div>
              </NavLink>
              <div>
                <Button
                  className={classes.Unfollow}
                  variant="text"
                  onClick={() => {
                    handleUnfollow(list?._id);
                  }}
                >
                  Unfollow
                </Button>
              </div>
            </Box>
          ))}
        </CardContent>
      </Card>
    </>
  );
};
export default FollowedPage;
