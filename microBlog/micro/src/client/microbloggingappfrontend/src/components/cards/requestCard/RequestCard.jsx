/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import classes from "./requestcard.module.css";
import {
  requestlist,
  friendacceptReject,
} from "../../../Service/friendsService";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const MAX_FRIENDS_TO_DISPLAY = 4; // Number of friends to display initially

function RequestCard({ fetchFriends }) {
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState();

  //snackbar
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "left",
    message: "",
  });

  const handleClick = (message) => {
    setState({ ...state, message, open: true });
  };
  const lessCount = count < 99;
  const graterCount = count > 99;

  //snackbar ends

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    requestlist().then((data) => {
      setCount(data?.data?.count);
      if (
        data &&
        data?.data &&
        data?.data?.result &&
        data?.data?.result?.length
      ) {
        setRequests(data.data.result);
      } else {
        setRequests([]);
      }
    });
  };

  const [showAll, setShowAll] = useState(false);
  const displayedFriends = showAll
    ? requests
    : requests.slice(0, MAX_FRIENDS_TO_DISPLAY);

  const handleShowMoreClick = () => {
    setShowAll(!showAll);
  };

  const handleIgnore = async (friend) => {
    handleClick("Request Ignored");
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to ignore!",
        showCancelButton: true,
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await friendacceptReject(friend._id, friend.reciever_user, 2);
          fetchData();
        }
        result.isConfirmed &&
          Swal.fire({
            icon: "success",
            title: "Ignored",
            timer: 1000,
            showConfirmButton: false,
          });
      });
    } catch (e) {
      return e;
    }
  };

  const handleAccept = async (friend) => {
    handleClick("Request Accepted Successfully");
    try {
      await friendacceptReject(friend._id, friend.reciever_user, 1);
      fetchData();
      if (fetchFriends) {
        fetchFriends();
      }
    } catch (e) {
      return e;
    }
  };
  return (
    <div>
      <Card
        style={{
          borderRadius: "10px",
          marginTop: "36px",
          height: "fit-content",
          marginLeft: "17px",
          marginRight: "17px",
          marginBottom: "27px",
          fontFamily: "sans-serif",
        }}
      >
        <CardContent style={{ paddingBottom: "7px", fontWeight: "bold" }}>
          <Typography variant="h5" component="h2">
            <div className={classes.Request}>
              Requests{" "}
              <sup>
                <div className={classes.supDiv}>
                  <div className={classes.countDiv}>
                    {lessCount && count}
                    {graterCount && "99+"}
                  </div>
                </div>
              </sup>
            </div>
          </Typography>
          <br />
          <div
            style={{
              height: ".6px",
              backgroundColor: "#ebebeb",
              width: "100%",
            }}
          />

          {displayedFriends.length ? (
            displayedFriends.map((friend) => (
              <>
                <Box
                  sx={{
                    display: "flex",
                    padding: "5px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "50px",
                  }}
                >
                  <Box
                    style={{ cursor: "pointer" }}
                    component={Link}
                    to={{
                      pathname: `/fprofile/${friend?.requested_user?._id}`,
                      state: { friendId: friend?.requested_user?._id },
                    }}
                    className="Name"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {friend?.requested_user && friend?.requested_user?.photo ? (
                      <img
                        className={classes.profile}
                        alt=""
                        src={friend?.requested_user?.photo}
                      />
                    ) : (
                      <img
                        className={classes.profile}
                        alt="Remy Sharp"
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=360"
                      />
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Link
                        to={{
                          pathname: `/fprofile/${friend?.requested_user?._id}`,
                          state: { friendId: friend?.requested_user?.id },
                        }}
                        style={{
                          float: "left",
                          paddingLeft: "5px",
                          textIndent: "3px",
                          color: "black",
                          textDecoration: "none",
                        }}
                      >
                        {friend?.requested_user?.userName}
                      </Link>
                      <div
                        style={{
                          float: "left",
                          fontSize: "11px",
                          color: "#6b6b6b",
                          paddingLeft: "5px",
                          textIndent: "3px",
                        }}
                      >
                        {friend?.requested_user?.country}
                      </div>
                    </div>
                  </Box>
                  <Box sx={{ float: "right" }} className="button">
                    <Button
                      className={`${classes.textButton}`}
                      variant="text"
                      onClick={() => handleIgnore(friend)}
                    >
                      Ignore
                    </Button>
                    <Button
                      className={`${classes.textButton} ${classes.outButton}`}
                      variant="outlined"
                      onClick={() => handleAccept(friend)}
                    >
                      Accept
                    </Button>
                  </Box>
                </Box>
                <div
                  style={{
                    height: ".6px",
                    backgroundColor: "#ebebeb",
                    width: "100%",
                  }}
                />
              </>
            ))
          ) : (
            <p style={{ color: "#777", fontWeight: "400" }}>
              No pending friend request
            </p>
          )}
          <br />
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {requests.length > MAX_FRIENDS_TO_DISPLAY && (
              <Button onClick={handleShowMoreClick}>
                {showAll ? "Show less" : "Show more"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RequestCard;
